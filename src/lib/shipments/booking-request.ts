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
  provider: z.string().trim().min(1).max(40).default("manual"),
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
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

/** Bulk vessels and tankers are booked through vessel operators and chartering brokers, not container APIs. */
export function requiresCharteringBroker(cargoType: CargoType): boolean {
  return cargoType === "dry_bulk" || cargoType === "liquid_tanker";
}
