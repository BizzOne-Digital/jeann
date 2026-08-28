import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth/password-reset";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }

  const meta = auditRequestMeta(request);
  await requestPasswordReset(parsed.data.email);
  await writeAuditEvent({
    action: "password.reset_requested",
    targetType: "user",
    ...meta,
    metadata: { emailDomain: parsed.data.email.split("@")[1] },
  });

  return NextResponse.json({
    ok: true,
    message: "If an account exists, a reset code has been sent.",
  });
}
