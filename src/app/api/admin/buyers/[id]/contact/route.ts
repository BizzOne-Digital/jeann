import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { markEmailVerified, markPhoneVerified } from "@/lib/auth/verification-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

const schema = z.object({
  action: z.enum(["mark_email_verified", "mark_phone_verified"]),
});

/** Admin confirms the buyer's contact manually (e.g. when the code never arrived). Audited. */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid buyer id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const buyer = await loadBuyerDetail(id);
  if (!buyer?.primaryContact) {
    return NextResponse.json({ error: "Buyer contact not found." }, { status: 404 });
  }
  const contactId = buyer.primaryContact.userId;

  if (parsed.data.action === "mark_email_verified") await markEmailVerified(contactId);
  else await markPhoneVerified(contactId);

  await writeAuditEvent({
    action: `admin.${parsed.data.action}`,
    targetType: "user",
    targetId: contactId,
    actorUserId: String(session.userId),
    organizationId: id,
    ...auditRequestMeta(request),
  });

  return NextResponse.json({ ok: true, buyer: await loadBuyerDetail(id) });
}
