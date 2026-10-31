import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  markEmailVerified,
  markPhoneVerified,
  verifyUserCode,
} from "@/lib/auth/verification-service";
import { findPendingUserByEmail, throttleVerification } from "@/lib/auth/public-verification";
import { isPrimaryContactVerified } from "@/lib/auth/verification-policy";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(320),
  channel: z.enum(["phone", "email"]),
  code: z.string().trim().min(4).max(12),
});

const INVALID = { error: "Invalid or expired code. If you requested more than one code, use the newest code." };

/** Public (no session): verify the phone (primary) or email (secondary) code after registration. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the verification code." }, { status: 422 });
  }
  const { email, channel, code } = parsed.data;

  if (!throttleVerification(request, email.toLowerCase(), "verify-code", 8)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const user = await findPendingUserByEmail(email);
  if (!user) return NextResponse.json(INVALID, { status: 400 });

  const userId = String(user._id);
  const purpose = channel === "phone" ? "phone_verify" : "email_verify";
  const result = await verifyUserCode({ userId, purpose, code });
  const meta = auditRequestMeta(request);

  if (!result.valid) {
    await writeAuditEvent({
      action: `${channel}.verification_failed`,
      targetType: "user",
      targetId: userId,
      actorUserId: userId,
      result: "failure",
      failureReason: result.reason,
      ...meta,
    });
    return NextResponse.json(INVALID, { status: 400 });
  }

  if (channel === "phone") await markPhoneVerified(userId);
  else await markEmailVerified(userId);

  await writeAuditEvent({
    action: `${channel}.verified`,
    targetType: "user",
    targetId: userId,
    actorUserId: userId,
    ...meta,
  });

  const emailVerified = channel === "email" ? true : Boolean(user.emailVerifiedAt);
  const phoneVerified = channel === "phone" ? true : Boolean(user.phoneVerifiedAt);

  return NextResponse.json({
    ok: true,
    emailVerified,
    phoneVerified,
    primaryVerified: isPrimaryContactVerified({ emailVerified, phoneVerified }),
  });
}
