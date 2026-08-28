import { NextRequest, NextResponse } from "next/server";
import { findInvitationByToken } from "@/lib/invitations/service";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const { invitation, valid, reason } = await findInvitationByToken(token);

  if (!invitation) {
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    valid,
    reason,
    email: invitation.email,
    contactName: invitation.contactName,
    organizationType: invitation.organizationType,
    intendedLegalName: invitation.intendedLegalName,
    roles: invitation.roles,
    expiresAt: invitation.expiresAt,
  });
}
