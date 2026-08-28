import { Types } from "mongoose";
import { allocateBuyerSaleTransactionNumber } from "@/lib/transactions/number";
import { findTransition } from "@/lib/transactions/workflow";
import { money, mulMoney } from "@/lib/finance/money";
import { notifyUser, notifyAdmins } from "@/lib/notifications/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { TransactionWorkflowStatus } from "@/models/Transaction";
import type { Permission } from "@/lib/authorization/permissions";
import { hasPermission } from "@/lib/authorization/permissions";
import { BUYER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

export async function createTransactionFromRequest(input: {
  purchaseRequestId: string;
  actorUserId: string;
  assignedTradeManagerId?: string;
}) {
  await tryConnectMongo();
  const { PurchaseRequest, Transaction, WorkflowStep, WorkflowTemplate, CommercialTerms } =
    await import("@/models");

  const pr = await PurchaseRequest.findById(input.purchaseRequestId);
  if (!pr) throw new Error("request_not_found");
  if (pr.status !== "qualified") throw new Error("request_not_qualified");
  if (!pr.organizationId) throw new Error("no_organization");

  const existing = await Transaction.findOne({
    sourcePurchaseRequestId: pr._id,
    deletedAt: null,
  }).lean();
  if (existing) throw new Error("already_converted");

  const transactionNumber = await allocateBuyerSaleTransactionNumber();

  const template = await WorkflowTemplate.findOne({
    key: "buyer_default_v1",
    version: 1,
  }).lean();

  const tx = await Transaction.create({
    transactionNumber,
    transactionType: "buyer_sale",
    side: "buyer",
    organizationId: pr.organizationId,
    sourcePurchaseRequestId: pr._id,
    productId: pr.productId,
    status: "active",
    workflowStatus: "qualification",
    currentStepKey: "sco_fco",
    templateId: template?._id,
    assignedTradeManagerId: input.assignedTradeManagerId
      ? new Types.ObjectId(input.assignedTradeManagerId)
      : new Types.ObjectId(input.actorUserId),
    createdBy: new Types.ObjectId(input.actorUserId),
    submittedAt: new Date(),
  });

  for (const step of BUYER_WORKFLOW_STEPS) {
    await WorkflowStep.create({
      transactionId: tx._id,
      key: step.key,
      order: step.order,
      title: step.title,
      status: step.order === 1 ? "ready" : "not_started",
      locked: false,
    });
  }

  const qty = pr.quantity ? money(pr.quantity.replace(/[^\d.]/g, "") || "0") : money(0);
  const unitPrice = pr.pricePerMt ? money(pr.pricePerMt) : money(0);
  const total = pr.contractTotal ? money(pr.contractTotal) : mulMoney(qty, unitPrice);

  await CommercialTerms.create({
    transactionId: tx._id,
    organizationId: pr.organizationId,
    productId: pr.productId,
    productName: pr.productName,
    specificationVersionId: pr.specificationVersionId,
    quantity: Types.Decimal128.fromString(qty.toString()),
    quantityUnit: pr.unit ?? "MT",
    quantityTolerance: pr.quantityTolerance,
    currency: "USD",
    unitPrice: Types.Decimal128.fromString(unitPrice.toString()),
    totalEstimatedValue: Types.Decimal128.fromString(total.toString()),
    incoterm: pr.incoterm ?? "FOB",
    namedPortPlace: pr.namedPortPlace,
    loadingPort: pr.loadingPort,
    destinationPort: pr.destinationPort,
    packaging: pr.packaging,
    inspectionCompany: pr.inspection,
    paymentProposal: pr.paymentPreference,
    shipmentSchedule: pr.timeline,
    version: 1,
    approvalStatus: "draft",
  });

  pr.status = "converted";
  pr.convertedTransactionId = tx._id;
  await pr.save();

  return tx;
}

export async function transitionTransaction(input: {
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

  const transition = findTransition(tx.workflowStatus, input.toStatus);
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
  } else if (input.toStatus === "cancelled") {
    tx.status = "cancelled";
    tx.cancellationReason = input.reason;
    tx.closedAt = new Date();
  } else if (input.toStatus === "declined") {
    tx.status = "cancelled";
    tx.cancellationReason = input.reason;
    tx.closedAt = new Date();
  } else if (input.toStatus === "contract_executed") {
    tx.status = "completed";
  } else {
    tx.status = "active";
  }

  if (input.toStatus === "qualified" && tx.offerSkipped) {
    // already skipped
  }

  if (input.comment) {
    tx.buyerVisibleNotes = input.comment;
  }

  await tx.save();

  await writeAuditEvent({
    action: "transaction.status_transition",
    targetType: "transaction",
    targetId: tx._id,
    actorUserId: input.actorUserId,
    organizationId: tx.organizationId,
    before: { workflowStatus: before },
    after: { workflowStatus: input.toStatus },
    metadata: { comment: input.comment, reason: input.reason },
  });

  return tx;
}

export async function skipOfferStep(input: {
  transactionId: string;
  actorUserId: string;
  approverUserId: string;
  reason: string;
  permissions: Permission[];
}) {
  if (!hasPermission(input.permissions, "transactions:approve")) {
    throw new Error("forbidden");
  }
  if (!input.reason || input.reason.trim().length < 16) {
    throw new Error("reason_required");
  }

  await tryConnectMongo();
  const { Transaction, WorkflowStep } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx) throw new Error("not_found");

  tx.offerSkipped = true;
  tx.offerSkipReason = input.reason;
  tx.offerSkipApprovedByUserId = new Types.ObjectId(input.approverUserId);
  tx.offerSkippedAt = new Date();
  tx.workflowStatus = "icpo_pending";
  tx.currentStepKey = "icpo";
  await tx.save();

  await WorkflowStep.updateOne(
    { transactionId: tx._id, key: "sco_fco" },
    { $set: { status: "skipped", skipReason: input.reason, locked: true } },
  );
  await WorkflowStep.updateOne(
    { transactionId: tx._id, key: "icpo" },
    { $set: { status: "ready" } },
  );

  await writeAuditEvent({
    action: "transaction.offer_skipped",
    targetType: "transaction",
    targetId: tx._id,
    actorUserId: input.actorUserId,
    organizationId: tx.organizationId,
    metadata: { reason: input.reason, approverUserId: input.approverUserId },
  });

  return tx;
}

export async function assignTransaction(input: {
  transactionId: string;
  tradeManagerId?: string;
  reviewerIds?: string[];
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx) throw new Error("not_found");

  if (input.tradeManagerId) {
    tx.assignedTradeManagerId = new Types.ObjectId(input.tradeManagerId);
  }
  if (input.reviewerIds) {
    tx.assignedReviewerIds = input.reviewerIds.map((id) => new Types.ObjectId(id));
  }
  await tx.save();

  if (input.tradeManagerId) {
    await notifyUser({
      userId: input.tradeManagerId,
      organizationId: String(tx.organizationId),
      type: "transaction_assigned",
      title: "Transaction assigned",
      body: `You have been assigned to ${tx.transactionNumber}`,
      href: `/workspace/transactions/${tx._id}`,
    });
  }

  return tx;
}
