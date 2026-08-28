import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { submitBuyerRequest } from "@/lib/transactions/buyer-request-service";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const meta = auditRequestMeta(request);

    const doc = await submitBuyerRequest({
      requestId: id,
      organizationId: access.organizationId,
      userId: auth.ctx.userId,
      ipHash: meta.ipHash,
    });

    await writeAuditEvent({
      action: "buyer_request.submitted",
      targetType: "purchase_request",
      targetId: doc._id,
      actorUserId: auth.ctx.userId,
      organizationId: access.organizationId,
      ...meta,
    });

    return NextResponse.json({ ok: true, reference: doc.reference, status: doc.status });
  } catch (error) {
    if (error instanceof Error && error.message === "incomplete_request") {
      return NextResponse.json({ error: "Complete required fields first." }, { status: 422 });
    }
    return handleApiError(error);
  }
}
