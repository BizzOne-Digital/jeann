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
import { hasStandingFis } from "@/lib/transactions/banking-service";
import { resolveLcDeadline } from "@/lib/contracts/psa-terms";

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
    const fisOnRecord = await hasStandingFis(tx);
    const cisOnRecord = await hasStandingFis(tx, undefined, "cis");

    // One trade has two stages: stage 1 in the buyer portal (Finekarts sells) and stage 2 in the supplier portal
    // (Finekarts buys). The supplier order is linked to the buyer order and carries its number with a suffix.
    const summarize = async (t: { _id: unknown; transactionNumber: string; transactionType?: string; workflowStatus: string }, stage: 1 | 2) => {
      const rows = String(t._id) === String(tx._id) ? steps : await WorkflowStep.find({ transactionId: t._id }).sort({ order: 1 }).lean();
      const done = rows.filter((r) => ["completed", "skipped"].includes(String(r.status))).length;
      const next = rows.find((r) => !["completed", "skipped"].includes(String(r.status)));
      const procurement = t.transactionType === "supplier_purchase";
      return {
        id: String(t._id),
        number: t.transactionNumber,
        stage,
        portal: stage === 1 ? "Buyer portal" : "Supplier portal",
        role: stage === 1 ? "Finekarts sells" : "Finekarts buys",
        statusLabel: procurement
          ? (PROCUREMENT_STATUS_LABELS[t.workflowStatus] ?? t.workflowStatus)
          : (WORKFLOW_STATUS_LABELS[t.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS] ?? t.workflowStatus),
        stepsDone: done,
        stepsTotal: rows.length,
        nextStep: next ? { order: next.order, title: next.title } : null,
        isThis: String(t._id) === String(tx._id),
      };
    };
    const buyerStage = isProcurement
      ? tx.linkedTransactionId ? await Transaction.findById(tx.linkedTransactionId).lean() : null
      : tx;
    const supplierStage = isProcurement
      ? tx
      : await Transaction.findOne({ linkedTransactionId: tx._id, side: "supplier", deletedAt: null }).lean();
    const stages = {
      stage1: buyerStage ? await summarize(buyerStage, 1) : null,
      stage2: supplierStage ? await summarize(supplierStage, 2) : null,
    };

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
        locked: tx.status === "cancelled" || Boolean(tx.closedAt),
        currentStepKey: tx.currentStepKey,
        buyerVisibleNotes: tx.buyerVisibleNotes,
        supplierVisibleNotes: tx.supplierVisibleNotes,
        internalNotes: tx.internalNotes,
        createdAt: tx.createdAt,
        closedAt: tx.closedAt ?? null,
        lcDeadlineHours: resolveLcDeadline(tx).hours,
        lcDeadlineBusinessHours: resolveLcDeadline(tx).business,
      },
      terms,
      stages,
      workflowSteps: steps.map((s) => ({
        key: s.key,
        order: s.order,
        title: s.title,
        status: s.status,
        skipReason: s.skipReason,
      })),
      fisOnRecord,
      cisOnRecord,
      documents: documents.map((d) => ({
        id: String(d._id),
        title: d.title,
        documentType: d.documentType,
        workflowStatus: d.workflowStatus,
        buyerVisible: d.buyerVisible,
        supplierVisible: d.supplierVisible,
        bankingVisible: Boolean(d.bankingVisible),
        stepKey: d.stepKey,
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
