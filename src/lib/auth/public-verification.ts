import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { getClientIp } from "@/lib/api/request-meta";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type VerificationChannelName = "phone" | "email";

/** Per-IP and per-email throttle for unauthenticated verification endpoints. */
export function throttleVerification(
  request: NextRequest,
  email: string,
  bucket: string,
  limit: number,
): boolean {
  const ip = getClientIp(request) ?? "unknown";
  const byIp = checkRateLimit({ key: `${bucket}:ip:${ip}`, limit: limit * 4, windowMs: 15 * 60 * 1000 });
  const byEmail = checkRateLimit({ key: `${bucket}:email:${email}`, limit, windowMs: 15 * 60 * 1000 });
  return byIp.allowed && byEmail.allowed;
}

/** Only accounts still waiting for verification can use the public endpoints. */
export async function findPendingUserByEmail(email: string) {
  if (!isMongoConfigured() || !(await tryConnectMongo())) return null;
  const { User } = await import("@/models");
  const user = await User.findOne({
    normalizedEmail: email.trim().toLowerCase(),
    deletedAt: null,
  }).lean();
  if (!user) return null;
  const needsEmail = !user.emailVerifiedAt;
  const needsPhone = !user.phoneVerifiedAt;
  if (!needsEmail && !needsPhone) return null;
  if (user.status !== "pending_verification" && user.status !== "active") return null;
  return user;
}
