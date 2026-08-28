import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyChecklistLocked } from "@/lib/shipments/notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const SHIPPING_DOCUMENT_TYPES = [
  "ocean_bill_of_lading",
  "sea_waybill",
  "air_waybill",
  "commercial_invoice",
  "packing_list",
  "certificate_of_origin",
  "certificate_of_inspection",
  "certificate_of_quality",
  "insurance_certificate",
  "phytosanitary_certificate",
  "other",
] as const;

export async function createShipmentChecklist(input: {
  shipmentLotId: string;
  transactionId: string;
  bankingInstrumentId?: string;
  destinationCountry?: string;
  destinationPort?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentDocumentChecklist } = await import("@/models");

  const existing = await ShipmentDocumentChecklist.countDocuments({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
  });

  const checklist = await ShipmentDocumentChecklist.create({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    transactionId: new Types.ObjectId(input.transactionId),
    bankingInstrumentId: input.bankingInstrumentId
      ? new Types.ObjectId(input.bankingInstrumentId)
      : undefined,
    destinationCountry: input.destinationCountry,
    destinationPort: input.destinationPort,
    version: existing + 1,
    status: "draft",
  });

  await writeAuditEvent({
    action: "shipment_checklist.created",
    targetType: "shipment_document_checklist",
    targetId: String(checklist._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return checklist;
}

export async function submitBuyerDocumentRequests(input: {
  checklistId: string;
  actorUserId: string;
  buyerAuthorityNoticeConfirmed: boolean;
  additionalDocumentTypes?: string[];
  customsNotes?: string;
}) {
  if (!input.buyerAuthorityNoticeConfirmed) {
    throw new Error("authority_notice_required");
  }

  await tryConnectMongo();
  const { ShipmentDocumentChecklist, ShipmentDocumentRequirement } = await import("@/models");
  const checklist = await ShipmentDocumentChecklist.findById(input.checklistId);
  if (!checklist) throw new Error("not_found");

  checklist.buyerAuthorityNoticeConfirmed = true;
  checklist.requestedByUserId = new Types.ObjectId(input.actorUserId);
  checklist.status = "buyer_input_pending";
  if (input.customsNotes) checklist.notes = input.customsNotes;
  await checklist.save();

  for (const docType of input.additionalDocumentTypes ?? []) {
    await ShipmentDocumentRequirement.create({
      checklistId: checklist._id,
      documentType: docType,
      required: true,
      responsibleParty: "buyer",
      uploadStatus: "not_started",
      validationStatus: "pending",
      approvalStatus: "pending",
      presentationStatus: "not_started",
    });
  }

  await writeAuditEvent({
    action: "shipment_checklist.buyer_input",
    targetType: "shipment_document_checklist",
    targetId: String(checklist._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return checklist;
}

export async function approveAndLockChecklist(input: {
  checklistId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ShipmentDocumentChecklist } = await import("@/models");
  const checklist = await ShipmentDocumentChecklist.findById(input.checklistId);
  if (!checklist) throw new Error("not_found");

  checklist.status = "locked";
  checklist.approvedByUserId = new Types.ObjectId(input.actorUserId);
  checklist.approvalDate = new Date();
  checklist.lockDate = new Date();
  await checklist.save();

  await writeAuditEvent({
    action: "shipment_checklist.locked",
    targetType: "shipment_document_checklist",
    targetId: String(checklist._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  const { ShipmentLot } = await import("@/models");
  const lot = await ShipmentLot.findById(checklist.shipmentLotId).lean();
  if (lot) {
    await notifyChecklistLocked({
      shipmentLotNumber: lot.shipmentLotNumber,
      lotId: String(lot._id),
    });
  }

  return checklist;
}
