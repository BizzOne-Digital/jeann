import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IAccessReview {
  reviewPeriodLabel: string;
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;
  currentRoles: string[];
  currentPermissions: string[];
  transactionAssignmentCount?: number;
  reviewerUserId?: Types.ObjectId;
  decision?: string;
  changesRequired?: string;
  completedAt?: Date;
}

export type AccessReviewLean = LeanDoc<IAccessReview>;

const accessReviewSchema = new Schema<IAccessReview>(
  {
    reviewPeriodLabel: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    currentRoles: [{ type: String }],
    currentPermissions: [{ type: String }],
    transactionAssignmentCount: { type: Number },
    reviewerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    decision: { type: String },
    changesRequired: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

accessReviewSchema.index({ reviewPeriodLabel: 1, userId: 1 });

export const AccessReview =
  models.AccessReview ?? model<IAccessReview>("AccessReview", accessReviewSchema);
