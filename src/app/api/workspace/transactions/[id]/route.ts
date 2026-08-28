import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  WORKFLOW_STATUS_LABELS,
  allowedTransitionsFrom,
} from "@/lib/transactions/workflow";
import {
  PROCUREMENT_STATUS_LABELS,
  allowedProcurementTransitionsFrom,
} from "@/lib/transactions/procurement-workflow";
import { getTransactionBankingSummary } from "@/lib/banking/transaction-banking-summary";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }

    const { id } = await params;
    const { Transaction, CommercialTerms, ProcurementTerms, WorkflowStep, Document } =
      await import("@/models");

    const tx = await Transaction.findById(id).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const isProcurement = tx.transactionType === "supplier_purchase";
    const terms = isProcurement
      ? await ProcurementTerms.findOne({ transactionId: tx._id }).sort({ version: -1 }).lean()
      : await CommercialTerms.findOne({ transactionId: tx._id }).sort({ version: -1 }).lean();

    const steps = await WorkflowStep.find({ transactionId: tx._id }).sort({ order: 1 }).lean();
    const documents = await Document.find({ transactionId: tx._id, deletedAt: null }).lean();
    const banking = await getTransactionBankingSummary(tx._id);

    const allowedTransitions = isProcurement
      ? allowedProcurementTransitionsFrom(tx.workflowStatus).map((t) => t.to)
      : allowedTransitionsFrom(tx.workflowStatus).map((t) => t.to);

    return NextResponse.json({
      transaction: {
        id: String(tx._id),
        transactionNumber: tx.transactionNumber,
        transactionType: tx.transactionType,
        side: tx.side,
        workflowStatus: tx.workflowStatus,
        workflowLabel: isProcurement
          ? (PROCUREMENT_STATUS_LABELS[tx.workflowStatus] ?? tx.workflowStatus)
          : WORKFLOW_STATUS_LABELS[tx.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS],
        status: tx.status,
        currentStepKey: tx.currentStepKey,
        buyerVisibleNotes: tx.buyerVisibleNotes,
        supplierVisibleNotes: tx.supplierVisibleNotes,
        internalNotes: tx.internalNotes,
        createdAt: tx.createdAt,
      },
      terms,
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
        buyerVisible: d.buyerVisible,
        supplierVisible: d.supplierVisible,
        currentVersionId: d.currentVersionId ? String(d.currentVersionId) : null,
      })),
      banking: banking
        ? {
            id: banking.id,
            instrumentId: banking.instrumentId,
            status: banking.status,
            statusLabel: banking.statusLabel,
            instrumentType: banking.instrumentType,
            currency: banking.currency,
            amount: banking.amount,
          }
        : null,
      allowedTransitions,
      isInternal: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
