import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { WORKFLOW_STATUS_LABELS } from "@/lib/transactions/workflow";
import { PROCUREMENT_STATUS_LABELS } from "@/lib/transactions/procurement-workflow";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }

    const { Transaction } = await import("@/models");
    const items = await Transaction.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        transactionType: t.transactionType,
        side: t.side,
        workflowStatus: t.workflowStatus,
        workflowLabel:
          t.transactionType === "supplier_purchase"
            ? (PROCUREMENT_STATUS_LABELS[t.workflowStatus] ?? t.workflowStatus)
            : (WORKFLOW_STATUS_LABELS[t.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS] ??
              t.workflowStatus),
        status: t.status,
        currentStepKey: t.currentStepKey,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
