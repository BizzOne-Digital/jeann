import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  assertBuyerTransactionAccess,
  loadTransactionForBuyer,
} from "@/lib/transactions/buyer-access";
import { getTransactionBankingSummary } from "@/lib/banking/transaction-banking-summary";
import { WORKFLOW_STATUS_LABELS, allowedTransitionsFrom } from "@/lib/transactions/workflow";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const tx = await loadTransactionForBuyer(id, auth.ctx.userId, access.organizationId);

    const { CommercialTerms, WorkflowStep, Document } = await import("@/models");

    const terms = await CommercialTerms.findOne({ transactionId: tx._id })
      .sort({ version: -1 })
      .lean();
    const steps = await WorkflowStep.find({ transactionId: tx._id }).sort({ order: 1 }).lean();
    const documents = await Document.find({
      transactionId: tx._id,
      deletedAt: null,
      buyerVisible: true,
    }).lean();
    const banking = await getTransactionBankingSummary(tx._id);

    return NextResponse.json({
      transaction: {
        id: String(tx._id),
        transactionNumber: tx.transactionNumber,
        workflowStatus: tx.workflowStatus,
        workflowLabel: WORKFLOW_STATUS_LABELS[tx.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS],
        status: tx.status,
        currentStepKey: tx.currentStepKey,
        buyerVisibleNotes: tx.buyerVisibleNotes,
        submittedAt: tx.submittedAt,
        createdAt: tx.createdAt,
      },
      commercialTerms: terms,
      workflowSteps: steps.map((s) => ({
        key: s.key,
        order: s.order,
        title: s.title,
        status: s.status,
        skipReason: s.skipReason,
      })),
      documents: documents.map((d) => ({
        id: String(d._id),
        title: d.title,
        documentType: d.documentType,
        workflowStatus: d.workflowStatus,
        currentVersionId: d.currentVersionId ? String(d.currentVersionId) : null,
      })),
      banking: banking
        ? {
            status: banking.status,
            statusLabel: banking.statusLabel,
            instrumentType: banking.instrumentType,
            instrumentId: banking.instrumentId,
          }
        : null,
      allowedTransitions: allowedTransitionsFrom(tx.workflowStatus).map((t) => t.to),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
