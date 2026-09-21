import { normalizeProviderEventType, type NormalizedTrackingEvent } from "@/lib/shipments/tracking-provider";
import { parseShipmentLotIdFromRefNumbers } from "@/lib/integrations/providers/terminal49/constants";
import type { ShipmentMilestone, ShipmentSnapshot, ShipmentStatus } from "@/lib/tracking/types";

type IncludedResource = {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
};

export function mapReferenceTypeToRequestType(
  referenceType: string,
): "bill_of_lading" | "booking" | "container" {
  const normalized = referenceType.toLowerCase().replace(/-/g, "_");
  if (normalized.includes("container")) return "container";
  if (normalized.includes("booking")) return "booking";
  return "bill_of_lading";
}

const TRANSPORT_EVENT_MAP: Record<string, string> = {
  "container.transport.empty_out": "empty_released",
  "container.transport.full_in": "gate_in",
  "container.transport.vessel_loaded": "loaded",
  "container.transport.vessel_departed": "departed",
  "container.transport.transshipment_arrived": "transshipment",
  "container.transport.transshipment_departed": "transshipment",
  "container.transport.vessel_arrived": "arrived",
  "container.transport.vessel_discharged": "discharged",
  "container.transport.full_out": "out_for_delivery",
  "container.transport.empty_in": "delivered",
  "tracking_request.failed": "exception",
  "tracking_request.tracking_stopped": "cancelled",
};

function includedByType(included: IncludedResource[] | undefined, type: string): IncludedResource[] {
  return (included ?? []).filter((r) => r.type === type);
}

function firstIncluded(included: IncludedResource[] | undefined, type: string): IncludedResource | undefined {
  return includedByType(included, type)[0];
}

export function extractLotAndRefsFromWebhook(payload: {
  included?: IncludedResource[];
}): { shipmentLotId: string | null; containerNumber?: string; shipmentId?: string; containerId?: string } {
  const included = payload.included ?? [];
  const shipment = firstIncluded(included, "shipment");
  const container = firstIncluded(included, "container");
  const trackingRequest = firstIncluded(included, "tracking_request");

  const refNumbers = [
    ...(Array.isArray(shipment?.attributes?.ref_numbers)
      ? (shipment.attributes.ref_numbers as string[])
      : []),
    ...(Array.isArray(trackingRequest?.attributes?.ref_numbers)
      ? (trackingRequest.attributes.ref_numbers as string[])
      : []),
  ];

  const shipmentLotId = parseShipmentLotIdFromRefNumbers(refNumbers);
  const containerNumber = container?.attributes?.number
    ? String(container.attributes.number)
    : undefined;

  return {
    shipmentLotId,
    containerNumber,
    shipmentId: shipment?.id,
    containerId: container?.id,
  };
}

