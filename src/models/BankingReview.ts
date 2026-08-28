import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingReviewType =
  | "commercial_consistency"
  | "contract_consistency"
  | "documentary_requirement"
  | "banking_adviser_review"
  | "internal_final_review";

export type BankingReviewDecision =
  | "approved"
  | "approved_with_warnings"
  | "changes_requested"
  | "rejected"
  | "recommendation_only";

export interface IBankingReview {
  bankingInstrumentId: Types.ObjectId;
  wordingVersionId?: Types.ObjectId;
  reviewerUserId: Types.ObjectId;
  reviewerRole: string;
  reviewType: BankingReviewType;
  decision: BankingReviewDecision;
  comments?: string;
  findings?: string[];
  reviewedAt: Date;
  isRecommendationOnly: boolean;
}

export type BankingReviewLean = LeanDoc<IBankingReview>;

const bankingReviewSchema = new Schema<IBankingReview>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    wordingVersionId: { type: Schema.Types.ObjectId, ref: "InstrumentWordingVersion" },
    reviewerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewerRole: { type: String, required: true },
    reviewType: {
      type: String,
      enum: [
        "commercial_consistency",
        "contract_consistency",
        "documentary_requirement",
        "banking_adviser_review",
        "internal_final_review",
      ],
      required: true,
    },
    decision: {
      type: String,
      enum: [
        "approved",
        "approved_with_warnings",
        "changes_requested",
        "rejected",
        "recommendation_only",
      ],
      required: true,
    },
    comments: { type: String },
    findings: [{ type: String }],
    reviewedAt: { type: Date, required: true, default: () => new Date() },
    isRecommendationOnly: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bankingReviewSchema.index({ bankingInstrumentId: 1, reviewedAt: -1 });

export const BankingReview =
  models.BankingReview ?? model<IBankingReview>("BankingReview", bankingReviewSchema);
