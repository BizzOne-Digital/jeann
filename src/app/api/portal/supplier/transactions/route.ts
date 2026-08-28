import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import { PROCUREMENT_STATUS_LABELS } from "@/lib/transactions/procurement-workflow";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:read" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { Transaction } = await import("@/models");
    const items = await Transaction.find({
      organizationId: access.organizationId,
      transactionType: "supplier_purchase",
      side: "supplier",
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        workflowStatus: t.workflowStatus,
        workflowLabel:
          PROCUREMENT_STATUS_LABELS[t.workflowStatus] ?? t.workflowStatus,
        status: t.status,
        currentStepKey: t.currentStepKey,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
