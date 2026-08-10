import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type LeadKind =
  | "purchase-request"
  | "trade-offer"
  | "contact"
  | "booking"
  | "newsletter";

export interface StoredLead {
  id: string;
  kind: LeadKind;
  data: Record<string, unknown>;
  termsVersion: string;
  timestamp: string;
  ipHash: string;
}

const dataDirectory = path.join(process.cwd(), ".data");
const leadsPath = path.join(dataDirectory, "leads.json");
let memory: StoredLead[] = [];
let loaded = false;
let writing = Promise.resolve();

async function load(): Promise<StoredLead[]> {
  if (loaded) return memory;
  loaded = true;
  try {
    memory = JSON.parse(await readFile(leadsPath, "utf8")) as StoredLead[];
  } catch {
    memory = [];
  }
  return memory;
}

async function persist() {
  try {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(leadsPath, JSON.stringify(memory, null, 2), "utf8");
  } catch {
    // Serverless/read-only deployments retain the process-local fallback.
  }
}

export function hashIp(ip?: string | null): string {
  return createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 24);
}

export async function saveLead(
  kind: LeadKind,
  data: Record<string, unknown>,
  ip?: string | null,
): Promise<StoredLead> {
  await load();
  const lead: StoredLead = {
    id: randomUUID(),
    kind,
    data,
    termsVersion: String(data.termsVersion || "2026-01"),
    timestamp: new Date().toISOString(),
    ipHash: hashIp(ip),
  };
  memory.push(lead);
  writing = writing.then(persist);
  await writing;
  return lead;
}