export function mapTerminal49WebhookToEvents(
  payload: {
    data?: {
      id?: string;
      attributes?: { event?: string; created_at?: string };
    };
    included?: IncludedResource[];
  },
  notificationId: string,
): NormalizedTrackingEvent[] {
  const eventName = payload.data?.attributes?.event ?? "exception";
  const included = payload.included ?? [];
  const transport = firstIncluded(included, "transport_event");
  const container = firstIncluded(included, "container");
  const shipment = firstIncluded(included, "shipment");

  const timestamp =
    transport?.attributes?.timestamp ??
    transport?.attributes?.estimated_timestamp ??
    payload.data?.attributes?.created_at ??
    new Date().toISOString();

  const location =
    transport?.attributes?.location_locode != null
      ? String(transport.attributes.location_locode)
      : undefined;

  const mappedType = TRANSPORT_EVENT_MAP[eventName] ?? eventName.replace(/\./g, "_");
  const eventType = normalizeProviderEventType(mappedType);
  const containerLabel = container?.attributes?.number ? String(container.attributes.number) : "container";
  const description = `${eventName.replace(/\./g, " ")} — ${containerLabel}`;

  const confirmed = !eventName.includes("estimated");

  const events: NormalizedTrackingEvent[] = [
    {
      eventType,
      eventTimestamp: new Date(String(timestamp)),
      location,
      description,
      source: "terminal49",
      sourceReference: `${notificationId}:${eventName}`,
      confidence: confirmed ? "confirmed" : "estimated",
      confirmedStatus: confirmed,
      estimatedStatus: !confirmed,
      rawProviderStatus: eventName,
    },
  ];

  if (eventName === "container.updated") {
    const updateEvent = firstIncluded(included, "container_updated_event");
    const changeset = updateEvent?.attributes?.changeset as Record<string, unknown> | undefined;
    if (changeset && Object.keys(changeset).length > 0) {
      const keys = Object.keys(changeset).join(", ");
      events.push({
        eventType: "exception",
        eventTimestamp: new Date(String(updateEvent?.attributes?.timestamp ?? timestamp)),
        description: `Container attributes updated (${keys})`,
        source: "terminal49",
        sourceReference: `${notificationId}:container.updated`,
        confidence: "confirmed",
        confirmedStatus: true,
        estimatedStatus: false,
        rawProviderStatus: "container.updated",
      });
    }
  }

  if (eventName === "tracking_request.succeeded" && shipment?.id) {
    events.push({
      eventType: "booking_confirmed",
      eventTimestamp: new Date(String(timestamp)),
      description: "Terminal49 tracking request succeeded",
      source: "terminal49",
      sourceReference: `${notificationId}:tracking_request.succeeded`,
      confidence: "confirmed",
      confirmedStatus: true,
      estimatedStatus: false,
      rawProviderStatus: eventName,
    });
  }

  return events;
}

function mapShipmentStatus(attrs: Record<string, unknown> | undefined): ShipmentStatus {
  if (!attrs) return "in_transit";
  if (attrs.pod_full_out_at || attrs.empty_terminated_at) return "delivered";
  if (attrs.pod_discharged_at || attrs.pod_arrived_at) return "in_transit";
  return "in_transit";
}

export function mapTerminal49ShipmentToSnapshot(
  reference: string,
  shipmentAttrs: Record<string, unknown> | undefined,
  containerAttrs: Record<string, unknown> | undefined,
): ShipmentSnapshot {
  const milestones: ShipmentMilestone[] = [];
  const addMilestone = (key: string, label: string, at?: unknown, location?: string) => {
    if (!at) return;
    milestones.push({
      key,
      label,
      occurredAt: new Date(String(at)),
      locationLabel: location,
    });
  };

  addMilestone("loaded", "Loaded", containerAttrs?.loaded_at);
  addMilestone("departed", "Departed POL", shipmentAttrs?.pol_atd_at ?? containerAttrs?.pol_loaded_at);
  addMilestone("arrived", "Arrived POD", shipmentAttrs?.pod_ata_at ?? containerAttrs?.pod_arrived_at);
  addMilestone("discharged", "Discharged", containerAttrs?.pod_discharged_at);
  addMilestone("delivered", "Full out", containerAttrs?.pod_full_out_at);

  const etaRaw = shipmentAttrs?.pod_eta_at ?? shipmentAttrs?.destination_eta_at;
  const etdRaw = shipmentAttrs?.pol_etd_at;

  return {
    reference,
    status: mapShipmentStatus(containerAttrs ?? shipmentAttrs),
    carrier: shipmentAttrs?.shipping_line_name ? String(shipmentAttrs.shipping_line_name) : undefined,
    mode: "ocean",
    originPort: shipmentAttrs?.pol_locode ? String(shipmentAttrs.pol_locode) : undefined,
    destinationPort: shipmentAttrs?.pod_locode ? String(shipmentAttrs.pod_locode) : undefined,
    etd: etdRaw ? new Date(String(etdRaw)) : undefined,
    eta: etaRaw ? new Date(String(etaRaw)) : undefined,
    milestones,
    liveTracking: true,
  };
}
