import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createInvitation } from "@/lib/invitations/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import type { OrganizationType } from "@/models/Organization";
import { ROLE_KEYS } from "@/models/shared";
import type { RoleKey } from "@/lib/authorization/permissions";

export const runtime = "nodejs";

const createSchema = z.object({
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40).optional(),
  contactName: z.string().trim().min(2).max(120).optional(),
  organizationType: z.enum(["buyer", "supplier", "internal", "banking_adviser"]),
  organizationId: z.string().optional(),
  intendedLegalName: z.string().trim().max(200).optional(),
  roles: z
    .array(z.string())
    .min(1)
    .refine((roles) => roles.every((r) => (ROLE_KEYS as readonly string[]).includes(r)), {
      message: "Invalid role",
    }),
});

export async function GET() {
  const auth = await requireApiAuth({ permissions: "users:write" });
  if ("error" in auth) return auth.error;

  const { Invitation } = await import("@/models");
  const items = await Invitation.find().sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({
    items: items.map((i) => ({
      id: String(i._id),
      email: i.email,
      contactName: i.contactName,
      organizationType: i.organizationType,
      roles: i.roles,
      status: i.status,
      expiresAt: i.expiresAt,
      acceptedAt: i.acceptedAt,
      revokedAt: i.revokedAt,
      createdAt: i.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "users:write" });
    if ("error" in auth) return auth.error;

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid invitation data." }, { status: 422 });
    }

    const input = parsed.data;
    const result = await createInvitation({
      email: input.email,
      phone: input.phone,
      contactName: input.contactName,
      organizationType: input.organizationType as OrganizationType,
      organizationId: input.organizationId,
      intendedLegalName: input.intendedLegalName,
      roles: input.roles as RoleKey[],
      createdBy: auth.ctx.userId,
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "invitation.created",
      targetType: "invitation",
      targetId: result.invitationId,
      actorUserId: auth.ctx.userId,
      ...meta,
      metadata: { email: input.email, roles: input.roles },
    });

    return NextResponse.json({
      ok: true,
      invitationId: result.invitationId,
      expiresAt: result.expiresAt,
      ...(process.env.NODE_ENV !== "production"
        ? { inviteUrl: result.inviteUrl }
        : {}),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
