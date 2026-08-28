import { createHash, timingSafeEqual } from "crypto";
import { tryConnectMongo } from "@/lib/db/mongoose";
import type { WebhookProcessingStatus } from "@/models/WebhookEvent";

export function hashPayload(payload: string): string {
  return createHash("sha256").update(payload).digest("hex");
}

export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  if (!secret || !signature) return false;
  const expected = createHash("sha256").update(`${secret}:${payload}`).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature.replace(/^sha256=/, ""), "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function recordWebhookEvent(input: {
  providerAdapter: string;
  providerEventId: string;
  eventType: string;
  payload: string;
  signatureVerified: boolean;
  correlationId: string;
}): Promise<{ duplicate: boolean; webhookId: string }> {
  await tryConnectMongo();
  const { WebhookEvent } = await import("@/models");
  const payloadHash = hashPayload(input.payload);

  const existing = await WebhookEvent.findOne({
    providerAdapter: input.providerAdapter,
    providerEventId: input.providerEventId,
  }).lean();

  if (existing) {
    return { duplicate: true, webhookId: String(existing._id) };
  }

  const event = await WebhookEvent.create({
    providerAdapter: input.providerAdapter,
    providerEventId: input.providerEventId,
    eventType: input.eventType,
    signatureVerified: input.signatureVerified,
    processingStatus: input.signatureVerified ? "verified" : "rejected",
    payloadHash,
    correlationId: input.correlationId,
    attemptCount: 1,
  });

  const { writeAuditEvent } = await import("@/lib/audit/log");
  await writeAuditEvent({
    action: "webhook.received",
    targetType: "webhook_event",
    targetId: String(event._id),
    result: input.signatureVerified ? "success" : "failure",
    metadata: {
      provider: input.providerAdapter,
      eventType: input.eventType,
      verified: input.signatureVerified,
    },
  });

  return { duplicate: false, webhookId: String(event._id) };
}

export async function updateWebhookStatus(
  webhookId: string,
  status: WebhookProcessingStatus,
  errorSummary?: string,
): Promise<void> {
  await tryConnectMongo();
  const { WebhookEvent } = await import("@/models");
  await WebhookEvent.findByIdAndUpdate(webhookId, {
    processingStatus: status,
    errorSummary,
  });
}
