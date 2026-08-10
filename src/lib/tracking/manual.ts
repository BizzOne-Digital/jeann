import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { ShipmentMilestone, ShipmentSnapshot, TrackingProvider } from "@/lib/tracking/types";
import type { ShipmentMilestone as DbMilestone } from "@/models/Shipment";

/**
 * Manual milestone provider — reads persisted shipment records only.
 * NEVER fabricates GPS/live locations when no carrier integration is configured.
 */
export class ManualTrackingProvider implements TrackingProvider {
  readonly name = "manual";

  async getShipment(reference: string): Promise<ShipmentSnapshot | null> {
    if (!isMongoConfigured()) return null;

    try {
      await tryConnectMongo();
      const { Shipment } = await import("@/models/Shipment");
      const doc = await Shipment.findOne({ references: reference }).lean();

      if (!doc) return null;

      const milestones: ShipmentMilestone[] = (doc.milestones ?? []).map(
        (m: DbMilestone) => ({
          key: m.key,
          label: m.label,
          occurredAt: m.occurredAt,
          locationLabel: m.location,
          notes: m.notes,
        }),
      );

      return {
        reference,
        status: doc.status,
        carrier: doc.carrier,
        mode: doc.mode,
        originPort: doc.originPort,
        destinationPort: doc.destinationPort,
        etd: doc.etd,
        eta: doc.eta,
        milestones,
        liveTracking: false,
      };
    } catch {
      return null;
    }
  }
}
