import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { notifyInspectionScheduled } from "@/lib/shipments/notifications";

export async function createInspectionRequest(input: {
  shipmentLotId: string;
  inspectionType: string;
  inspectionProvider: string;
  inspectionLocation?: string;
  requestedDate?: string;
  scheduledDate?: string;
  scope?: string;
  requestedTests?: string[];
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { InspectionRecord, ShipmentLot } = await import("@/models");

  const lot = await ShipmentLot.findById(input.shipmentLotId);
  if (!lot) throw new Error("not_found");

  const record = await InspectionRecord.create({
    shipmentLotId: lot._id,
    inspectionType: input.inspectionType,
    inspectionProvider: input.inspectionProvider,
    inspectionLocation: input.inspectionLocation,
    requestedDate: input.requestedDate ? new Date(input.requestedDate) : new Date(),
    scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : undefined,
    scope: input.scope,
    requestedTests: input.requestedTests,
    status: input.scheduledDate ? "scheduled" : "requested",
    verificationStatus: "unverified",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "inspection.requested",
    targetType: "inspection_record",
    targetId: String(record._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  if (input.scheduledDate) {
    await notifyInspectionScheduled({
      shipmentLotNumber: lot.shipmentLotNumber,
      lotId: String(lot._id),
      provider: input.inspectionProvider,
      scheduledDate: new Date(input.scheduledDate),
    });
  }

  return record;
}

export async function reviewInspectionReport(input: {
  inspectionId: string;
  decision: "accepted" | "rejected";
  reviewerUserId: string;
  resultSummary?: string;
}) {
  await tryConnectMongo();
  const { InspectionRecord } = await import("@/models");
  const record = await InspectionRecord.findById(input.inspectionId);
  if (!record) throw new Error("not_found");

  record.status = input.decision === "accepted" ? "accepted" : "rejected";
  record.verificationStatus = "evidence_reviewed";
  record.reviewedByUserId = new Types.ObjectId(input.reviewerUserId);
  record.reviewDate = new Date();
  if (input.resultSummary) record.resultSummary = input.resultSummary;
  await record.save();

  await writeAuditEvent({
    action: "inspection.reviewed",
    targetType: "inspection_record",
    targetId: String(record._id),
    actorUserId: input.reviewerUserId,
    result: "success",
    metadata: { decision: input.decision },
  });

  return record;
}

export async function linkInspectionReportDocument(input: {
  inspectionId: string;
  reportDocumentId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { InspectionRecord } = await import("@/models");
  const record = await InspectionRecord.findById(input.inspectionId);
  if (!record) throw new Error("not_found");

  record.reportDocumentId = new Types.ObjectId(input.reportDocumentId);
  record.status = "report_uploaded";
  record.verificationStatus = "unverified";
  await record.save();

  await writeAuditEvent({
    action: "inspection.report_uploaded",
    targetType: "inspection_record",
    targetId: String(record._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return record;
}
