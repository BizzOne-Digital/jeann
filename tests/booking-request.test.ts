import { describe, expect, it } from "vitest";
import { getBookingProvider, listBookingProviders } from "@/lib/shipments/booking-provider";
import { bookingRequestSchema, defaultProviderFor, requiresCharteringBroker } from "@/lib/shipments/booking-request";

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
  it("accepts a complete container request and sends it to the manual desk by default", () => {
    const parsed = bookingRequestSchema.parse(valid);
    expect(parsed.provider).toBeUndefined();
    expect(defaultProviderFor(parsed.cargoType)).toBe("manual");
  });

  it("requires a laycan window and vessel size for dry bulk and tanker charter enquiries", () => {
    const bulk = { ...valid, cargoType: "dry_bulk" };
    expect(bookingRequestSchema.safeParse(bulk).success).toBe(false);
    expect(
      bookingRequestSchema.safeParse({ ...bulk, laycanFrom: "2026-12-10", laycanTo: "2026-12-20", vesselSizeClass: "Supramax" }).success,
    ).toBe(true);
    expect(defaultProviderFor("liquid_tanker")).toBe("chartering_broker");
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
    expect(listBookingProviders()).toEqual(["manual", "chartering_broker"]);
    expect(getBookingProvider("maersk")).toBeNull();
    const result = await getBookingProvider("manual")!.submit(bookingRequestSchema.parse(valid));
    expect(result.status).toBe("requested");
  });
});
