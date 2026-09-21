import { normalizeProviderEventType, type NormalizedTrackingEvent } from "@/lib/shipments/tracking-provider";
import type { EasyPostTracker } from "@/lib/integrations/providers/easypost/client";
import type { ShipmentMilestone, ShipmentSnapshot, ShipmentStatus } from "@/lib/tracking/types";

const STATUS_MAP: Record<string, string> = {
  pre_transit: "booking_confirmed",
  in_transit: "departed",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  return_to_sender: "exception",
  failure: "exception",
  cancelled: "cancelled",
  unknown: "exception",
};

function mapEasyPostStatus(status: string): ShipmentStatus {
  if (status === "delivered") return "delivered";
  if (status === "cancelled") return "cancelled";
  if (status === "failure" || status === "return_to_sender") return "exception";
  if (status === "pre_transit") return "booked";
  return "in_transit";
}

type EasyPostTrackingDetail = NonNullable<EasyPostTracker["tracking_details"]>[number];

function locationLabel(detail: EasyPostTrackingDetail | undefined): string | undefined {
  const loc = detail?.tracking_location;
  if (!loc) return undefined;
  return [loc.city, loc.state, loc.country, loc.zip].filter(Boolean).join(", ");
}

export function mapEasyPostTrackerToEvents(tracker: EasyPostTracker): NormalizedTrackingEvent[] {
  const events: NormalizedTrackingEvent[] = [];
  for (const detail of tracker.tracking_details ?? []) {
    const rawStatus = detail.status ?? tracker.status;
    const eventType = normalizeProviderEventType(STATUS_MAP[rawStatus] ?? rawStatus);
    const ts = detail.datetime ?? new Date().toISOString();
    events.push({
      eventType,
      eventTimestamp: new Date(ts),
      location: locationLabel(detail),
      description: detail.message ?? rawStatus,
      source: "easypost",
      sourceReference: `easypost:${tracker.id}:${ts}:${detail.message ?? rawStatus}`,
      confidence: "confirmed",
      confirmedStatus: true,
      estimatedStatus: false,
      rawProviderStatus: rawStatus,
    });
  }
  if (!events.length) {
    events.push({
      eventType: normalizeProviderEventType(STATUS_MAP[tracker.status] ?? tracker.status),
      eventTimestamp: new Date(),
      description: `Carrier status: ${tracker.status}`,
      source: "easypost",
      sourceReference: `easypost:${tracker.id}:status`,
      confidence: "estimated",
      confirmedStatus: false,
      estimatedStatus: true,
      rawProviderStatus: tracker.status,
    });
  }
  return events;
}

export function mapEasyPostTrackerToSnapshot(reference: string, tracker: EasyPostTracker): ShipmentSnapshot {
  const milestones: ShipmentMilestone[] = (tracker.tracking_details ?? []).map((d, i) => ({
    key: `ep-${i}`,
    label: d.message ?? d.status ?? "Update",
    occurredAt: d.datetime ? new Date(d.datetime) : undefined,
    locationLabel: locationLabel(d),
  }));

  const eta = tracker.est_delivery_date ? new Date(tracker.est_delivery_date) : undefined;

  return {
    reference,
    status: mapEasyPostStatus(tracker.status),
    carrier: tracker.carrier,
    mode: "parcel",
    eta,
    milestones,
    liveTracking: true,
  };
}
