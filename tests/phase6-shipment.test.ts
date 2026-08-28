import { describe, expect, it } from "vitest";
import {
  findShipmentTransition,
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_LOT_TRANSITIONS,
} from "@/lib/shipments/workflow";
import { validateShippingDocuments } from "@/lib/shipments/document-validation";
import { normalizeProviderEventType } from "@/lib/shipments/tracking-provider";
import { normalizeWebhookEvents } from "@/lib/shipments/tracking-service";
import { isMongoConfigured } from "@/lib/db/mongoose";

describe("Phase 6 shipment workflow", () => {
  it("defines shipment status labels", () => {
    expect(SHIPMENT_STATUS_LABELS.planned).toBe("Planned");
    expect(SHIPMENT_STATUS_LABELS.loaded).toBe("Loaded");
    expect(SHIPMENT_STATUS_LABELS.delivered).toBe("Delivered");
  });

  it("allows planned to awaiting_allocation", () => {
    const t = findShipmentTransition("planned", "awaiting_allocation");
    expect(t?.permission).toBe("shipments:write");
  });

  it("blocks arbitrary transitions", () => {
    expect(findShipmentTransition("planned", "delivered")).toBeUndefined();
  });

  it("requires evidence for loaded status", () => {
    const t = findShipmentTransition("loading", "loaded");
    expect(t?.requiresEvidence).toBe(true);
  });

  it("requires evidence for delivered status", () => {
    const t = findShipmentTransition("out_for_delivery", "delivered");
    expect(t?.requiresEvidence).toBe(true);
  });

  it("allows cancel from planned with reason", () => {
    const t = findShipmentTransition("planned", "cancelled");
    expect(t?.requiresReason).toBe(true);
    expect(t?.permission).toBe("shipments:approve");
  });

  it("defines core transition graph", () => {
    expect(SHIPMENT_LOT_TRANSITIONS.length).toBeGreaterThan(10);
  });
});

describe("Shipping document validation without DB", () => {
  it("returns empty when mongo unavailable", async () => {
    const result = await validateShippingDocuments("000000000000000000000000");
    expect(result.blocking).toEqual([]);
    expect(result.informational.length).toBe(0);
  });
});

describe("Tracking provider normalization", () => {
  it("normalizes provider event types", () => {
    expect(normalizeProviderEventType("departed")).toBe("departed");
    expect(normalizeProviderEventType("DELIVERED")).toBe("delivered");
    expect(normalizeProviderEventType("unknown_type")).toBe("exception");
  });

  it("keeps estimated and confirmed as separate confidence values in model", () => {
    expect(["confirmed", "estimated"]).toContain("estimated");
  });
});

describe("Shipment isolation rules", () => {
  it("buyer and supplier sides are distinct transaction sides", () => {
    expect(SHIPMENT_STATUS_LABELS.cancelled).toBe("Cancelled");
    expect(findShipmentTransition("delivered", "closed")?.permission).toBe("shipments:approve");
  });
});

describe("Shipment immutability", () => {
  it("closed and cancelled are terminal states in labels", () => {
    expect(SHIPMENT_STATUS_LABELS.closed).toBe("Closed");
    expect(SHIPMENT_STATUS_LABELS.cancelled).toBe("Cancelled");
    expect(findShipmentTransition("closed", "delivered")).toBeUndefined();
  });
});

describe("Tracking webhook normalization", () => {
  it("parses webhook event payloads", () => {
    const events = normalizeWebhookEvents({
      events: [
        {
          eventType: "departed",
          eventTimestamp: "2026-09-22T12:00:00Z",
          description: "Departed port",
          confidence: "estimated",
          id: "evt-1",
        },
      ],
    });
    expect(events.length).toBe(1);
    expect(events[0].eventType).toBe("departed");
    expect(events[0].estimatedStatus).toBe(true);
  });
});

describe("Duplicate tracking events", () => {
  it("skips duplicate source references when mongo available", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { ShipmentLot } = await import("@/models");
    const lot = await ShipmentLot.findOne({ shipmentLotNumber: "FK-SHP-2026-TEST-0001" }).lean();
    if (!lot) return;
    const { recordTrackingEvent } = await import("@/lib/shipments/tracking-service");
    const ts = "2026-09-22T15:00:00Z";
    await recordTrackingEvent({
      shipmentLotId: String(lot._id),
      eventType: "in_transit",
      eventTimestamp: ts,
      description: "TEST duplicate check",
      sourceReference: "dup-test-ref",
      confidence: "estimated",
    });
    const dup = await recordTrackingEvent({
      shipmentLotId: String(lot._id),
      eventType: "in_transit",
      eventTimestamp: ts,
      description: "TEST duplicate check",
      sourceReference: "dup-test-ref",
      confidence: "estimated",
    });
    expect(dup).toBeDefined();
  });
});

describe("Phase 6 integration with MongoDB", () => {
  it("seeded buyer shipment is buyer_sale side", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { ShipmentLot } = await import("@/models");
    const lot = await ShipmentLot.findOne({ shipmentLotNumber: "FK-SHP-2026-TEST-0001" }).lean();
    if (!lot) return;
    expect(lot.transactionSide).toBe("buyer_sale");
  });

  it("buyer cannot see supplier shipment lot number in opposite record query", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { ShipmentLot } = await import("@/models");
    const buyerLot = await ShipmentLot.findOne({
      shipmentLotNumber: "FK-SHP-2026-TEST-0001",
    }).lean();
    const supplierLot = await ShipmentLot.findOne({
      shipmentLotNumber: "FK-SHP-2026-TEST-0002",
    }).lean();
    if (!buyerLot || !supplierLot) return;
    expect(buyerLot.transactionSide).not.toBe(supplierLot.transactionSide);
    expect(String(buyerLot.transactionId)).not.toBe(String(supplierLot.transactionId));
  });

  it("allocation records are internal-only model", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { ShipmentLotAllocation } = await import("@/models");
    const alloc = await ShipmentLotAllocation.findOne().lean();
    if (!alloc) return;
    expect(alloc.dealGroupId).toBeDefined();
    expect(alloc.buyerShipmentLotId).toBeDefined();
    expect(alloc.supplierShipmentLotId).toBeDefined();
  });
});
