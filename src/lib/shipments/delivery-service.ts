import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { notifyDeliveryConfirmed } from "@/lib/shipments/notifications";

export async function confirmDelivery(input: {
  shipmentLotId: string;
  deliveredQuantity: string;
  unit: string;
  deliveryDate: string;
  recipient?: string;
  deliveryLocation?: string;
  proofDocumentId?: string;
  condition?: string;
  shortageDamageNotes?: string;
  actorUserId: string;
  notifyBuyerUserIds?: string[];
  buyerOrganizationId?: string;
}) {
  await tryConnectMongo();
  const { DeliveryRecord, ShipmentLot } = await import("@/models");

  const lot = await ShipmentLot.findById(input.shipmentLotId);
  if (!lot) throw new Error("not_found");

  const existing = await DeliveryRecord.findOne({ shipmentLotId: lot._id, status: "confirmed" });
  if (existing) throw new Error("delivery_already_confirmed");

  const record = await DeliveryRecord.create({
    shipmentLotId: lot._id,
    deliveredQuantity: Types.Decimal128.fromString(money(input.deliveredQuantity).toString()),
    unit: input.unit,
    deliveryDate: new Date(input.deliveryDate),
    recipient: input.recipient,
    deliveryLocation: input.deliveryLocation,
    proofDocumentId: input.proofDocumentId
      ? new Types.ObjectId(input.proofDocumentId)
      : undefined,
    condition: input.condition,
    shortageDamageNotes: input.shortageDamageNotes,
    acceptedByUserId: new Types.ObjectId(input.actorUserId),
    status: "confirmed",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  lot.deliveryDate = new Date(input.deliveryDate);
  lot.actualQuantity = Types.Decimal128.fromString(money(input.deliveredQuantity).toString());
  await lot.save();

  await writeAuditEvent({
    action: "delivery.confirmed",
    targetType: "delivery_record",
    targetId: String(record._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  await notifyDeliveryConfirmed({
    shipmentLotNumber: lot.shipmentLotNumber,
    lotId: String(lot._id),
    notifyUserIds: input.notifyBuyerUserIds,
    organizationId: input.buyerOrganizationId,
  });

  return record;
}
