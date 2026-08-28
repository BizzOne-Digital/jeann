import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getEnv } from "@/lib/config/env";
import {
  recordWebhookEvent,
  updateWebhookStatus,
  verifyHmacSignature,
} from "@/lib/integrations/webhook-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const env = getEnv();
    const signature = request.headers.get("x-shipping-signature") ?? "";
    const payload = await request.text();
    const correlationId = request.headers.get("x-correlation-id") ?? nanoid();
    const secret = env.SHIPMENT_WEBHOOK_SECRET ?? "";

    const verified = verifyHmacSignature(payload, signature, secret);
    const { webhookId, duplicate } = await recordWebhookEvent({
      providerAdapter: "shipping_tracking",
      providerEventId: `ship-${correlationId}`,
      eventType: "tracking_event",
      payload,
      signatureVerified: verified,
      correlationId,
    });

    if (!verified) {
      await updateWebhookStatus(webhookId, "rejected", "invalid_signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (duplicate) {
      await updateWebhookStatus(webhookId, "duplicate");
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await updateWebhookStatus(webhookId, "processed");
    return NextResponse.json({ ok: true, disclaimer: "Event recorded — delivery not auto-confirmed." });
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
