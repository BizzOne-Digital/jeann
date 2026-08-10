import { getEnv } from "@/lib/config/env";
import { ManualTrackingProvider } from "@/lib/tracking/manual";
import type { ShipmentSnapshot, TrackingProvider } from "@/lib/tracking/types";

let cached: TrackingProvider | null = null;

export function getTrackingProvider(): TrackingProvider {
  if (cached) return cached;
  const env = getEnv();
  switch (env.SHIPMENT_TRACKING_PROVIDER) {
    case "manual":
    case "none":
      cached = new ManualTrackingProvider();
      return cached;
    default:
      cached = new ManualTrackingProvider();
      return cached;
  }
}

export async function getShipmentTracking(reference: string): Promise<ShipmentSnapshot | null> {
  return getTrackingProvider().getShipment(reference);
}

export type { TrackingProvider, ShipmentSnapshot } from "@/lib/tracking/types";
