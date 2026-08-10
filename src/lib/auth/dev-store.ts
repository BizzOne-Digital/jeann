import { randomBytes, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type DevRole = "buyer" | "supplier" | "banking" | "employee" | "admin";

export interface DevUser {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: DevRole;
  status: "active" | "review";
  createdAt: string;
}

export interface DevSession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}

interface DevData {
  users: DevUser[];
  sessions: DevSession[];
}

const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "auth.json");
let data: DevData = { users: [], sessions: [] };
let loaded = false;
let writing = Promise.resolve();

async function load() {
  if (loaded) return data;
  loaded = true;
  try {
    data = JSON.parse(await readFile(file, "utf8")) as DevData;
  } catch {
    data = { users: [], sessions: [] };
  }
  return data;
}

async function persist() {
  try {
    await mkdir(directory, { recursive: true });
    await writeFile(file, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Keep development authentication functional in read-only deployments.
  }
}

async function commit() {
  writing = writing.then(persist);
  await writing;
}

export function normalizeCompanyName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function findDevUserByEmail(email: string) {
  const current = await load();
  return current.users.find((user) => user.email === email.trim().toLowerCase()) ?? null;
}

export async function findDevOrganization(name: string) {
  const normalized = normalizeCompanyName(name);
  const current = await load();
  return current.users.find(
    (user) => normalizeCompanyName(user.organizationName) === normalized,
  ) ?? null;
}

export async function createDevBuyer(input: Omit<DevUser, "id" | "organizationId" | "role" | "status" | "createdAt">) {
  const current = await load();
  const user: DevUser = {
    ...input,
    id: randomUUID(),
    organizationId: randomUUID(),
    role: "buyer",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  current.users.push(user);
  await commit();
  return user;
}

export async function createDevSession(userId: string, tokenHash: string, expiresAt: Date) {
  const current = await load();
  const session = {
    id: randomBytes(16).toString("hex"),
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  };
  current.sessions.push(session);
  await commit();
  return session;
}

export async function getDevSession(id: string, userId: string, tokenHash: string) {
  const current = await load();
  const session = current.sessions.find(
    (entry) => entry.id === id && entry.userId === userId && entry.tokenHash === tokenHash,
  );
  if (!session || new Date(session.expiresAt) <= new Date()) return null;
  const user = current.users.find((entry) => entry.id === userId);
  return user ? { session, user } : null;
}

export async function revokeDevSession(id: string) {
  const current = await load();
  current.sessions = current.sessions.filter((session) => session.id !== id);
  await commit();
}
