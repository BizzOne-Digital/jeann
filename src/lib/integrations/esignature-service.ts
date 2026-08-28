import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isFeatureEnabled } from "@/lib/integrations/feature-flags";
import { getESignatureProvider } from "@/lib/integrations/providers/esignature-registry";
import { verifyHmacSignature } from "@/lib/integrations/webhook-security";

const QA_MARKER = "DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER";

export async function createESignatureEnvelope(input: {
  documentVersionId: string;
  transactionId?: string;
  recipients: Array<{ legalName: string; email: string; signingOrder: number; role: string }>;
  actorUserId: string;
}) {
  if (!(await isFeatureEnabled("esignature"))) throw new Error("feature_disabled");

  await tryConnectMongo();
  const { DocumentVersion, ESignatureEnvelope, ESignatureRecipient } = await import("@/models");
  const version = await DocumentVersion.findById(input.documentVersionId);
  if (!version) throw new Error("document_not_found");
  if (version.status !== "approved" && version.status !== "issued") {
    throw new Error("document_not_approved_for_signing");
  }

  const provider = getESignatureProvider();
  const envelopeNumber = `FK-ESIGN-${Date.now()}`;
  const providerResult = await provider.createEnvelope({
    documentVersionId: input.documentVersionId,
    recipients: input.recipients,
  });

  if (!providerResult.ok) throw new Error(providerResult.errorSummary ?? "esignature_failed");

  const envelope = await ESignatureEnvelope.create({
    providerAdapter: provider.adapterCode,
    internalEnvelopeNumber: envelopeNumber,
    providerEnvelopeId: providerResult.providerEnvelopeId,
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    documentVersionId: version._id,
    status: "created",
    createdByUserId: new Types.ObjectId(input.actorUserId),
    qaMarker: provider.adapterCode.includes("mock") ? QA_MARKER : undefined,
  });

  for (const r of input.recipients) {
    await ESignatureRecipient.create({
      envelopeId: envelope._id,
      legalName: r.legalName,
      email: r.email,
      signingOrder: r.signingOrder,
      role: r.role,
      status: "pending",
    });
  }

  await writeAuditEvent({
    action: "esignature.envelope_created",
    targetType: "esignature_envelope",
    targetId: String(envelope._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return envelope;
}

export async function sendESignatureEnvelope(envelopeId: string, actorUserId: string) {
  await tryConnectMongo();
  const { ESignatureEnvelope } = await import("@/models");
  const envelope = await ESignatureEnvelope.findById(envelopeId);
  if (!envelope || !envelope.providerEnvelopeId) throw new Error("not_found");

  const provider = getESignatureProvider();
  const send = await provider.sendEnvelope(envelope.providerEnvelopeId);
  if (!send.ok) throw new Error("send_failed");

  envelope.status = "sent";
  envelope.sentAt = new Date();
  await envelope.save();

  await writeAuditEvent({
    action: "esignature.envelope_sent",
    targetType: "esignature_envelope",
    targetId: String(envelope._id),
    actorUserId,
    result: "success",
  });

  return envelope;
}

export async function processESignatureWebhook(
  payload: string,
  signature: string | undefined,
  correlationId: string,
) {
  const secret = process.env.ESIGNATURE_WEBHOOK_SECRET ?? "";
  const verified = verifyHmacSignature(payload, signature ?? "", secret);

  const { recordWebhookEvent, updateWebhookStatus } = await import(
    "@/lib/integrations/webhook-security"
  );
  const { webhookId, duplicate } = await recordWebhookEvent({
    providerAdapter: "esignature",
    providerEventId: `esign-${hashPayloadSimple(payload)}`,
    eventType: "envelope_event",
    payload,
    signatureVerified: verified,
    correlationId,
  });

  if (!verified) {
    await updateWebhookStatus(webhookId, "rejected", "invalid_signature");
    throw new Error("invalid_signature");
  }

  if (duplicate) {
    await updateWebhookStatus(webhookId, "duplicate");
    return { duplicate: true };
  }

  const provider = getESignatureProvider();
  const parsed = await provider.processWebhook(JSON.parse(payload), signature);
  if (!parsed.ok) {
    await updateWebhookStatus(webhookId, "failed");
    throw new Error("processing_failed");
  }

  await tryConnectMongo();
  const { ESignatureEnvelope } = await import("@/models");
  const envelope = await ESignatureEnvelope.findOne({
    providerEnvelopeId: parsed.providerEnvelopeId,
  });
  if (envelope && parsed.eventType === "completed") {
    envelope.status = "completed";
    envelope.completedAt = new Date();
    envelope.lastProviderEvent = parsed.eventType;
    envelope.finalChecksum = hashPayloadSimple(payload);
    await envelope.save();
  }

  await updateWebhookStatus(webhookId, "processed");
  await writeAuditEvent({
    action: "esignature.webhook_processed",
    targetType: "webhook_event",
    targetId: webhookId,
    result: "success",
  });

  return { duplicate: false, envelopeId: envelope ? String(envelope._id) : undefined };
}

function hashPayloadSimple(payload: string): string {
  let h = 0;
  for (let i = 0; i < payload.length; i++) h = (h * 31 + payload.charCodeAt(i)) >>> 0;
  return String(h);
}
