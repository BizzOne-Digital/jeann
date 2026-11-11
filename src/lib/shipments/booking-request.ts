import { z } from "zod";

/** Cargo types a booking request can cover. Container APIs generally do not book bulk carriers or tankers. */
export const CARGO_TYPES = ["container", "flexitank", "dry_bulk", "liquid_tanker"] as const;
export type CargoType = (typeof CARGO_TYPES)[number];

export const CARGO_TYPE_LABELS: Record<CargoType, string> = {
  container: "Container",
  flexitank: "Flexitank",
  dry_bulk: "Dry bulk vessel",
  liquid_tanker: "Liquid / edible-oil tanker",
};

/** What a booking request must contain before it is sent to a logistics provider. */
export const bookingRequestSchema = z.object({
  shipmentLotId: z.string().min(1),
  provider: z.string().trim().min(1).max(40).optional(),
  cargoType: z.enum(CARGO_TYPES),
  commodity: z.string().trim().min(2).max(200),
  quantityMt: z.number().positive().max(1_000_000),
  loadingPort: z.string().trim().min(2).max(120),
  destinationPort: z.string().trim().min(2).max(120),
  /** Preferred loading date, or the laycan window for bulk vessels. */
  preferredLoadingDate: z.string().trim().min(4).max(60),
  incoterm: z.enum(["FOB", "CIF"]),
  packagingHandling: z.string().trim().max(500).optional(),
  shipperName: z.string().trim().min(2).max(200),
  consigneeName: z.string().trim().min(2).max(200),
  customerAccountNumber: z.string().trim().max(60).optional(),
  /** Charter enquiry details, required for dry bulk vessels and tankers. */
  laycanFrom: z.string().trim().max(30).optional(),
  laycanTo: z.string().trim().max(30).optional(),
  cargoTolerancePct: z.number().min(0).max(25).optional(),
  vesselSizeClass: z.string().trim().max(80).optional(),
  charterPartyForm: z.string().trim().max(80).optional(),
}).superRefine((value, ctx) => {
  if (value.cargoType !== "dry_bulk" && value.cargoType !== "liquid_tanker") return;
  // Bulk vessels and tankers are chartered through brokers, who need a laycan window and a vessel size.
  for (const field of ["laycanFrom", "laycanTo", "vesselSizeClass"] as const) {
    if (!value[field]) {
      ctx.addIssue({ code: "custom", path: [field], message: "Required for a charter enquiry." });
    }
  }
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

/** Bulk vessels and tankers are booked through vessel operators and chartering brokers, not container APIs. */
export function requiresCharteringBroker(cargoType: CargoType): boolean {
  return cargoType === "dry_bulk" || cargoType === "liquid_tanker";
}

/** The provider used when none is named: container cargo goes to the manual desk, bulk and tankers to a broker. */
export function defaultProviderFor(cargoType: CargoType): string {
  return requiresCharteringBroker(cargoType) ? "chartering_broker" : "manual";
}
