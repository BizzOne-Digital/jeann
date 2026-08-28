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
  await User.updateOne(
    { _id: uid },
  {
    $set: { emailVerifiedAt: new Date() },
    $setOnInsert: {},
  });
  const user = await User.findById(uid).lean();
  if (user && user.status === "pending_verification") {
    await User.updateOne({ _id: uid }, { $set: { status: "active" } });
  }
}

export async function markPhoneVerified(userId: string | Types.ObjectId): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { User } = await import("@/models");
  const uid = userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
  await User.updateOne({ _id: uid }, { $set: { phoneVerifiedAt: new Date() } });
}
