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
