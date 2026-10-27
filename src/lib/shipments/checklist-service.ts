import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyChecklistLocked } from "@/lib/shipments/notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const SHIPPING_DOCUMENT_CATALOGUE = {
  ocean_bill_of_lading: "Ocean Bill of Lading",
  air_waybill: "Air Waybill",
  sea_waybill: "Sea Waybill",
  inland_multimodal_bill_of_lading: "Inland / Multimodal Bill of Lading",
  mates_receipt: "Mate's Receipt",
  pro_forma_invoice: "Pro Forma Invoice",
  commercial_invoice: "Commercial Invoice",
  packing_list: "Packing List",
  letter_of_credit: "Letter of Credit",
  bill_of_exchange: "Bill of Exchange / Draft",
  certificate_of_inspection: "Certificate of Inspection (COI)",
  certificate_of_quality: "Certificate of Quality / Analysis (COA)",
  certificate_of_weight_quantity: "Certificate of Weight & Quantity",
  hold_tank_cleanliness_certificate: "Hold / Tank Cleanliness Certificate",
  hatch_sealing_certificate: "Hatch Sealing Certificate",
  draft_survey_report: "Draft Survey / Ullage Survey Report",
  certificate_of_origin: "Certificate of Origin (COO)",
  customs_export_declaration: "Customs Export Declaration",
  customs_import_declaration: "Customs Import Declaration",
  import_export_license: "Import / Export License",
  certificate_of_conformity: "Certificate of Conformity (CoC)",
  pre_shipment_inspection_certificate: "Pre-Shipment Inspection (PSI) Certificate",
  phytosanitary_certificate: "Phytosanitary Certificate",
  health_veterinary_certificate: "Health / Veterinary Certificate",
  fumigation_certificate: "Fumigation / Pest Control Certificate",
  safety_data_sheet: "Safety Data Sheet (SDS/MSDS)",
  dangerous_goods_declaration: "Dangerous Goods Declaration (IMO/IATA)",
  insurance_certificate: "Insurance Certificate",
  shippers_letter_of_instruction: "Shipper's Letter of Instruction (SLI)",
  importer_security_filing: "Importer Security Filing (ISF)",
  other: "Other",
} as const;

export const SHIPPING_DOCUMENT_TYPES = Object.keys(
  SHIPPING_DOCUMENT_CATALOGUE,
) as (keyof typeof SHIPPING_DOCUMENT_CATALOGUE)[];

export async function createShipmentChecklist(input: {
  shipmentLotId: string;
  transactionId: string;
  bankingInstrumentId?: string;
  destinationCountry?: string;
  destinationPort?: string;
  /** Pre-populate requirements from a DocumentRequirementTemplate. */
  requirementTemplateId?: string;
  /** Or pick catalogue types directly (validated against SHIPPING_DOCUMENT_CATALOGUE). */
  documentTypes?: string[];
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

  let types = input.documentTypes ?? [];
  if (input.requirementTemplateId) {
    const { DocumentRequirementTemplate } = await import("@/models");
    const tpl = await DocumentRequirementTemplate.findById(input.requirementTemplateId).lean();
    if (!tpl) throw new Error("not_found");
    types = [...new Set([...types, ...(tpl.documentTypes ?? [])])];
  }
  if (types.length) {
    const { ShipmentDocumentRequirement } = await import("@/models");
    for (const t of types) {
      if (!(t in SHIPPING_DOCUMENT_CATALOGUE)) throw new Error("unknown_document_type");
      await ShipmentDocumentRequirement.create({
        checklistId: checklist._id,
        documentType: t,
        required: true,
        responsibleParty: "supplier",
        uploadStatus: "not_started",
        validationStatus: "pending",
        approvalStatus: "pending",
        presentationStatus: "not_started",
      });
    }
  }

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
    if (!(docType in SHIPPING_DOCUMENT_CATALOGUE)) throw new Error("unknown_document_type");
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

export async function createRequirementTemplate(input: {
  name: string;
  documentTypes: string[];
  destinationCountry?: string;
  destinationPort?: string;
  transportMode?: string;
  incoterm?: string;
  notes?: string;
  actorUserId: string;
}) {
  for (const t of input.documentTypes) {
    if (!(t in SHIPPING_DOCUMENT_CATALOGUE)) throw new Error("unknown_document_type");
  }
  await tryConnectMongo();
  const { DocumentRequirementTemplate } = await import("@/models");
  const tpl = await DocumentRequirementTemplate.create({
    name: input.name,
    documentTypes: [...new Set(input.documentTypes)],
    destinationCountry: input.destinationCountry,
    destinationPort: input.destinationPort,
    transportMode: input.transportMode,
    incoterm: input.incoterm,
    notes: input.notes,
    effectiveDate: new Date(),
    active: true,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });
  await writeAuditEvent({
    action: "shipment_requirement_template.created",
    targetType: "document_requirement_template",
    targetId: String(tpl._id),
    actorUserId: input.actorUserId,
    result: "success",
  });
  return tpl;
}
