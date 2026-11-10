import { describe, expect, it } from "vitest";
import { getBookingProvider, listBookingProviders } from "@/lib/shipments/booking-provider";
import { bookingRequestSchema, requiresCharteringBroker } from "@/lib/shipments/booking-request";

const valid = {
  shipmentLotId: "507f1f77bcf86cd799439011",
  cargoType: "container",
  commodity: "Refined sugar ICUMSA 45",
  quantityMt: 500,
  loadingPort: "Santos",
  destinationPort: "Jebel Ali",
  preferredLoadingDate: "2026-12-10",
  incoterm: "FOB",
  shipperName: "Supplier Co",
  consigneeName: "Buyer Co",
};

describe("shipment booking request", () => {
  it("accepts a complete request and defaults to the manual provider", () => {
    const parsed = bookingRequestSchema.parse(valid);
    expect(parsed.provider).toBe("manual");
  });

  it("rejects missing ports, non-positive quantity and unsupported terms", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, loadingPort: "" }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, quantityMt: 0 }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, incoterm: "EXW" }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, cargoType: "airfreight" }).success).toBe(false);
  });

  it("flags bulk vessels and tankers as chartering broker business", () => {
    expect(requiresCharteringBroker("dry_bulk")).toBe(true);
    expect(requiresCharteringBroker("liquid_tanker")).toBe(true);
    expect(requiresCharteringBroker("container")).toBe(false);
  });

  it("only offers providers that are actually connected", async () => {
    expect(listBookingProviders()).toEqual(["manual"]);
    expect(getBookingProvider("maersk")).toBeNull();
    const result = await getBookingProvider("manual")!.submit(bookingRequestSchema.parse(valid));
    expect(result.status).toBe("requested");
  });
});
