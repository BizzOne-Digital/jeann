import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { createShipmentLot } from "@/lib/shipments/lot-service";

export async function createShipmentScheduleDraft(input: {
  transactionId: string;
  transactionSide: "buyer_sale" | "supplier_purchase";
  startDate: string;
  endDate: string;
  frequency: "one_time" | "weekly" | "monthly" | "quarterly" | "custom";
  plannedLotCount: number;
  plannedQuantityPerLot: string;
  quantityUnit: string;
  quantityTolerance?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Transaction, ShipmentSchedule, CommercialTerms, ProcurementTerms } = await import("@/models");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("transaction_not_found");

  const side =
    input.transactionSide === "buyer_sale" ? "buyer_sale" : "supplier_purchase";
  if (tx.transactionType !== side) throw new Error("side_mismatch");

  const existingVersion = await ShipmentSchedule.countDocuments({ transactionId: tx._id });
  const totalPlanned = money(input.plannedQuantityPerLot).times(input.plannedLotCount);

  const terms =
    side === "buyer_sale"
      ? await CommercialTerms.findOne({ transactionId: tx._id }).lean()
      : await ProcurementTerms.findOne({ transactionId: tx._id }).lean();
  if (terms?.quantity) {
    const contractQty = money(terms.quantity.toString());
    if (totalPlanned.gt(contractQty.plus(money("0.01")))) {
      throw new Error("schedule_exceeds_contract_quantity");
    }
  }

  const schedule = await ShipmentSchedule.create({
    transactionId: tx._id,
    transactionSide: side,
    version: existingVersion + 1,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    frequency: input.frequency,
    plannedLotCount: input.plannedLotCount,
    plannedQuantityPerLot: Types.Decimal128.fromString(
      money(input.plannedQuantityPerLot).toString(),
    ),
    quantityUnit: input.quantityUnit,
    quantityTolerance: input.quantityTolerance,
    status: "draft",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "shipment_schedule.created",
    targetType: "shipment_schedule",
    targetId: String(schedule._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return schedule;
}

export async function approveShipmentSchedule(input: {
  scheduleId: string;
  actorUserId: string;
  generateLots?: boolean;
}) {
  await tryConnectMongo();
  const { ShipmentSchedule } = await import("@/models");
  const schedule = await ShipmentSchedule.findById(input.scheduleId);
  if (!schedule || schedule.status !== "draft") throw new Error("invalid_schedule");

  schedule.status = "approved";
  schedule.approvedByUserId = new Types.ObjectId(input.actorUserId);
  schedule.approvedAt = new Date();
  await schedule.save();

  const lots: unknown[] = [];
  if (input.generateLots) {
    for (let i = 0; i < schedule.plannedLotCount; i++) {
      const lot = await createShipmentLot({
        transactionId: String(schedule.transactionId),
        transactionSide: schedule.transactionSide,
        actorUserId: input.actorUserId,
        plannedQuantity: schedule.plannedQuantityPerLot.toString(),
        quantityUnit: schedule.quantityUnit,
        sequenceNumber: i + 1,
        scheduleId: String(schedule._id),
        productName: undefined,
      });
      lots.push(lot);
    }
  }

  await writeAuditEvent({
    action: "shipment_schedule.approved",
    targetType: "shipment_schedule",
    targetId: String(schedule._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { lotsGenerated: lots.length },
  });

  return { schedule, lots };
}
