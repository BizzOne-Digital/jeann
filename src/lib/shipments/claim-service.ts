import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyClaimSubmitted } from "@/lib/shipments/notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function allocateClaimNumber(year = new Date().getUTCFullYear()): Promise<string> {
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");
  const counter = await TransactionCounter.findOneAndUpdate(
    { year, side: "CLM" },
    { $inc: { sequence: 1 } },
    { upsert: true, new: true },
  );
  return `FK-CLM-${year}-${String(counter.sequence).padStart(6, "0")}`;
}

export async function createTradeClaim(input: {
  shipmentLotId: string;
  transactionId: string;
  claimType: string;
  claimantOrganizationId: string;
  respondentOrganizationId?: string;
  description: string;
  quantityAffected?: string;
  currency?: string;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { TradeClaim } = await import("@/models");
  const claimNumber = await allocateClaimNumber();

  const claim = await TradeClaim.create({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    transactionId: new Types.ObjectId(input.transactionId),
    claimNumber,
    claimType: input.claimType,
    claimantOrganizationId: new Types.ObjectId(input.claimantOrganizationId),
    respondentOrganizationId: input.respondentOrganizationId
      ? new Types.ObjectId(input.respondentOrganizationId)
      : undefined,
    description: input.description,
    quantityAffected: input.quantityAffected
      ? Types.Decimal128.fromString(input.quantityAffected)
      : undefined,
    currency: input.currency,
    submittedDate: new Date(),
    status: "submitted",
    buyerVisible: input.buyerVisible ?? false,
    supplierVisible: input.supplierVisible ?? false,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "trade_claim.created",
    targetType: "trade_claim",
    targetId: String(claim._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { claimNumber },
  });

  await notifyClaimSubmitted({
    claimNumber,
    lotId: input.shipmentLotId,
  });

  return claim;
}

export async function resolveTradeClaim(input: {
  claimId: string;
  resolutionSummary: string;
  status: "resolved" | "closed" | "rejected";
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { TradeClaim } = await import("@/models");
  const claim = await TradeClaim.findById(input.claimId);
  if (!claim) throw new Error("not_found");
  if (claim.status === "closed") throw new Error("claim_closed");

  claim.status = input.status;
  claim.resolutionSummary = input.resolutionSummary;
  claim.closedDate = new Date();
  await claim.save();

  await writeAuditEvent({
    action: "trade_claim.resolved",
    targetType: "trade_claim",
    targetId: String(claim._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return claim;
}
