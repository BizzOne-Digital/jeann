import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { getEnv, getSessionSecret } from "@/lib/config/env";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { Session } from "@/models/Session";
import { User, type UserLean } from "@/models/User";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
} from "@/lib/auth/constants";
import { hashIp, randomToken, sha256 } from "@/lib/auth/crypto";
import { createDevSession, getDevSession, revokeDevSession } from "@/lib/auth/dev-store";

export interface SessionPayload {
  sid: string;
  uid: string;
  tv: string;
}

export interface ActiveSession {
  sessionId: string;
  userId: string;
  user: UserLean;
  expiresAt: Date;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

function cookieOptions(expiresAt: Date) {
  const env = getEnv();
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

async function signSessionToken(payload: SessionPayload, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
}

async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sid = payload.sid;
    const uid = payload.uid;
    const tv = payload.tv;
    if (typeof sid !== "string" || typeof uid !== "string" || typeof tv !== "string") {
      return null;
    }
    return { sid, uid, tv };
  } catch {
    return null;
  }
}

export interface CreateSessionOptions {
  userId: string | Types.ObjectId;
  userAgent?: string;
  ip?: string;
  ttlMs?: number;
}

export async function createSession(
  options: CreateSessionOptions,
): Promise<{ token: string; sessionId: string; expiresAt: Date }> {
  const rawToken = randomToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + (options.ttlMs ?? SESSION_TTL_MS));

  let sessionId: string;
  let uid: string;

  if (isMongoConfigured()) {
    const userId =
      options.userId instanceof Types.ObjectId
        ? options.userId
        : new Types.ObjectId(String(options.userId));
    uid = userId.toString();
    if (!(await tryConnectMongo())) {
      throw new Error("Database unavailable");
    }
    const doc = await Session.create({
      userId,
      tokenHash,
      expiresAt,
      userAgent: options.userAgent,
      ipHash: hashIp(options.ip),
    });
    sessionId = doc._id.toString();
  } else {
    uid = String(options.userId);
    const session = await createDevSession(uid, tokenHash, expiresAt);
    sessionId = session.id;
  }

  const jwt = await signSessionToken(
    { sid: sessionId, uid, tv: tokenHash },
    expiresAt,
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, jwt, cookieOptions(expiresAt));

  return { token: jwt, sessionId, expiresAt };
}

export async function getSession(): Promise<ActiveSession | null> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return null;

  const payload = await verifySessionToken(cookie);
  if (!payload) return null;

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const session = await Session.findOne({
      _id: payload.sid,
      userId: payload.uid,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .select("+tokenHash")
      .lean();

    if (!session || session.tokenHash !== payload.tv) return null;

    const user = await User.findById(payload.uid).lean();
    if (!user || user.status === "disabled" || user.deletedAt) return null;

    return {
      sessionId: session._id.toString(),
      userId: payload.uid,
      user,
      expiresAt: session.expiresAt,
    };
  }

  const record = await getDevSession(payload.sid, payload.uid, payload.tv);
  if (!record || record.user.status !== "active") return null;
  return {
    sessionId: record.session.id,
    userId: record.user.id,
    // The portal only needs identity fields when operating without Mongo.
    user: record.user as unknown as UserLean,
    expiresAt: new Date(record.session.expiresAt),
  };
}

export async function destroySession(sessionId?: string): Promise<void> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE_NAME)?.value;

  try {
    if (sessionId && isMongoConfigured()) {
      if (await tryConnectMongo()) {
        await Session.updateOne(
          { _id: sessionId, revokedAt: null },
          { $set: { revokedAt: new Date() } },
        );
      }
    } else if (cookie && isMongoConfigured()) {
      const payload = await verifySessionToken(cookie);
      if (payload && (await tryConnectMongo())) {
        await Session.updateOne(
          { _id: payload.sid, revokedAt: null },
          { $set: { revokedAt: new Date() } },
        );
      }
    } else if (sessionId) {
      await revokeDevSession(sessionId);
    } else if (cookie && !isMongoConfigured()) {
      const payload = await verifySessionToken(cookie);
      if (payload) await revokeDevSession(payload.sid);
    }
  } catch (error) {
    console.error("[destroySession]", error);
  }

  jar.delete(SESSION_COOKIE_NAME);
}

export async function rotateSession(options: {
  userAgent?: string;
  ip?: string;
}): Promise<{ token: string; sessionId: string; expiresAt: Date } | null> {
  const current = await getSession();
  if (!current) return null;

  await destroySession(current.sessionId);

  const rawToken = randomToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  let sessionId: string;

  if (isMongoConfigured()) {
    const userId = new Types.ObjectId(current.userId);
    if (!(await tryConnectMongo())) return null;
    const doc = await Session.create({
      userId,
      tokenHash,
      expiresAt,
      rotatedFrom: new Types.ObjectId(current.sessionId),
      userAgent: options.userAgent,
      ipHash: hashIp(options.ip),
    });
    sessionId = doc._id.toString();
  } else {
    const session = await createDevSession(current.userId, tokenHash, expiresAt);
    sessionId = session.id;
  }

  const jwt = await signSessionToken(
    { sid: sessionId, uid: current.userId, tv: tokenHash },
    expiresAt,
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, jwt, cookieOptions(expiresAt));

  return { token: jwt, sessionId, expiresAt };
}

/** Revoke all active sessions for a user (password change, security event). */
export async function logoutAllSessions(userId: string | Types.ObjectId): Promise<number> {
  if (!isMongoConfigured()) {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE_NAME);
    return 1;
  }

  await tryConnectMongo();
  const uid =
    userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
  const result = await Session.updateMany(
    { userId: uid, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);

  return result.modifiedCount;
}
