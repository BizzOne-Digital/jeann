import { Types } from "mongoose";
import { getEnv } from "@/lib/config/env";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isTerminal49Configured } from "@/lib/integrations/providers/terminal49/client";
import { isEasyPostConfigured } from "@/lib/integrations/providers/easypost/client";
import { fetchEasyPostSnapshot, syncEasyPostReference } from "@/lib/integrations/providers/easypost/provider";
import {
  fetchTerminal49Snapshot,
  triggerTerminal49ContainerRefresh,
} from "@/lib/integrations/providers/terminal49/provider";
import { isAnyLiveTrackingConfigured } from "@/lib/integrations/providers/shipping-tracking-registry";
import { getVisibleTrackingEvents, recordTrackingEvent } from "@/lib/shipments/tracking-service";
import type { ShipmentSnapshot } from "@/lib/tracking/types";

const EVENT_LABELS: Record<string, string> = {
  booking_confirmed: "Booking confirmed",
  empty_released: "Empty released",
  gate_in: "Gate in",
  loaded: "Loaded on vessel",
  departed: "Departed",
  transshipment: "Transshipment",
  arrived: "Arrived",
  discharged: "Discharged",
  customs_hold: "Customs hold",
  customs_released: "Customs released",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
  cancelled: "Cancelled",
};

export function trackingEventLabel(eventType: string): string {
  return EVENT_LABELS[eventType] ?? eventType.replace(/_/g, " ");
}

function serializeSnapshot(snapshot: ShipmentSnapshot | null) {
  if (!snapshot) return null;
  return {
    reference: snapshot.reference,
    status: snapshot.status,
    carrier: snapshot.carrier,
    mode: snapshot.mode,
    originPort: snapshot.originPort,
    destinationPort: snapshot.destinationPort,
    etd: snapshot.etd?.toISOString(),
    eta: snapshot.eta?.toISOString(),
    liveTracking: snapshot.liveTracking,
    milestones: snapshot.milestones.map((m) => ({
      key: m.key,
      label: m.label,
      occurredAt: m.occurredAt?.toISOString(),
      locationLabel: m.locationLabel,
      notes: m.notes,
    })),
  };
}

async function loadSnapshotForRef(ref: {
  provider: string;
  trackingNumber: string;
  providerResourceIds?: {
    shipmentId?: string;
    containerId?: string;
    trackerId?: string;
  };
}): Promise<ShipmentSnapshot | null> {
  if (ref.provider === "terminal49" && isTerminal49Configured()) {
    return fetchTerminal49Snapshot({
      reference: ref.trackingNumber,
      shipmentId: ref.providerResourceIds?.shipmentId,
      containerId: ref.providerResourceIds?.containerId,
    });
  }
  if (ref.provider === "easypost" && isEasyPostConfigured()) {
    return fetchEasyPostSnapshot({
      reference: ref.trackingNumber,
      trackerId: ref.providerResourceIds?.trackerId,
    });
  }
  return null;
}

export async function loadShipmentLotTrackingView(
  lotId: string,
  viewerSide: "internal" | "buyer" | "supplier",
  options?: { canManageTracking?: boolean },
) {
  await tryConnectMongo();
  const env = getEnv();
  const { TrackingReference } = await import("@/models");

  const refs = await TrackingReference.find({
    shipmentLotId: new Types.ObjectId(lotId),
    active: true,
  })
    .sort({ updatedAt: -1 })
    .lean();

  const events = await getVisibleTrackingEvents(lotId, viewerSide);

  const liveEnabled = isAnyLiveTrackingConfigured();
  const primaryRef =
    refs.find((r) => r.provider === "terminal49") ??
    refs.find((r) => r.provider === "easypost") ??
    refs[0];

  let snapshot: ShipmentSnapshot | null = null;
  if (primaryRef) {
    try {
      snapshot = await loadSnapshotForRef(primaryRef);
    } catch {
      snapshot = null;
    }
  }

  const providers = {
    terminal49: isTerminal49Configured(),
    easypost: isEasyPostConfigured(),
  };

  return {
    provider: env.SHIPMENT_TRACKING_PROVIDER,
    providers,
    liveEnabled,
    capabilities: {
      canRefresh: liveEnabled && Boolean(primaryRef),
      canManageTracking: Boolean(options?.canManageTracking),
    },
    references: refs.map((r) => ({
      id: String(r._id),
      provider: r.provider,
      referenceType: r.referenceType,
      trackingNumber: r.trackingNumber,
      carrier: r.carrier,
      dataSource: r.dataSource,
      lastSynchronizedAt: r.lastSynchronizedAt?.toISOString(),
    })),
    snapshot: serializeSnapshot(snapshot),
    events: events.map((e) => ({
      id: String(e._id),
      eventType: e.eventType,
      eventLabel: trackingEventLabel(String(e.eventType)),
      eventTimestamp: e.eventTimestamp,
      location: e.location,
      description: e.description,
      confidence: e.confidence,
      source: e.source,
    })),
    disclaimer:
      "Carrier and terminal data is provided by integrated tracking services. Milestones are informational — delivery is not auto-confirmed.",
  };
}

export async function syncShipmentLotLiveTracking(lotId: string) {
  await tryConnectMongo();
  const { TrackingReference } = await import("@/models");

  const refs = await TrackingReference.find({
    shipmentLotId: new Types.ObjectId(lotId),
    active: true,
    provider: { $in: ["terminal49", "easypost"] },
  }).lean();

  if (!refs.length) {
    return { refreshed: 0, snapshot: null as ReturnType<typeof serializeSnapshot> };
  }

  let refreshed = 0;
  for (const ref of refs) {
    if (ref.provider === "terminal49") {
      const containerId = ref.providerResourceIds?.containerId;
      if (containerId) {
        try {
          await triggerTerminal49ContainerRefresh(containerId);
          refreshed += 1;
        } catch {
          /* best-effort */
        }
      }
    }
    if (ref.provider === "easypost" && ref.providerResourceIds?.trackerId) {
      try {
        const synced = await syncEasyPostReference({
          reference: ref.trackingNumber,
          trackerId: ref.providerResourceIds.trackerId,
        });
        refreshed += 1;
        for (const evt of synced.events) {
          await recordTrackingEvent({
            shipmentLotId: lotId,
            trackingReferenceId: String(ref._id),
            eventType: evt.eventType,
            eventTimestamp: evt.eventTimestamp.toISOString(),
            location: evt.location,
            description: evt.description ?? evt.eventType,
            source: evt.source,
            sourceReference: evt.sourceReference,
            confidence: evt.confirmedStatus ? "confirmed" : "estimated",
            rawProviderStatus: evt.rawProviderStatus,
            buyerVisible: true,
            supplierVisible: true,
          });
        }
      } catch {
        /* best-effort */
      }
    }
    await TrackingReference.updateOne({ _id: ref._id }, { $set: { lastSynchronizedAt: new Date() } });
  }

  const primary = refs[0];
  let snapshot: ShipmentSnapshot | null = null;
  try {
    snapshot = await loadSnapshotForRef(primary);
  } catch {
    snapshot = null;
  }

  return { refreshed, snapshot: serializeSnapshot(snapshot) };
}
