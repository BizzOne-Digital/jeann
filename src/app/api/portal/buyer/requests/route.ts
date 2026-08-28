import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import {
  createBuyerRequestDraft,
  updateBuyerRequestDraft,
  deleteBuyerRequestDraft,
} from "@/lib/transactions/buyer-request-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { PurchaseRequest } = await import("@/models");
    const items = await PurchaseRequest.find({
      organizationId: access.organizationId,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((r) => ({
        id: String(r._id),
        reference: r.reference,
        productName: r.productName,
        status: r.status,
        quantity: r.quantity,
        unit: r.unit,
        incoterm: r.incoterm,
        convertedTransactionId: r.convertedTransactionId
          ? String(r.convertedTransactionId)
          : null,
        createdAt: r.createdAt,
        lockedAt: r.lockedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const body = (await request.json()) as Record<string, unknown>;

    const doc = await createBuyerRequestDraft({
      organizationId: access.organizationId,
      userId: auth.ctx.userId,
      data: body,
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "buyer_request.created",
      targetType: "purchase_request",
      targetId: doc._id,
      actorUserId: auth.ctx.userId,
      organizationId: access.organizationId,
      ...meta,
    });

    return NextResponse.json({ ok: true, id: String(doc._id), reference: doc.reference });
  } catch (error) {
    return handleApiError(error);
  }
}
