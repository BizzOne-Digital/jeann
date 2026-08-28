import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completePasswordReset } from "@/lib/auth/password-reset";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(254),
  code: z.string().trim().min(4).max(12),
  newPassword: z
    .string()
    .min(12)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reset request." }, { status: 422 });
  }

  const meta = auditRequestMeta(request);
  const result = await completePasswordReset({
    email: parsed.data.email,
    code: parsed.data.code,
    newPassword: parsed.data.newPassword,
  });

  if (!result.ok) {
    await writeAuditEvent({
      action: "password.reset_failed",
      targetType: "user",
      result: "failure",
      failureReason: result.reason,
      ...meta,
    });
    return NextResponse.json({ error: "Invalid or expired reset code." }, { status: 400 });
  }

  await writeAuditEvent({
    action: "password.reset_completed",
    targetType: "user",
    ...meta,
  });

  return NextResponse.json({ ok: true });
}
