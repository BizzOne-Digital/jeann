import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ScreeningMatchReviewStatus =
  | "pending"
  | "false_positive"
  | "confirmed"
  | "further_review";

export interface IScreeningMatch {
  screeningCaseId: Types.ObjectId;
  providerMatchId: string;
  matchType: string;
  matchedName: string;
  matchScore?: Types.Decimal128;
  country?: string;
  sourceListRef?: string;
  reviewStatus: ScreeningMatchReviewStatus;
  reviewedByUserId?: Types.ObjectId;
  resolutionReason?: string;
}

export type ScreeningMatchLean = LeanDoc<IScreeningMatch>;

const screeningMatchSchema = new Schema<IScreeningMatch>(
  {
    screeningCaseId: { type: Schema.Types.ObjectId, ref: "ScreeningCase", required: true },
    providerMatchId: { type: String, required: true },
    matchType: { type: String, required: true },
    matchedName: { type: String, required: true },
    matchScore: { type: Schema.Types.Decimal128 },
    country: { type: String },
    sourceListRef: { type: String },
    reviewStatus: {
      type: String,
      enum: ["pending", "false_positive", "confirmed", "further_review"],
      default: "pending",
    },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    resolutionReason: { type: String },
  },
  { timestamps: true },
);

screeningMatchSchema.index({ screeningCaseId: 1 });

export const ScreeningMatch =
  models.ScreeningMatch ?? model<IScreeningMatch>("ScreeningMatch", screeningMatchSchema);
