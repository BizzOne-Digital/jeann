import {
  createTracker,
  easyPostHealthCheck,
  getTracker,
  isEasyPostConfigured,
  type EasyPostTracker,
} from "@/lib/integrations/providers/easypost/client";
import {
  mapEasyPostTrackerToEvents,
  mapEasyPostTrackerToSnapshot,
} from "@/lib/integrations/providers/easypost/mappers";
import type { ShippingTrackingProvider } from "@/lib/shipments/tracking-provider";
import type { ShipmentSnapshot } from "@/lib/tracking/types";

export class EasyPostShippingProvider implements ShippingTrackingProvider {
  readonly name = "easypost";

  async createWatch(reference: string, metadata?: Record<string, string>) {
    if (!isEasyPostConfigured()) return {};
    const carrier = metadata?.carrier;
    if (!carrier) throw new Error("easypost_carrier_required");

    const tracker = await createTracker({ trackingCode: reference, carrier });
    return { trackingRequestId: tracker.id };
  }

  async getCurrentStatus(reference: string) {
    const history = await this.getEventHistory(reference);
    return history[0] ?? null;
  }

  async getEventHistory(_reference: string) {
    return [];
  }

  async processWebhook(payload: unknown) {
    const doc = payload as { result?: EasyPostTracker; description?: string };
    const tracker = doc.result;
    if (!tracker?.id) return [];
    return mapEasyPostTrackerToEvents(tracker);
  }

  normalizeEvent(raw: Record<string, unknown>) {
    if (raw.result && typeof raw.result === "object") {
      const events = mapEasyPostTrackerToEvents(raw.result as EasyPostTracker);
      return events[0] ?? null;
    }
    return null;
  }

  async healthCheck() {
    return easyPostHealthCheck();
  }
}

export async function fetchEasyPostSnapshot(input: {
  reference: string;
  trackerId?: string;
}): Promise<ShipmentSnapshot | null> {
  if (!isEasyPostConfigured() || !input.trackerId) return null;
  const tracker = await getTracker(input.trackerId);
  return mapEasyPostTrackerToSnapshot(input.reference, tracker);
}

export async function syncEasyPostReference(input: {
  reference: string;
  trackerId: string;
}) {
  const tracker = await getTracker(input.trackerId);
  const events = mapEasyPostTrackerToEvents(tracker);
  const snapshot = mapEasyPostTrackerToSnapshot(input.reference, tracker);
  return { tracker, events, snapshot };
}
