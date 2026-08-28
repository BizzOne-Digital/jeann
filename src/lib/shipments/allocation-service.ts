import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { evaluateSpecificationCompatibility } from "@/lib/transactions/deal-group-service";

export async function checkLotAllocationCompatibility(input: {
  buyerShipmentLotId: string;
  supplierShipmentLotId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLot } = await import("@/models");

  const buyerLot = await ShipmentLot.findById(input.buyerShipmentLotId).lean();
  const supplierLot = await ShipmentLot.findById(input.supplierShipmentLotId).lean();
  if (!buyerLot || buyerLot.transactionSide !== "buyer_sale") {
    throw new Error("invalid_buyer_lot");
  }
  if (!supplierLot || supplierLot.transactionSide !== "supplier_purchase") {
    throw new Error("invalid_supplier_lot");
  }

  return evaluateSpecificationCompatibility({
    buyerTransactionId: String(buyerLot.transactionId),
    supplierTransactionId: String(supplierLot.transactionId),
  });
}

export async function confirmShipmentAllocation(input: {
  allocationId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLotAllocation } = await import("@/models");
  const alloc = await ShipmentLotAllocation.findById(input.allocationId);
  if (!alloc) throw new Error("not_found");
  if (alloc.allocationStatus === "cancelled") throw new Error("allocation_cancelled");

  alloc.allocationStatus = "confirmed";
  await alloc.save();

  await writeAuditEvent({
    action: "shipment_allocation.confirmed",
    targetType: "shipment_lot_allocation",
    targetId: String(alloc._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return alloc;
}

export async function cancelShipmentAllocation(input: {
  allocationId: string;
  reason: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLotAllocation } = await import("@/models");
  const alloc = await ShipmentLotAllocation.findById(input.allocationId);
  if (!alloc) throw new Error("not_found");

  alloc.allocationStatus = "cancelled";
  alloc.internalNotes = `${alloc.internalNotes ?? ""}\nCancelled: ${input.reason}`.trim();
  await alloc.save();

  await writeAuditEvent({
    action: "shipment_allocation.cancelled",
    targetType: "shipment_lot_allocation",
    targetId: String(alloc._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { reason: input.reason },
  });

  return alloc;
}

export async function updateShipmentAllocation(input: {
  allocationId: string;
  allocatedQuantity?: string;
  unit?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLotAllocation } = await import("@/models");
  const alloc = await ShipmentLotAllocation.findById(input.allocationId);
  if (!alloc) throw new Error("not_found");

  if (input.allocatedQuantity) {
    alloc.allocatedQuantity = Types.Decimal128.fromString(
      money(input.allocatedQuantity).toString(),
    );
  }
  if (input.unit) alloc.unit = input.unit;
  await alloc.save();

  await writeAuditEvent({
    action: "shipment_allocation.updated",
    targetType: "shipment_lot_allocation",
    targetId: String(alloc._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return alloc;
}
