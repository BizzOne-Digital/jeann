import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api/require-api-auth";
import {
  sendVerificationCode,
  verifyUserCode,
  markPhoneVerified,
} from "@/lib/auth/verification-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { isMongoConfigured } from "@/lib/db/mongoose";

export const runtime = "nodejs";

const verifySchema = z.object({
  code: z.string().trim().min(4).max(12),
});

const updatePhoneSchema = z.object({
  phone: z.string().trim().min(7).max(40),
});

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;

  const parsed = verifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification code." }, { status: 422 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const meta = auditRequestMeta(request);
  const result = await verifyUserCode({
    userId: auth.ctx.userId,
    purpose: "phone_verify",
    code: parsed.data.code,
  });

  if (!result.valid) {
    await writeAuditEvent({
      action: "phone.verification_failed",
      targetType: "user",
      targetId: auth.ctx.userId,
      actorUserId: auth.ctx.userId,
      result: "failure",
      failureReason: result.reason,
      ...meta,
    });
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  await markPhoneVerified(auth.ctx.userId);
  await writeAuditEvent({
    action: "phone.verified",
    targetType: "user",
    targetId: auth.ctx.userId,
    actorUserId: auth.ctx.userId,
    ...meta,
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;

  const bodyParsed = updatePhoneSchema.safeParse(await request.json());
  if (!bodyParsed.success) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 422 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { User } = await import("@/models");
  const user = await User.findById(auth.ctx.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  user.phone = bodyParsed.data.phone;
  user.phoneVerifiedAt = undefined;
  await user.save();

  const sent = await sendVerificationCode({
    userId: auth.ctx.userId,
    channel: "phone",
    purpose: "phone_verify",
    destination: bodyParsed.data.phone,
    name: user.name,
  });

  return NextResponse.json({ ok: true, devCode: sent.devCode });
}
