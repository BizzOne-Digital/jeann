import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  addTrackingReference,
  recordTrackingEvent,
  normalizeWebhookEvents,
} from "@/lib/shipments/tracking-service";

export const runtime = "nodejs";

const refSchema = z.object({
  action: z.literal("add_reference"),
  shipmentLotId: z.string(),
  provider: z.string(),
  referenceType: z.string(),
  trackingNumber: z.string(),
  carrier: z.string().optional(),
  scac: z.string().optional(),
});

const eventSchema = z.object({
  action: z.literal("add_event"),
  shipmentLotId: z.string(),
  trackingReferenceId: z.string().optional(),
  eventType: z.string(),
  eventTimestamp: z.string(),
  location: z.string().optional(),
  description: z.string(),
  confidence: z.enum(["confirmed", "estimated"]).optional(),
  buyerVisible: z.boolean().optional(),
  supplierVisible: z.boolean().optional(),
  sourceReference: z.string().optional(),
});

const webhookSchema = z.object({
  action: z.literal("webhook"),
  shipmentLotId: z.string(),
  events: z.array(z.record(z.string(), z.unknown())).optional(),
  signature: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "webhook") {
      const parsed = webhookSchema.parse(body);
      const envSig = process.env.SHIPMENT_TRACKING_WEBHOOK_SECRET;
      if (envSig && parsed.signature !== envSig) {
        return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
      }
      const normalized = normalizeWebhookEvents({ events: parsed.events ?? [] });
      const created = [];
      for (const evt of normalized) {
        const record = await recordTrackingEvent({
          shipmentLotId: parsed.shipmentLotId,
          eventType: evt.eventType,
          eventTimestamp: evt.eventTimestamp.toISOString(),
          location: evt.location,
          description: evt.description ?? evt.eventType,
          source: evt.source ?? "webhook",
          sourceReference: evt.sourceReference ?? undefined,
          confidence: evt.confirmedStatus ? "confirmed" : "estimated",
        });
        created.push(String(record._id));
      }
      return NextResponse.json({ processed: created.length, eventIds: created });
    }

    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    if (body.action === "add_reference") {
      const parsed = refSchema.parse(body);
      const ref = await addTrackingReference({
        ...parsed,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(ref._id) });
    }

    if (body.action === "add_event") {
      const parsed = eventSchema.parse(body);
      const event = await recordTrackingEvent({
        ...parsed,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(event._id) });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Lookup by tracking number. Visibility-filtered: staff see all, buyer/supplier only their
 * own organisation's lots, banking adviser only lots of deals assigned to them.
 * Other sides' data is never returned; unauthorised lots look like "not found".
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;
    const trackingNumber = request.nextUrl.searchParams.get("trackingNumber")?.trim();
    if (!trackingNumber) {
      return NextResponse.json({ error: "trackingNumber is required." }, { status: 400 });
    }
    const { tryConnectMongo } = await import("@/lib/db/mongoose");
    await tryConnectMongo();
    const { TrackingReference, ShipmentTrackingEvent, ShipmentLot } = await import("@/models");
    const { resolveShipmentViewerSide } = await import("@/lib/shipments/access");
    const refs = await TrackingReference.find({ trackingNumber }).limit(20).lean();
    const results = [];
    for (const ref of refs) {
      const lot = await ShipmentLot.findById(ref.shipmentLotId).lean();
      if (!lot) continue;
      const side = await resolveShipmentViewerSide(auth.ctx.userId, lot);
      if (!side) continue;
      const q: Record<string, unknown> = { shipmentLotId: lot._id };
      if (side === "buyer") q.buyerVisible = true;
      if (side === "supplier") q.supplierVisible = true;
      if (side === "banking") q.$or = [{ buyerVisible: true }, { supplierVisible: true }];
      const events = await ShipmentTrackingEvent.find(q).sort({ eventTimestamp: -1 }).limit(100).lean();
      results.push({
        shipmentLotId: String(lot._id),
        shipmentLotNumber: lot.shipmentLotNumber,
        loadingPort: lot.loadingPort,
        destinationPort: lot.destinationPort,
        status: lot.currentStatus,
        reference: {
          trackingNumber: ref.trackingNumber,
          provider: ref.provider,
          referenceType: ref.referenceType,
          carrier: ref.carrier,
          dataSource: ref.dataSource,
        },
        events: events.map((e) => ({
          id: String(e._id),
          eventType: e.eventType,
          eventTimestamp: e.eventTimestamp,
          location: e.location,
          description: e.description,
          source: e.source,
          confidence: e.confidence === "confirmed" ? "confirmed" : "estimated",
        })),
      });
    }
    return NextResponse.json({
      results,
      note: "Events are manual or carrier-provided; estimated events are not live positions.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
