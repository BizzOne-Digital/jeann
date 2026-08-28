import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { acceptInvitation } from "@/lib/invitations/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  phone: z.string().trim().min(7).max(40).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration data." }, { status: 422 });
  }

  const meta = auditRequestMeta(request);

  try {
    const result = await acceptInvitation({
      rawToken: token,
      password: parsed.data.password,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
    });

    await writeAuditEvent({
      action: "invitation.accepted",
      targetType: "invitation",
      actorUserId: result.userId,
      organizationId: result.organizationId,
      ...meta,
    });

    return NextResponse.json({
      ok: true,
      redirectTo: "/login",
      message: "Account created. Sign in and verify your email.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message === "email_exists") {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }
    if (["not_found", "expired", "revoked", "already_accepted"].includes(message)) {
      return NextResponse.json({ error: "Invitation is invalid or expired." }, { status: 400 });
    }
    console.error("[invite/accept]", error);
    return NextResponse.json({ error: "Unable to accept invitation." }, { status: 500 });
  }
}
