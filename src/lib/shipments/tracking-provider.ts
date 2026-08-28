import type { ShipmentTrackingEventLean } from "@/models/ShipmentTrackingEvent";

export type ShipmentTrackingEventType = ShipmentTrackingEventLean["eventType"];

export type NormalizedTrackingEvent = {
  eventType: ShipmentTrackingEventType;
  eventTimestamp: Date;
  eventTimezone?: string;
  location?: string;
  description?: string;
  source: string;
  sourceReference?: string;
  confidence?: string;
  confirmedStatus: boolean;
  estimatedStatus: boolean;
  rawProviderStatus?: string;
};

export interface ShippingTrackingProvider {
  readonly name: string;
  createWatch(reference: string, metadata?: Record<string, string>): Promise<void>;
  getCurrentStatus(reference: string): Promise<NormalizedTrackingEvent | null>;
  getEventHistory(reference: string): Promise<NormalizedTrackingEvent[]>;
  processWebhook(payload: unknown, signature?: string): Promise<NormalizedTrackingEvent[]>;
  normalizeEvent(raw: Record<string, unknown>): NormalizedTrackingEvent | null;
  healthCheck(): Promise<{ ok: boolean; message?: string }>;
}

export function normalizeProviderEventType(value: string): ShipmentTrackingEventType {
  const map: Record<string, ShipmentTrackingEventType> = {
    booking_confirmed: "booking_confirmed",
    empty_released: "empty_released",
    gate_in: "gate_in",
    loaded: "loaded",
    departed: "departed",
    transshipment: "transshipment",
    arrived: "arrived",
    discharged: "discharged",
    customs_hold: "customs_hold",
    customs_released: "customs_released",
    out_for_delivery: "out_for_delivery",
    delivered: "delivered",
    exception: "exception",
    cancelled: "cancelled",
  };
  return map[value.toLowerCase()] ?? "exception";
}
