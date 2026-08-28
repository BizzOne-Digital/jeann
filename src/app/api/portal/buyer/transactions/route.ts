import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { WORKFLOW_STATUS_LABELS } from "@/lib/transactions/workflow";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { Transaction } = await import("@/models");
    const items = await Transaction.find({
      organizationId: access.organizationId,
      side: "buyer",
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
        workflowLabel: WORKFLOW_STATUS_LABELS[t.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS],
        status: t.status,
        currentStepKey: t.currentStepKey,
        createdAt: t.createdAt,
        submittedAt: t.submittedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
