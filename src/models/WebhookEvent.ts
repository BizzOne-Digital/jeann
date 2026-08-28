import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type WebhookProcessingStatus =
  | "received"
  | "verified"
  | "processed"
  | "duplicate"
  | "failed"
  | "rejected";

export interface IWebhookEvent {
  providerAdapter: string;
  providerEventId: string;
  eventType: string;
  receivedAt: Date;
  signatureVerified: boolean;
  processingStatus: WebhookProcessingStatus;
  internalEntityType?: string;
  internalEntityId?: string;
  idempotencyResult?: string;
  attemptCount: number;
  payloadHash: string;
  errorSummary?: string;
  correlationId: string;
}

export type WebhookEventLean = LeanDoc<IWebhookEvent>;

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    providerAdapter: { type: String, required: true },
    providerEventId: { type: String, required: true },
    eventType: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now },
    signatureVerified: { type: Boolean, default: false },
    processingStatus: {
      type: String,
      enum: ["received", "verified", "processed", "duplicate", "failed", "rejected"],
      default: "received",
    },
    internalEntityType: { type: String },
    internalEntityId: { type: String },
    idempotencyResult: { type: String },
    attemptCount: { type: Number, default: 0 },
    payloadHash: { type: String, required: true },
    errorSummary: { type: String },
    correlationId: { type: String, required: true },
  },
  { timestamps: true },
);

webhookEventSchema.index({ providerAdapter: 1, providerEventId: 1 }, { unique: true });

export const WebhookEvent =
  models.WebhookEvent ?? model<IWebhookEvent>("WebhookEvent", webhookEventSchema);
