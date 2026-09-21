import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { isTerminal49Configured } from "@/lib/integrations/providers/terminal49/client";
import { fetchTerminal49Snapshot } from "@/lib/integrations/providers/terminal49/provider";
import { ManualTrackingProvider } from "@/lib/tracking/manual";
import type { ShipmentSnapshot, TrackingProvider } from "@/lib/tracking/types";

/**
 * Live ocean tracking via Terminal49 when API read access is enabled.
 * Falls back to persisted manual milestones when the API is unavailable.
 */
export class Terminal49TrackingProvider implements TrackingProvider {
  readonly name = "terminal49";
  private readonly manual = new ManualTrackingProvider();

  async getShipment(reference: string): Promise<ShipmentSnapshot | null> {
    if (!isTerminal49Configured() || !isMongoConfigured()) {
      return this.manual.getShipment(reference);
    }

    try {
      await tryConnectMongo();
      const { TrackingReference } = await import("@/models");
      const ref = await TrackingReference.findOne({
        $or: [{ trackingNumber: reference }, { trackingNumber: reference.toUpperCase() }],
        provider: "terminal49",
        active: true,
      }).lean();

      if (ref?.providerResourceIds?.shipmentId || ref?.providerResourceIds?.containerId) {
        const live = await fetchTerminal49Snapshot({
          reference,
          shipmentId: ref.providerResourceIds.shipmentId,
          containerId: ref.providerResourceIds.containerId,
        });
        if (live) return live;
      }

      return this.manual.getShipment(reference);
    } catch {
      return this.manual.getShipment(reference);
    }
  }
}
