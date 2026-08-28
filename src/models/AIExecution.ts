import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type AIHumanReviewStatus =
  | "pending_review"
  | "accepted"
  | "rejected"
  | "partially_accepted"
  | "expired";

export type AIDataClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted"
  | "highly_sensitive";

export interface IAIExecution {
  providerAdapter: string;
  model: string;
  capability: string;
  promptTemplateVersion?: string;
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;
  transactionId?: Types.ObjectId;
  documentId?: Types.ObjectId;
  documentVersionId?: Types.ObjectId;
  inputHashes?: string[];
  dataClassification: AIDataClassification;
  outputText?: string;
  structuredOutput?: Record<string, unknown>;
  confidence?: Types.Decimal128;
  warnings?: string[];
  humanReviewStatus: AIHumanReviewStatus;
  reviewedByUserId?: Types.ObjectId;
  reviewDecision?: string;
  reviewNotes?: string;
  retentionUntil?: Date;
  usageRecordId?: Types.ObjectId;
  qaMarker?: string;
}

export type AIExecutionLean = LeanDoc<IAIExecution>;

const aiExecutionSchema = new Schema<IAIExecution>(
  {
    providerAdapter: { type: String, required: true },
    model: { type: String, required: true },
    capability: { type: String, required: true },
    promptTemplateVersion: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    documentId: { type: Schema.Types.ObjectId, ref: "Document" },
    documentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion" },
    inputHashes: [{ type: String }],
    dataClassification: {
      type: String,
      enum: ["public", "internal", "confidential", "restricted", "highly_sensitive"],
      default: "internal",
    },
    outputText: { type: String },
    structuredOutput: { type: Schema.Types.Mixed },
    confidence: { type: Schema.Types.Decimal128 },
    warnings: [{ type: String }],
    humanReviewStatus: {
      type: String,
      enum: ["pending_review", "accepted", "rejected", "partially_accepted", "expired"],
      default: "pending_review",
    },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewDecision: { type: String },
    reviewNotes: { type: String },
    retentionUntil: { type: Date },
    usageRecordId: { type: Schema.Types.ObjectId, ref: "ProviderUsageRecord" },
    qaMarker: { type: String },
  },
  { timestamps: true },
);

aiExecutionSchema.index({ userId: 1, createdAt: -1 });
aiExecutionSchema.index({ humanReviewStatus: 1 });

export const AIExecution =
  models.AIExecution ?? model<IAIExecution>("AIExecution", aiExecutionSchema);
