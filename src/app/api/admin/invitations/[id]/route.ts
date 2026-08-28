import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { resendInvitation, revokeInvitation } from "@/lib/invitations/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "users:write" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as { action?: string };
    const meta = auditRequestMeta(request);

    if (body.action === "revoke") {
      await revokeInvitation(id);
      await writeAuditEvent({
        action: "invitation.revoked",
        targetType: "invitation",
        targetId: id,
        actorUserId: auth.ctx.userId,
        ...meta,
      });
      return NextResponse.json({ ok: true });
    }

    const result = await resendInvitation(id, auth.ctx.userId);
    await writeAuditEvent({
      action: "invitation.resent",
      targetType: "invitation",
      targetId: id,
      actorUserId: auth.ctx.userId,
      ...meta,
    });
    return NextResponse.json({ ok: true, expiresAt: result.expiresAt });
  } catch (error) {
    return handleApiError(error);
  }
}
