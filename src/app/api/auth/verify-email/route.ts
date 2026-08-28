import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api/require-api-auth";
import {
  sendVerificationCode,
  verifyUserCode,
  markEmailVerified,
  markPhoneVerified,
} from "@/lib/auth/verification-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { isMongoConfigured } from "@/lib/db/mongoose";

export const runtime = "nodejs";

const verifySchema = z.object({
  code: z.string().trim().min(4).max(12),
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
    purpose: "email_verify",
    code: parsed.data.code,
  });

  if (!result.valid) {
    await writeAuditEvent({
      action: "email.verification_failed",
      targetType: "user",
      targetId: auth.ctx.userId,
      actorUserId: auth.ctx.userId,
      result: "failure",
      failureReason: result.reason,
      ...meta,
    });
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  await markEmailVerified(auth.ctx.userId);
  await writeAuditEvent({
    action: "email.verified",
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

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { User } = await import("@/models");
  const user = await User.findById(auth.ctx.userId).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const sent = await sendVerificationCode({
    userId: auth.ctx.userId,
    channel: "email",
    purpose: "email_verify",
    destination: user.email,
    name: user.name,
  });

  return NextResponse.json({ ok: true, devCode: sent.devCode });
}
