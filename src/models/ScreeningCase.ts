import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ScreeningCaseStatus =
  | "draft"
  | "submitted"
  | "pending_review"
  | "under_review"
  | "cleared"
  | "match_found"
  | "escalated"
  | "closed";

export type ScreeningType = "company" | "sanctions" | "pep" | "adverse_media" | "ongoing";

export interface IScreeningCase {
  organizationId?: Types.ObjectId;
  subjectUserId?: Types.ObjectId;
  providerAdapter: string;
  screeningType: ScreeningType;
  providerRequestRef?: string;
  status: ScreeningCaseStatus;
  matchCount: number;
  riskLevel?: string;
  submittedByUserId: Types.ObjectId;
  reviewedByUserId?: Types.ObjectId;
  reviewDecision?: string;
  reviewNotes?: string;
  qaMarker?: string;
}

export type ScreeningCaseLean = LeanDoc<IScreeningCase>;

const screeningCaseSchema = new Schema<IScreeningCase>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    subjectUserId: { type: Schema.Types.ObjectId, ref: "User" },
    providerAdapter: { type: String, required: true },
    screeningType: {
      type: String,
      enum: ["company", "sanctions", "pep", "adverse_media", "ongoing"],
      required: true,
    },
    providerRequestRef: { type: String },
    status: {
      type: String,
      enum: ["draft", "submitted", "pending_review", "under_review", "cleared", "match_found", "escalated", "closed"],
      default: "draft",
    },
    matchCount: { type: Number, default: 0 },
    riskLevel: { type: String },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewDecision: { type: String },
    reviewNotes: { type: String },
    qaMarker: { type: String },
  },
  { timestamps: true },
);

screeningCaseSchema.index({ organizationId: 1, status: 1 });

export const ScreeningCase =
  models.ScreeningCase ?? model<IScreeningCase>("ScreeningCase", screeningCaseSchema);
