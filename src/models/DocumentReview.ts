import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DocumentReviewDecision = "approved" | "rejected" | "changes_requested";

export interface IDocumentReview {
  documentVersionId: Types.ObjectId;
  reviewerUserId: Types.ObjectId;
  decision: DocumentReviewDecision;
  reason?: string;
}

export type DocumentReviewLean = LeanDoc<IDocumentReview>;

const documentReviewSchema = new Schema<IDocumentReview>(
  {
    documentVersionId: {
      type: Schema.Types.ObjectId,
      ref: "DocumentVersion",
      required: true,
    },
    reviewerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    decision: {
      type: String,
      enum: ["approved", "rejected", "changes_requested"],
      required: true,
    },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

documentReviewSchema.index({ documentVersionId: 1, createdAt: -1 });
documentReviewSchema.index({ reviewerUserId: 1, createdAt: -1 });

export const DocumentReview =
  models.DocumentReview ?? model<IDocumentReview>("DocumentReview", documentReviewSchema);
