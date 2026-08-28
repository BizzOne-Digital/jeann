import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  normalizeProviderEventType,
  type NormalizedTrackingEvent,
} from "@/lib/shipments/tracking-provider";

export async function addTrackingReference(input: {
  shipmentLotId: string;
  provider: string;
  referenceType: string;
  trackingNumber: string;
  carrier?: string;
  dataSource?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { TrackingReference } = await import("@/models");

  const ref = await TrackingReference.create({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    provider: input.provider,
    referenceType: input.referenceType,
    trackingNumber: input.trackingNumber,
    carrier: input.carrier,
    dataSource: input.dataSource ?? "manual",
    active: true,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "tracking.reference_created",
    targetType: "tracking_reference",
    targetId: String(ref._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return ref;
}

export async function recordTrackingEvent(input: {
  shipmentLotId: string;
  trackingReferenceId?: string;
  eventType: string;
  eventTimestamp: string;
  eventTimezone?: string;
  location?: string;
  description: string;
  source?: string;
  sourceReference?: string;
  confidence?: "confirmed" | "estimated";
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  rawProviderStatus?: string;
  actorUserId?: string;
}) {
  await tryConnectMongo();
  const { ShipmentTrackingEvent } = await import("@/models");

  const normalizedType = normalizeProviderEventType(input.eventType);
  const confidence = input.confidence ?? "estimated";

  const existing = await ShipmentTrackingEvent.findOne({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    sourceReference: input.sourceReference,
    eventType: normalizedType,
    eventTimestamp: new Date(input.eventTimestamp),
  }).lean();

  if (existing) return existing;

  const event = await ShipmentTrackingEvent.create({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    trackingReferenceId: input.trackingReferenceId
      ? new Types.ObjectId(input.trackingReferenceId)
      : undefined,
    eventType: normalizedType,
    eventTimestamp: new Date(input.eventTimestamp),
    eventTimezone: input.eventTimezone ?? "UTC",
    location: input.location,
    description: input.description,
    source: input.source ?? "manual",
    sourceReference: input.sourceReference,
    confidence,
    rawProviderStatus: input.rawProviderStatus,
    buyerVisible: input.buyerVisible ?? false,
    supplierVisible: input.supplierVisible ?? false,
  });

  if (input.actorUserId) {
    await writeAuditEvent({
      action: "tracking.event_recorded",
      targetType: "shipment_tracking_event",
      targetId: String(event._id),
      actorUserId: input.actorUserId,
      result: "success",
    });
  }

  return event;
}

export async function getVisibleTrackingEvents(
  shipmentLotId: string,
  viewerSide: "internal" | "buyer" | "supplier",
) {
  await tryConnectMongo();
  const { ShipmentTrackingEvent } = await import("@/models");

  const query: Record<string, unknown> = {
    shipmentLotId: new Types.ObjectId(shipmentLotId),
  };
  if (viewerSide === "buyer") query.buyerVisible = true;
  if (viewerSide === "supplier") query.supplierVisible = true;

  return ShipmentTrackingEvent.find(query).sort({ eventTimestamp: -1 }).limit(100).lean();
}

export function normalizeWebhookEvents(
  payload: { events?: Array<Record<string, unknown>> },
): NormalizedTrackingEvent[] {
  const results: NormalizedTrackingEvent[] = [];
  for (const raw of payload.events ?? []) {
    const eventType = normalizeProviderEventType(String(raw.eventType ?? raw.status ?? "exception"));
    const ts = raw.eventTimestamp ?? raw.timestamp;
    if (!ts) continue;
    results.push({
      eventType,
      eventTimestamp: new Date(String(ts)),
      location: raw.location ? String(raw.location) : undefined,
      description: String(raw.description ?? raw.status ?? eventType),
      source: "webhook",
      sourceReference: raw.id ? String(raw.id) : undefined,
      confirmedStatus: raw.confidence === "confirmed",
      estimatedStatus: raw.confidence !== "confirmed",
      rawProviderStatus: raw.status ? String(raw.status) : undefined,
    });
  }
  return results;
}
