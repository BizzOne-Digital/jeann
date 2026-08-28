import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type IntegrationJobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "retry_scheduled"
  | "dead_letter"
  | "cancelled";

export interface IIntegrationJob {
  providerAdapter: string;
  jobType: string;
  internalEntityType: string;
  internalEntityId: string;
  idempotencyKey: string;
  attemptCount: number;
  maxAttempts: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: IntegrationJobStatus;
  errorCode?: string;
  errorSummary?: string;
  correlationId: string;
}

export type IntegrationJobLean = LeanDoc<IIntegrationJob>;

const integrationJobSchema = new Schema<IIntegrationJob>(
  {
    providerAdapter: { type: String, required: true },
    jobType: { type: String, required: true },
    internalEntityType: { type: String, required: true },
    internalEntityId: { type: String, required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "running", "succeeded", "failed", "retry_scheduled", "dead_letter", "cancelled"],
      default: "pending",
    },
    errorCode: { type: String },
    errorSummary: { type: String },
    correlationId: { type: String, required: true },
  },
  { timestamps: true },
);

integrationJobSchema.index({ status: 1, scheduledAt: 1 });

export const IntegrationJob =
  models.IntegrationJob ?? model<IIntegrationJob>("IntegrationJob", integrationJobSchema);
