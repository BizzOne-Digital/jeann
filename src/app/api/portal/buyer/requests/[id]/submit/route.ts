import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { submitBuyerRequest } from "@/lib/transactions/buyer-request-service";
import {
  BUYER_ICPO_REVIEW_NOTICE,
  BUYER_LOI_REVIEW_NOTICE,
} from "@/lib/content/buyer-portal-guidance";
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

    const reviewNotice =
      doc.submissionKind === "loi_upload"
        ? BUYER_LOI_REVIEW_NOTICE
        : doc.submissionKind === "icpo_form" || doc.submissionKind === "icpo_upload"
          ? BUYER_ICPO_REVIEW_NOTICE
          : undefined;

    return NextResponse.json({
      ok: true,
      reference: doc.reference,
      status: doc.status,
      submissionKind: doc.submissionKind,
      reviewNotice,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "incomplete_request") {
      return NextResponse.json({ error: "Complete required fields first." }, { status: 422 });
    }
    if (error instanceof Error && error.message === "attachment_required") {
      return NextResponse.json({ error: "Upload your PO, ICPO, or LOI document first." }, { status: 422 });
    }
    if (error instanceof Error && error.message === "invalid_incoterm") {
      return NextResponse.json({ error: "Incoterms must be FOB or CIF." }, { status: 422 });
    }
    return handleApiError(error);
  }
}
