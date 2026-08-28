import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function upsertCustomsRecord(input: {
  shipmentLotId: string;
  country: string;
  port?: string;
  brokerAgent?: string;
  declarationReference?: string;
  submittedDate?: string;
  currentStatus: string;
  holdReason?: string;
  requiredAction?: string;
  releaseDate?: string;
  dataSource?: string;
  notes?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { CustomsClearanceRecord } = await import("@/models");

  const existing = await CustomsClearanceRecord.findOne({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    country: input.country,
  });

  const data = {
    port: input.port,
    brokerAgent: input.brokerAgent,
    declarationReference: input.declarationReference,
    submittedDate: input.submittedDate ? new Date(input.submittedDate) : undefined,
    currentStatus: input.currentStatus,
    holdReason: input.holdReason,
    requiredAction: input.requiredAction,
    releaseDate: input.releaseDate ? new Date(input.releaseDate) : undefined,
    dataSource: input.dataSource ?? "manual",
    notes: input.notes,
  };

  let record;
  if (existing) {
    Object.assign(existing, data);
    await existing.save();
    record = existing;
  } else {
    record = await CustomsClearanceRecord.create({
      shipmentLotId: new Types.ObjectId(input.shipmentLotId),
      country: input.country,
      ...data,
      createdByUserId: new Types.ObjectId(input.actorUserId),
    });
  }

  await writeAuditEvent({
    action: "customs.status_updated",
    targetType: "customs_clearance_record",
    targetId: String(record._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { status: input.currentStatus, dataSource: data.dataSource },
  });

  return record;
}
