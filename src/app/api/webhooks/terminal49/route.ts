import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/config/env";
import { processTerminal49WebhookPayload } from "@/lib/integrations/shipping-tracking-service";
import {
  recordWebhookEvent,
  updateWebhookStatus,
  verifyTerminal49WebhookSignature,
} from "@/lib/integrations/webhook-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const env = getEnv();
    const signature = request.headers.get("x-t49-webhook-signature") ?? "";
    const payload = await request.text();
    const secret = env.TERMINAL49_WEBHOOK_SECRET ?? "";

    const verified = verifyTerminal49WebhookSignature(payload, signature, secret);

    let notificationId = "unknown";
    try {
      const parsed = JSON.parse(payload) as { data?: { id?: string; attributes?: { event?: string } } };
      notificationId = parsed.data?.id ?? notificationId;
    } catch {
      /* raw body retained for signature */
    }

    const { webhookId, duplicate } = await recordWebhookEvent({
      providerAdapter: "terminal49",
      providerEventId: notificationId,
      eventType: "terminal49_notification",
      payload,
      signatureVerified: verified,
      correlationId: notificationId,
    });

    if (!secret) {
      await updateWebhookStatus(webhookId, "rejected", "webhook_secret_not_configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
    }

    if (!verified) {
      await updateWebhookStatus(webhookId, "rejected", "invalid_signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (duplicate) {
      await updateWebhookStatus(webhookId, "duplicate");
      return NextResponse.json({ ok: true, duplicate: true }, { status: 202 });
    }

    const doc = JSON.parse(payload);
    const result = await processTerminal49WebhookPayload(doc);

    await updateWebhookStatus(webhookId, "processed");
    return NextResponse.json(
      {
        ok: true,
        processed: result.processed,
        shipmentLotId: result.shipmentLotId,
        disclaimer: "Carrier events recorded — delivery not auto-confirmed.",
      },
      { status: 202 },
    );
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
