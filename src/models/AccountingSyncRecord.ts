import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type AccountingSyncStatus =
  | "not_configured"
  | "pending"
  | "success"
  | "failed"
  | "conflict";

export interface IAccountingSyncRecord {
  provider: string;
  entityType: string;
  internalEntityId: string;
  externalEntityId?: string;
  syncDirection: "push" | "pull";
  requestReference?: string;
  status: AccountingSyncStatus;
  lastAttemptAt?: Date;
  lastSuccessAt?: Date;
  errorSummary?: string;
  idempotencyKey: string;
  payloadChecksum?: string;
}

export type AccountingSyncRecordLean = LeanDoc<IAccountingSyncRecord>;

const accountingSyncRecordSchema = new Schema<IAccountingSyncRecord>(
  {
    provider: { type: String, required: true },
    entityType: { type: String, required: true },
    internalEntityId: { type: String, required: true },
    externalEntityId: { type: String },
    syncDirection: { type: String, enum: ["push", "pull"], default: "push" },
    requestReference: { type: String },
    status: {
      type: String,
      enum: ["not_configured", "pending", "success", "failed", "conflict"],
      default: "not_configured",
    },
    lastAttemptAt: { type: Date },
    lastSuccessAt: { type: Date },
    errorSummary: { type: String },
    idempotencyKey: { type: String, required: true, unique: true },
    payloadChecksum: { type: String },
  },
  { timestamps: true },
);

accountingSyncRecordSchema.index({ internalEntityId: 1, entityType: 1 });

export const AccountingSyncRecord =
  models.AccountingSyncRecord ??
  model<IAccountingSyncRecord>("AccountingSyncRecord", accountingSyncRecordSchema);
