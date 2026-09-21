import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/config/env";
import { getShippingTrackingProviderByAdapter } from "@/lib/integrations/providers/shipping-tracking-registry";
import { recordTrackingEvent } from "@/lib/shipments/tracking-service";
import { recordWebhookEvent, updateWebhookStatus } from "@/lib/integrations/webhook-security";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const env = getEnv();
    const secret = env.EASYPOST_WEBHOOK_SECRET ?? "";

    let eventId = `easypost-${Date.now()}`;
    let parsed: { id?: string; description?: string; result?: { id?: string; tracking_code?: string } };
    try {
      parsed = JSON.parse(payload);
      eventId = parsed.id ?? eventId;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const verified = Boolean(secret);
    const { webhookId, duplicate } = await recordWebhookEvent({
      providerAdapter: "easypost",
      providerEventId: eventId,
      eventType: parsed.description ?? "easypost_event",
      payload,
      signatureVerified: verified,
      correlationId: eventId,
    });

    if (!secret) {
      await updateWebhookStatus(webhookId, "rejected", "webhook_secret_not_configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
    }

    if (duplicate) {
      await updateWebhookStatus(webhookId, "duplicate");
      return NextResponse.json({ ok: true, duplicate: true }, { status: 202 });
    }

    const provider = getShippingTrackingProviderByAdapter("easypost");
    const events = await provider.processWebhook(parsed);
    const trackingCode = parsed.result?.tracking_code;

    await tryConnectMongo();
    const { TrackingReference } = await import("@/models");
    const ref = trackingCode
      ? await TrackingReference.findOne({ provider: "easypost", trackingNumber: trackingCode, active: true })
      : null;

    let processed = 0;
    if (ref) {
      for (const evt of events) {
        await recordTrackingEvent({
          shipmentLotId: String(ref.shipmentLotId),
          trackingReferenceId: String(ref._id),
          eventType: evt.eventType,
          eventTimestamp: evt.eventTimestamp.toISOString(),
          location: evt.location,
          description: evt.description ?? evt.eventType,
          source: evt.source,
          sourceReference: evt.sourceReference,
          confidence: evt.confirmedStatus ? "confirmed" : "estimated",
          rawProviderStatus: evt.rawProviderStatus,
          buyerVisible: true,
          supplierVisible: true,
        });
        processed += 1;
      }
      await TrackingReference.updateOne(
        { _id: ref._id },
        {
          $set: {
            lastSynchronizedAt: new Date(),
            ...(parsed.result?.id ? { "providerResourceIds.trackerId": parsed.result.id } : {}),
          },
        },
      );
    }

    await updateWebhookStatus(webhookId, "processed");
    return NextResponse.json({ ok: true, processed }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
