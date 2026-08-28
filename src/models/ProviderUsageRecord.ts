import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IProviderUsageRecord {
  providerAdapter: string;
  capability: string;
  userId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  transactionId?: Types.ObjectId;
  documentId?: Types.ObjectId;
  requestAt: Date;
  modelOrEndpoint?: string;
  inputSize?: number;
  outputSize?: number;
  tokenUsage?: number;
  estimatedCostUsd?: Types.Decimal128;
  status: string;
  correlationId: string;
}

export type ProviderUsageRecordLean = LeanDoc<IProviderUsageRecord>;

const providerUsageRecordSchema = new Schema<IProviderUsageRecord>(
  {
    providerAdapter: { type: String, required: true },
    capability: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    documentId: { type: Schema.Types.ObjectId, ref: "Document" },
    requestAt: { type: Date, default: Date.now },
    modelOrEndpoint: { type: String },
    inputSize: { type: Number },
    outputSize: { type: Number },
    tokenUsage: { type: Number },
    estimatedCostUsd: { type: Schema.Types.Decimal128 },
    status: { type: String, required: true },
    correlationId: { type: String, required: true },
  },
  { timestamps: true },
);

providerUsageRecordSchema.index({ providerAdapter: 1, requestAt: -1 });
providerUsageRecordSchema.index({ userId: 1, requestAt: -1 });

export const ProviderUsageRecord =
  models.ProviderUsageRecord ??
  model<IProviderUsageRecord>("ProviderUsageRecord", providerUsageRecordSchema);
