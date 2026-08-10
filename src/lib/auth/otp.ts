import { randomInt } from "crypto";
import { Types } from "mongoose";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import {
  VerificationChallenge,
  type VerificationPurpose,
} from "@/models/VerificationChallenge";

export const DEFAULT_OTP_LENGTH = 6;
export const DEFAULT_OTP_TTL_MS = 10 * 60 * 1000;
export const MAX_OTP_ATTEMPTS = 5;

export function generateOtpCode(length = DEFAULT_OTP_LENGTH): string {
  const max = 10 ** length;
  const num = randomInt(0, max);
  return num.toString().padStart(length, "0");
}

export async function hashOtp(code: string): Promise<string> {
  return hashPassword(code, 10);
}

export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return verifyPassword(code, hash);
}

export interface StoreOtpOptions {
  userId: string | Types.ObjectId;
  channel: "email" | "phone";
  purpose: VerificationPurpose;
  code: string;
  ttlMs?: number;
}

/** Persist hashed OTP when Mongo is available; otherwise returns in-memory metadata only. */
export async function storeOtpChallenge(
  options: StoreOtpOptions,
): Promise<{ expiresAt: Date; challengeId?: string }> {
  const codeHash = await hashOtp(options.code);
  const expiresAt = new Date(Date.now() + (options.ttlMs ?? DEFAULT_OTP_TTL_MS));
  const userId =
    options.userId instanceof Types.ObjectId
      ? options.userId
      : new Types.ObjectId(options.userId);

  if (!isMongoConfigured()) {
    return { expiresAt };
  }

  await tryConnectMongo();
  await VerificationChallenge.updateMany(
    { userId, purpose: options.purpose, consumedAt: null },
    { $set: { consumedAt: new Date() } },
  );

  const doc = await VerificationChallenge.create({
    userId,
    channel: options.channel,
    codeHash,
    purpose: options.purpose,
    expiresAt,
    attempts: 0,
  });

  return { expiresAt, challengeId: doc._id.toString() };
}

export interface VerifyStoredOtpOptions {
  userId: string | Types.ObjectId;
  purpose: VerificationPurpose;
  code: string;
}

export async function verifyStoredOtp(
  options: VerifyStoredOtpOptions,
): Promise<{ valid: boolean; reason?: string }> {
  if (!isMongoConfigured()) {
    return { valid: false, reason: "database_unavailable" };
  }

  await tryConnectMongo();
  const userId =
    options.userId instanceof Types.ObjectId
      ? options.userId
      : new Types.ObjectId(options.userId);

  const challenge = await VerificationChallenge.findOne({
    userId,
    purpose: options.purpose,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .select("+codeHash")
    .sort({ createdAt: -1 });

  if (!challenge) {
    return { valid: false, reason: "not_found_or_expired" };
  }

  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    return { valid: false, reason: "max_attempts" };
  }

  challenge.attempts += 1;
  await challenge.save();

  const match = await verifyOtp(options.code, challenge.codeHash);
  if (!match) {
    return { valid: false, reason: "invalid_code" };
  }

  challenge.consumedAt = new Date();
  await challenge.save();

  return { valid: true };
}

export function isOtpExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() <= Date.now();
}
