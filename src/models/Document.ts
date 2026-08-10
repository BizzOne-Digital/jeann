import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DocumentSensitivity = "public" | "internal" | "confidential" | "restricted";
export type DocumentRetentionState = "active" | "archived" | "pending_deletion";

export interface IDocument {
  organizationId: Types.ObjectId;
  transactionId?: Types.ObjectId;
  stepKey?: string;
  category: string;
  title: string;
  sensitivity: DocumentSensitivity;
  retentionState: DocumentRetentionState;
  currentVersionId?: Types.ObjectId;
  deletedAt?: Date;
}

export type DocumentLean = LeanDoc<IDocument>;

const documentSchema = new Schema<IDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    stepKey: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    sensitivity: {
      type: String,
      enum: ["public", "internal", "confidential", "restricted"],
      default: "internal",
    },
    retentionState: {
      type: String,
      enum: ["active", "archived", "pending_deletion"],
      default: "active",
    },
    currentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion" },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

documentSchema.index({ organizationId: 1, transactionId: 1, category: 1 });
documentSchema.index({ transactionId: 1, stepKey: 1 });
documentSchema.index({ retentionState: 1, deletedAt: 1 });

export const Document = models.Document ?? model<IDocument>("Document", documentSchema);
