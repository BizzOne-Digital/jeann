import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { allocateDealGroupNumber } from "@/lib/transactions/number";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import type { SpecificationCompatibilityStatus } from "@/models/DealGroup";

export type CompatibilityResult = {
  status: SpecificationCompatibilityStatus;
  issues: Array<{ field: string; message: string; severity: "error" | "warning" }>;
};

export async function evaluateSpecificationCompatibility(input: {
  buyerTransactionId: string;
  supplierTransactionId: string;
}): Promise<CompatibilityResult> {
  if (!isMongoConfigured()) {
    return {
      status: "incompatible",
      issues: [{ field: "database", message: "Database not configured", severity: "error" }],
    };
  }
  await tryConnectMongo();
  const { Transaction, CommercialTerms, ProcurementTerms } = await import("@/models");

  const buyerTx = await Transaction.findById(input.buyerTransactionId).lean();
  const supplierTx = await Transaction.findById(input.supplierTransactionId).lean();
  if (!buyerTx || buyerTx.transactionType !== "buyer_sale") {
    return {
      status: "incompatible",
      issues: [{ field: "buyerTransaction", message: "Invalid buyer transaction", severity: "error" }],
    };
  }
  if (!supplierTx || supplierTx.transactionType !== "supplier_purchase") {
    return {
      status: "incompatible",
      issues: [{ field: "supplierTransaction", message: "Invalid supplier transaction", severity: "error" }],
    };
  }

  const buyerTerms = await CommercialTerms.findOne({ transactionId: buyerTx._id })
    .sort({ version: -1 })
    .lean();
  const supplierTerms = await ProcurementTerms.findOne({ transactionId: supplierTx._id })
    .sort({ version: -1 })
    .lean();

  const issues: CompatibilityResult["issues"] = [];

  if (!buyerTerms || !supplierTerms) {
    issues.push({
      field: "terms",
      message: "Commercial or procurement terms missing",
      severity: "error",
    });
    return { status: "incompatible", issues };
  }

  if (
    buyerTerms.productName.toLowerCase() !== supplierTerms.productName.toLowerCase()
  ) {
    issues.push({
      field: "productName",
      message: `Product mismatch: buyer ${buyerTerms.productName} vs supplier ${supplierTerms.productName}`,
      severity: "error",
    });
  }

  if (buyerTerms.quantityUnit !== supplierTerms.quantityUnit) {
    issues.push({
      field: "quantityUnit",
      message: `Unit mismatch: ${buyerTerms.quantityUnit} vs ${supplierTerms.quantityUnit}`,
      severity: "error",
    });
  }

  if (
    buyerTerms.specificationVersionId &&
    supplierTerms.specificationVersionId &&
    String(buyerTerms.specificationVersionId) !== String(supplierTerms.specificationVersionId)
  ) {
    issues.push({
      field: "specificationVersion",
      message: "Specification versions differ",
      severity: "warning",
    });
  }

  if (buyerTerms.packaging && supplierTerms.packaging && buyerTerms.packaging !== supplierTerms.packaging) {
    issues.push({
      field: "packaging",
      message: "Packaging differs between buyer and supplier terms",
      severity: "warning",
    });
  }

  if (issues.some((i) => i.severity === "error")) {
    return { status: "incompatible", issues };
  }
  if (issues.length > 0) {
    return { status: "compatible_with_warnings", issues };
  }
  return { status: "compatible", issues };
}

