import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyShipmentLotCreated, notifyShipmentStatusChange } from "@/lib/shipments/notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { allocateShipmentLotNumber } from "@/lib/shipments/number";
import { findShipmentTransition } from "@/lib/shipments/workflow";
import { evaluateSpecificationCompatibility } from "@/lib/transactions/deal-group-service";
import { hasPermission } from "@/lib/authorization/permissions";
import type { Permission } from "@/lib/authorization/permissions";
import type { ShipmentLotStatus } from "@/models/ShipmentLot";

export async function createShipmentLot(input: {
  transactionId: string;
  transactionSide: "buyer_sale" | "supplier_purchase";
  actorUserId: string;
  plannedQuantity: string;
  quantityUnit: string;
  sequenceNumber?: number;
  scheduleId?: string;
  productName?: string;
  loadingPort?: string;
  destinationPort?: string;
  plannedLoadingDate?: string;
  estimatedArrival?: string;
  packaging?: string;
}) {
  await tryConnectMongo();
  const { Transaction, ShipmentLot } = await import("@/models");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("transaction_not_found");

  const side =
    input.transactionSide === "buyer_sale" ? "buyer_sale" : "supplier_purchase";
  if (tx.transactionType !== side) throw new Error("side_mismatch");

  const shipmentLotNumber = await allocateShipmentLotNumber();
  const existingCount = await ShipmentLot.countDocuments({ transactionId: tx._id });

  const lot = await ShipmentLot.create({
    shipmentLotNumber,
    transactionId: tx._id,
    transactionSide: side,
    scheduleId: input.scheduleId ? new Types.ObjectId(input.scheduleId) : undefined,
    sequenceNumber: input.sequenceNumber ?? existingCount + 1,
    plannedQuantity: Types.Decimal128.fromString(money(input.plannedQuantity).toString()),
    quantityUnit: input.quantityUnit,
    productName: input.productName,
    productId: tx.productId,
    loadingPort: input.loadingPort,
    destinationPort: input.destinationPort,
    plannedLoadingDate: input.plannedLoadingDate
      ? new Date(input.plannedLoadingDate)
      : undefined,
    estimatedArrival: input.estimatedArrival ? new Date(input.estimatedArrival) : undefined,
    packaging: input.packaging,
    currentStatus: "planned",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "shipment_lot.created",
    targetType: "shipment_lot",
    targetId: String(lot._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { shipmentLotNumber },
  });

  await notifyShipmentLotCreated({
    shipmentLotNumber,
    lotId: String(lot._id),
    transactionSide: side,
    actorUserId: input.actorUserId,
  });

  return lot;
}

export async function transitionShipmentLot(input: {
  lotId: string;
  toStatus: ShipmentLotStatus;
  actorUserId: string;
  permissions: Permission[];
  reason?: string;
  evidence?: string;
}) {
  await tryConnectMongo();
  const { ShipmentLot } = await import("@/models");
  const lot = await ShipmentLot.findById(input.lotId);
  if (!lot) throw new Error("not_found");

  if (lot.currentStatus === "closed" || lot.currentStatus === "cancelled") {
    throw new Error("shipment_immutable");
  }

  const transition = findShipmentTransition(lot.currentStatus, input.toStatus);
  if (!transition) throw new Error("invalid_transition");
  if (!hasPermission(input.permissions, transition.permission)) throw new Error("forbidden");
  if (transition.requiresReason && !input.reason?.trim()) throw new Error("reason_required");
  if (transition.requiresEvidence && !input.evidence?.trim()) throw new Error("evidence_required");

  if (input.toStatus === "loaded") {
    const { FreightBooking } = await import("@/models");
    const booking = await FreightBooking.findOne({ shipmentLotId: lot._id, status: "confirmed" });
    if (!booking) throw new Error("booking_required");
  }

  if (input.toStatus === "delivered") {
    const { DeliveryRecord } = await import("@/models");
    const delivery = await DeliveryRecord.findOne({ shipmentLotId: lot._id, status: "confirmed" });
    if (!delivery) throw new Error("delivery_evidence_required");
  }

  lot.currentStatus = input.toStatus;
  await lot.save();

  await writeAuditEvent({
    action: "shipment_lot.status_transition",
    targetType: "shipment_lot",
    targetId: String(lot._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { to: input.toStatus, reason: input.reason },
  });

  await notifyShipmentStatusChange({
    shipmentLotNumber: lot.shipmentLotNumber,
    lotId: String(lot._id),
    toStatus: input.toStatus,
  });

  return lot;
}

export async function assignShippingManager(input: {
  lotId: string;
  managerUserId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLot } = await import("@/models");
  const lot = await ShipmentLot.findById(input.lotId);
  if (!lot) throw new Error("not_found");

  lot.assignedShippingManagerId = new Types.ObjectId(input.managerUserId);
  await lot.save();

  await writeAuditEvent({
    action: "shipment_lot.manager_assigned",
    targetType: "shipment_lot",
    targetId: String(lot._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { managerUserId: input.managerUserId },
  });

  return lot;
}

export async function createShipmentLotAllocation(input: {
  dealGroupId: string;
  buyerShipmentLotId: string;
  supplierShipmentLotId: string;
  allocatedQuantity: string;
  unit: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentLot, ShipmentLotAllocation } = await import("@/models");

  const buyerLot = await ShipmentLot.findById(input.buyerShipmentLotId);
  const supplierLot = await ShipmentLot.findById(input.supplierShipmentLotId);
  if (!buyerLot || buyerLot.transactionSide !== "buyer_sale") throw new Error("invalid_buyer_lot");
  if (!supplierLot || supplierLot.transactionSide !== "supplier_purchase") {
    throw new Error("invalid_supplier_lot");
  }

  const compatibility = await evaluateSpecificationCompatibility({
    buyerTransactionId: String(buyerLot.transactionId),
    supplierTransactionId: String(supplierLot.transactionId),
  });

  const alloc = await ShipmentLotAllocation.create({
    dealGroupId: new Types.ObjectId(input.dealGroupId),
    buyerShipmentLotId: buyerLot._id,
    supplierShipmentLotId: supplierLot._id,
    allocatedQuantity: Types.Decimal128.fromString(money(input.allocatedQuantity).toString()),
    unit: input.unit,
    allocationStatus: "proposed",
    compatibilityResult: compatibility.status,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  buyerLot.currentStatus = "allocated";
  supplierLot.currentStatus = "allocated";
  await buyerLot.save();
  await supplierLot.save();

  await writeAuditEvent({
    action: "shipment_allocation.created",
    targetType: "shipment_lot_allocation",
    targetId: String(alloc._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return alloc;
}
