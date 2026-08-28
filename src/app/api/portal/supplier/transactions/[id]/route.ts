import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  assertSupplierTransactionAccess,
  loadProcurementTransactionForSupplier,
} from "@/lib/transactions/supplier-access";
import { getTransactionBankingSummary } from "@/lib/banking/transaction-banking-summary";
import {
  PROCUREMENT_STATUS_LABELS,
  allowedProcurementTransitionsFrom,
} from "@/lib/transactions/procurement-workflow";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:read" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const tx = await loadProcurementTransactionForSupplier(id, access.organizationId);

    const { ProcurementTerms, WorkflowStep, Document } = await import("@/models");

    const terms = await ProcurementTerms.findOne({ transactionId: tx._id })
      .sort({ version: -1 })
      .lean();
    const steps = await WorkflowStep.find({ transactionId: tx._id }).sort({ order: 1 }).lean();
    const documents = await Document.find({
      transactionId: tx._id,
      deletedAt: null,
      supplierVisible: true,
    }).lean();
    const banking = await getTransactionBankingSummary(tx._id);

    return NextResponse.json({
      transaction: {
        id: String(tx._id),
        transactionNumber: tx.transactionNumber,
        workflowStatus: tx.workflowStatus,
        workflowLabel: PROCUREMENT_STATUS_LABELS[tx.workflowStatus] ?? tx.workflowStatus,
        status: tx.status,
        currentStepKey: tx.currentStepKey,
        supplierVisibleNotes: tx.supplierVisibleNotes,
        createdAt: tx.createdAt,
      },
      procurementTerms: terms
        ? {
            productName: terms.productName,
            quantity: terms.quantity?.toString(),
            quantityUnit: terms.quantityUnit,
            quantityTolerance: terms.quantityTolerance,
            currency: terms.currency,
            procurementUnitPrice: terms.procurementUnitPrice?.toString(),
            procurementTotal: terms.procurementTotal?.toString(),
            incoterm: terms.incoterm,
            loadingPort: terms.loadingPort,
            destinationPlace: terms.destinationPlace,
            packaging: terms.packaging,
            inspection: terms.inspection,
            shipmentSchedule: terms.shipmentSchedule,
            paymentProposal: terms.paymentProposal,
            approvalStatus: terms.approvalStatus,
          }
        : null,
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
      allowedTransitions: allowedProcurementTransitionsFrom(tx.workflowStatus).map((t) => t.to),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