export async function createDealGroup(input: {
  name: string;
  description?: string;
  productId?: string;
  productName?: string;
  leadTradeManagerId?: string;
  actorUserId: string;
  internalNotes?: string;
}) {
  await tryConnectMongo();
  const { DealGroup } = await import("@/models");

  const dealGroupNumber = await allocateDealGroupNumber();
  const group = await DealGroup.create({
    dealGroupNumber,
    name: input.name,
    description: input.description,
    productId: input.productId ? new Types.ObjectId(input.productId) : undefined,
    productName: input.productName,
    status: "draft",
    leadTradeManagerId: input.leadTradeManagerId
      ? new Types.ObjectId(input.leadTradeManagerId)
      : new Types.ObjectId(input.actorUserId),
    createdByUserId: new Types.ObjectId(input.actorUserId),
    internalNotes: input.internalNotes,
    specificationCompatibilityStatus: "not_evaluated",
  });

  await writeAuditEvent({
    action: "deal_group.created",
    targetType: "deal_group",
    targetId: String(group._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { dealGroupNumber },
  });

  return group;
}

export async function linkTransactionToDealGroup(input: {
  dealGroupId: string;
  transactionId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { DealGroup, DealGroupTransaction, Transaction } = await import("@/models");

  const group = await DealGroup.findById(input.dealGroupId);
  if (!group) throw new Error("deal_group_not_found");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("transaction_not_found");

  const transactionType =
    tx.transactionType === "buyer_sale" ? "buyer_sale" : "supplier_purchase";

  await DealGroupTransaction.create({
    dealGroupId: group._id,
    transactionId: tx._id,
    transactionType,
    relationshipType: transactionType,
    linkedByUserId: new Types.ObjectId(input.actorUserId),
    linkedAt: new Date(),
    active: true,
  });

  if (group.status === "draft") group.status = "active";
  await group.save();

  await writeAuditEvent({
    action: "deal_group.transaction_linked",
    targetType: "deal_group",
    targetId: String(group._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { transactionId: input.transactionId, transactionType },
  });

  return group;
}

export async function unlinkTransactionFromDealGroup(input: {
  dealGroupId: string;
  transactionId: string;
  actorUserId: string;
  reason: string;
}) {
  await tryConnectMongo();
  const { DealGroupTransaction } = await import("@/models");
  if (!input.reason?.trim()) throw new Error("reason_required");

  const link = await DealGroupTransaction.findOne({
    dealGroupId: input.dealGroupId,
    transactionId: input.transactionId,
    active: true,
  });
  if (!link) throw new Error("link_not_found");

  link.active = false;
  link.unlinkReason = input.reason;
  link.unlinkedByUserId = new Types.ObjectId(input.actorUserId);
  link.unlinkedAt = new Date();
  await link.save();

  await writeAuditEvent({
    action: "deal_group.transaction_unlinked",
    targetType: "deal_group",
    targetId: input.dealGroupId,
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { transactionId: input.transactionId, reason: input.reason },
  });

  return link;
}

export async function createDealAllocation(input: {
  dealGroupId: string;
  buyerTransactionId: string;
  supplierTransactionId: string;
  allocatedQuantity: string;
  unit: string;
  actorUserId: string;
  internalNote?: string;
  confirmWarnings?: boolean;
}) {
  await tryConnectMongo();
  const { DealAllocation, CommercialTerms, ProcurementTerms } = await import("@/models");

  const compatibility = await evaluateSpecificationCompatibility({
    buyerTransactionId: input.buyerTransactionId,
    supplierTransactionId: input.supplierTransactionId,
  });

  if (compatibility.status === "incompatible") {
    throw new Error("incompatible");
  }
  if (
    compatibility.status === "compatible_with_warnings" &&
    !input.confirmWarnings
  ) {
    throw new Error("warnings_require_confirmation");
  }

  const buyerTerms = await CommercialTerms.findOne({
    transactionId: input.buyerTransactionId,
  })
    .sort({ version: -1 })
    .lean();
  const supplierTerms = await ProcurementTerms.findOne({
    transactionId: input.supplierTransactionId,
  })
    .sort({ version: -1 })
    .lean();

  const allocQty = money(input.allocatedQuantity);
  const buyerQty = buyerTerms ? money(buyerTerms.quantity.toString()) : money(0);
  const supplierQty = supplierTerms ? money(supplierTerms.quantity.toString()) : money(0);

  const existingBuyerAlloc = await DealAllocation.find({
    buyerTransactionId: input.buyerTransactionId,
    allocationStatus: { $nin: ["cancelled"] },
  }).lean();
  let totalBuyerAllocated = money(0);
  for (const a of existingBuyerAlloc) {
    totalBuyerAllocated = totalBuyerAllocated.plus(a.allocatedQuantity.toString());
  }
  const newBuyerTotal = totalBuyerAllocated.plus(allocQty);
  if (newBuyerTotal.gt(buyerQty)) {
    if (!input.confirmWarnings) throw new Error("over_allocation_buyer");
  }

  const existingSupplierAlloc = await DealAllocation.find({
    supplierTransactionId: input.supplierTransactionId,
    allocationStatus: { $nin: ["cancelled"] },
  }).lean();
  let totalSupplierAllocated = money(0);
  for (const a of existingSupplierAlloc) {
    totalSupplierAllocated = totalSupplierAllocated.plus(a.allocatedQuantity.toString());
  }
  const newSupplierTotal = totalSupplierAllocated.plus(allocQty);
  if (newSupplierTotal.gt(supplierQty)) {
    if (!input.confirmWarnings) throw new Error("over_allocation_supplier");
  }

  const allocation = await DealAllocation.create({
    dealGroupId: new Types.ObjectId(input.dealGroupId),
    buyerTransactionId: new Types.ObjectId(input.buyerTransactionId),
    supplierTransactionId: new Types.ObjectId(input.supplierTransactionId),
    productId: buyerTerms?.productId,
    specificationVersionId: buyerTerms?.specificationVersionId,
    allocatedQuantity: Types.Decimal128.fromString(allocQty.toString()),
    unit: input.unit,
    allocationStatus: "proposed",
    internalNote: input.internalNote,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "deal_group.allocation_created",
    targetType: "deal_allocation",
    targetId: String(allocation._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: {
      dealGroupId: input.dealGroupId,
      quantity: input.allocatedQuantity,
      compatibility: compatibility.status,
    },
  });

  return { allocation, compatibility };
}

export async function confirmDealAllocation(allocationId: string, actorUserId: string) {
  await tryConnectMongo();
  const { DealAllocation } = await import("@/models");
  const alloc = await DealAllocation.findById(allocationId);
  if (!alloc) throw new Error("not_found");
  alloc.allocationStatus = "confirmed";
  await alloc.save();

  await writeAuditEvent({
    action: "deal_group.allocation_confirmed",
    targetType: "deal_allocation",
    targetId: allocationId,
    actorUserId,
    result: "success",
  });

  return alloc;
}
