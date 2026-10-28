import { Types } from "mongoose";
import { getEnv } from "@/lib/config/env";
import { sendEmail } from "@/lib/email";
import {
  generateOtpCode,
  storeOtpChallenge,
  verifyStoredOtp,
} from "@/lib/auth/otp";
import type { VerificationPurpose, VerificationChannel } from "@/models/VerificationChallenge";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { isPrimaryContactVerified, isSmsConfigured } from "@/lib/auth/verification-policy";

export async function sendVerificationCode(input: {
  userId: string | Types.ObjectId;
  channel: VerificationChannel;
  purpose: VerificationPurpose;
  destination: string;
  name?: string;
}): Promise<{ sent: boolean; devCode?: string }> {
  const code = generateOtpCode();
  const { expiresAt } = await storeOtpChallenge({
    userId: input.userId,
    channel: input.channel,
    purpose: input.purpose,
    code,
  });

  const env = getEnv();
  const devExpose = env.NODE_ENV !== "production";

  if (input.channel === "email") {
    const subject =
      input.purpose === "password_reset"
        ? "Reset your Finekarts password"
        : input.purpose === "mfa_login"
          ? "Finekarts sign-in verification code"
          : input.purpose === "phone_verify"
            ? "Verify your phone number"
            : "Verify your email address";

    const text = `Hello ${input.name ?? "there"},\n\nYour verification code is: ${code}\n\nThis code expires at ${expiresAt.toISOString()}.\n\nIf you did not request this, ignore this message.`;

    await sendEmail({
      to: { email: input.destination },
      subject,
      text,
      tags: [input.purpose],
    });
  } else if (input.channel === "phone" && !isSmsConfigured()) {
    // No SMS provider on this server: deliver the phone code to the account's email instead.
    const { User } = await import("@/models");
    const uid = input.userId instanceof Types.ObjectId ? input.userId : new Types.ObjectId(input.userId);
    const user = await User.findById(uid).lean();
    if (user?.email) {
      await sendEmail({
        to: { email: user.email },
        subject: "Your Finekarts phone verification code",
        text: `Hello ${input.name ?? user.name ?? "there"},

Your phone verification code is: ${code}

This code expires at ${expiresAt.toISOString()}.

If you did not request this, ignore this message.`,
        tags: [input.purpose],
      });
    }
  } else if (input.channel === "phone") {
    const { sendSms } = await import("@/lib/sms");
    await sendSms({
      to: input.destination,
      body: `Finekarts verification code: ${code}`,
      tags: [input.purpose],
    });
  }

  return { sent: true, devCode: devExpose ? code : undefined };
}

export async function verifyUserCode(input: {
  userId: string | Types.ObjectId;
  purpose: VerificationPurpose;
  code: string;
}): Promise<{ valid: boolean; reason?: string }> {
  return verifyStoredOtp({
    userId: input.userId,
    purpose: input.purpose,
    code: input.code.trim(),
  });
}

export async function markEmailVerified(userId: string | Types.ObjectId): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { User } = await import("@/models");
  const uid = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
  await User.updateOne({ _id: uid }, { $set: { emailVerifiedAt: new Date() } });
  await activateIfPrimaryVerified(uid);
}

export async function markPhoneVerified(userId: string | Types.ObjectId): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { User } = await import("@/models");
  const uid = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
  await User.updateOne({ _id: uid }, { $set: { phoneVerifiedAt: new Date() } });
  await activateIfPrimaryVerified(uid);
}

/** Phone code is primary; email code is primary only when SMS is not configured. */
async function activateIfPrimaryVerified(uid: Types.ObjectId): Promise<void> {
  const { User } = await import("@/models");
  const user = await User.findById(uid).lean();
  if (!user || user.status !== "pending_verification") return;
  const verified = isPrimaryContactVerified({
    emailVerified: Boolean(user.emailVerifiedAt),
    phoneVerified: Boolean(user.phoneVerifiedAt),
  });
  if (verified) {
    await User.updateOne({ _id: uid }, { $set: { status: "active" } });
  }
}
