import { Types } from "mongoose";
import {
  allocateSupplierPurchaseTransactionNumber,
} from "@/lib/transactions/number";
import { findProcurementTransition } from "@/lib/transactions/procurement-workflow";
import { money, mulMoney } from "@/lib/finance/money";
import { notifyUser, notifyAdmins } from "@/lib/notifications/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import type { TransactionWorkflowStatus } from "@/models/Transaction";
import type { Permission } from "@/lib/authorization/permissions";
import { hasPermission } from "@/lib/authorization/permissions";
import { SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

export async function createProcurementTransaction(input: {
  supplierOrganizationId: string;
  actorUserId: string;
  sourceSupplierOfferId?: string;
  assignedTradeManagerId?: string;
  productId?: string;
  productName?: string;
  internalNotes?: string;
}) {
  await tryConnectMongo();
  const {
    Transaction,
    WorkflowStep,
    WorkflowTemplate,
    Organization,
    SupplierOffer,
    ProcurementTerms,
  } = await import("@/models");

  const supplierOrg = await Organization.findById(input.supplierOrganizationId);
  if (!supplierOrg || supplierOrg.type !== "supplier") throw new Error("invalid_supplier");
  if (supplierOrg.status !== "verified" || supplierOrg.onboardingStatus !== "approved") {
    throw new Error("supplier_not_approved");
  }

  let offer = null;
  if (input.sourceSupplierOfferId) {
    offer = await SupplierOffer.findById(input.sourceSupplierOfferId);
    if (!offer || offer.status !== "qualified") throw new Error("offer_not_qualified");
    if (String(offer.organizationId) !== input.supplierOrganizationId) {
      throw new Error("offer_org_mismatch");
    }
  }

  const transactionNumber = await allocateSupplierPurchaseTransactionNumber();
  const template = await WorkflowTemplate.findOne({
    key: "supplier_default_v1",
    version: 1,
  }).lean();

  const finekartsOrg = await Organization.findOne({ type: "internal" }).lean();

  const tx = await Transaction.create({
    transactionNumber,
    transactionType: "supplier_purchase",
    side: "supplier",
    organizationId: new Types.ObjectId(input.supplierOrganizationId),
    counterpartyOrgId: finekartsOrg?._id,
    sourceSupplierOfferId: offer?._id,
    productId: offer?.productId ?? (input.productId ? new Types.ObjectId(input.productId) : undefined),
    status: "active",
    workflowStatus: "offer_pending",
    currentStepKey: "supplier_sco_fco",
    templateId: template?._id,
    assignedTradeManagerId: input.assignedTradeManagerId
      ? new Types.ObjectId(input.assignedTradeManagerId)
      : new Types.ObjectId(input.actorUserId),
    createdBy: new Types.ObjectId(input.actorUserId),
    internalNotes: input.internalNotes,
    submittedAt: new Date(),
  });

  for (const step of SUPPLIER_WORKFLOW_STEPS) {
    await WorkflowStep.create({
      transactionId: tx._id,
      key: step.key,
      order: step.order,
      title: step.title,
      status: step.order === 1 ? "ready" : "not_started",
      locked: false,
    });
  }

  const qty = offer?.availableQuantity
    ? money(offer.availableQuantity.replace(/[^\d.]/g, "") || "0")
    : money("0");
  const unitPrice = offer?.price ? money(offer.price.replace(/[^\d.]/g, "") || "0") : money("0");
  const total = mulMoney(qty, unitPrice);

  await ProcurementTerms.create({
    transactionId: tx._id,
    organizationId: new Types.ObjectId(input.supplierOrganizationId),
    productId: offer?.productId,
    productName: offer?.productName ?? input.productName ?? "Product",
    productOrigin: offer?.origin,
    quantity: Types.Decimal128.fromString(qty.toString()),
    quantityUnit: offer?.unit ?? "MT",
    currency: offer?.currency ?? "USD",
    procurementUnitPrice: Types.Decimal128.fromString(unitPrice.toString()),
    procurementTotal: Types.Decimal128.fromString(total.toString()),
    incoterm: offer?.incoterm ?? "FOB",
    loadingPort: offer?.loadingPort,
    packaging: offer?.packaging,
    inspection: offer?.inspectionAvailability,
    version: 1,
    approvalStatus: "draft",
  });

  if (offer) {
    offer.status = "converted";
    offer.convertedProcurementTransactionId = tx._id;
    await offer.save();
  }

  await writeAuditEvent({
    action: "procurement.created",
    targetType: "transaction",
    targetId: String(tx._id),
    actorUserId: input.actorUserId,
    organizationId: input.supplierOrganizationId,
    result: "success",
    metadata: { transactionNumber },
  });

  await notifyUser({
    userId: input.actorUserId,
    type: "procurement_created",
    title: "Procurement transaction created",
    body: `Transaction ${transactionNumber} created.`,
    href: `/portal/supplier/transactions/${tx._id}`,
  });

  return tx;
}

export async function transitionProcurementTransaction(input: {
  transactionId: string;
  toStatus: TransactionWorkflowStatus;
  actorUserId: string;
  permissions: Permission[];
  comment?: string;
  reason?: string;
}) {
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("not_found");
  if (tx.transactionType !== "supplier_purchase") throw new Error("not_procurement");

  const transition = findProcurementTransition(tx.workflowStatus, input.toStatus);
  if (!transition) throw new Error("invalid_transition");
  if (!hasPermission(input.permissions, transition.permission)) {
    throw new Error("forbidden");
  }
  if (transition.requiresReason && !input.reason?.trim()) throw new Error("reason_required");
  if (transition.requiresComment && !input.comment?.trim()) throw new Error("comment_required");

  const before = tx.workflowStatus;
  tx.workflowStatus = input.toStatus;

  if (input.toStatus === "on_hold") {
    tx.status = "on_hold";
    tx.holdReason = input.reason;
  } else if (input.toStatus === "cancelled" || input.toStatus === "declined") {
    tx.status = "cancelled";
    tx.cancellationReason = input.reason;
    tx.closedAt = new Date();
  } else if (input.toStatus === "contract_executed") {
    tx.status = "completed";
  } else if (input.toStatus === "instrument_issuance_requested") {
    tx.status = "completed";
  } else {
    tx.status = "active";
  }

  if (input.comment) tx.supplierVisibleNotes = input.comment;
  await tx.save();

  await writeAuditEvent({
    action: "procurement.status_transition",
    targetType: "transaction",
    targetId: String(tx._id),
    actorUserId: input.actorUserId,
    organizationId: String(tx.organizationId),
    result: "success",
    metadata: { from: before, to: input.toStatus, reason: input.reason },
  });

  return tx;
}

export async function skipProcurementOffer(input: {
  transactionId: string;
  actorUserId: string;
  permissions: Permission[];
  reason: string;
  approverUserId?: string;
}) {
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.transactionType !== "supplier_purchase") throw new Error("not_found");
  if (!hasPermission(input.permissions, "transactions:approve")) throw new Error("forbidden");
  if (!input.reason?.trim() || input.reason.trim().length < 8) throw new Error("reason_required");

  tx.offerSkipped = true;
  tx.offerSkipReason = input.reason;
  tx.offerSkipApprovedByUserId = new Types.ObjectId(
    input.approverUserId ?? input.actorUserId,
  );
  tx.offerSkippedAt = new Date();
  tx.workflowStatus = "icpo_draft";
  tx.currentStepKey = "finekarts_icpo";
  await tx.save();

  await writeAuditEvent({
    action: "procurement.offer_skipped",
    targetType: "transaction",
    targetId: String(tx._id),
    actorUserId: input.actorUserId,
    organizationId: String(tx.organizationId),
    result: "success",
    metadata: { reason: input.reason },
  });

  return tx;
}
