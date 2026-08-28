import { Types } from "mongoose";
import { hashPassword } from "@/lib/auth/password";
import { logoutAllSessions } from "@/lib/auth/session";
import { sendVerificationCode, verifyUserCode } from "@/lib/auth/verification-service";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export async function requestPasswordReset(email: string): Promise<{ ok: true }> {
  if (!isMongoConfigured()) return { ok: true };

  await tryConnectMongo();
  const { User } = await import("@/models");
  const normalized = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalized, deletedAt: null }).lean();
  if (!user) return { ok: true };

  await sendVerificationCode({
    userId: user._id,
    channel: "email",
    purpose: "password_reset",
    destination: user.email,
    name: user.name,
  });

  return { ok: true };
}

export async function completePasswordReset(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ ok: boolean; reason?: string }> {
  if (!isMongoConfigured()) {
    return { ok: false, reason: "database_unavailable" };
  }

  await tryConnectMongo();
  const { User } = await import("@/models");
  const normalized = input.email.trim().toLowerCase();
  const user = await User.findOne({ email: normalized, deletedAt: null });
  if (!user) return { ok: false, reason: "invalid_request" };

  const verification = await verifyUserCode({
    userId: user._id,
    purpose: "password_reset",
    code: input.code,
  });
  if (!verification.valid) {
    return { ok: false, reason: verification.reason ?? "invalid_code" };
  }

  user.passwordHash = await hashPassword(input.newPassword);
  user.passwordChangedAt = new Date();
  user.failedLoginCount = 0;
  user.lockedUntil = undefined;
  if (user.status === "locked") user.status = "active";
  await user.save();

  await logoutAllSessions(user._id);

  return { ok: true };
}
