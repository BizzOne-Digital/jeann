import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ReleaseStatus = "draft" | "testing" | "approved" | "deployed" | "rolled_back";

export interface IReleaseRecord {
  version: string;
  commitReference?: string;
  environment: string;
  migrationVersion?: string;
  testResultsSummary?: string;
  securityReviewStatus: string;
  uatStatus: string;
  approvedByUserId?: Types.ObjectId;
  deployedAt?: Date;
  rollbackReference?: string;
  status: ReleaseStatus;
  notes?: string;
}

export type ReleaseRecordLean = LeanDoc<IReleaseRecord>;

const releaseRecordSchema = new Schema<IReleaseRecord>(
  {
    version: { type: String, required: true },
    commitReference: { type: String },
    environment: { type: String, required: true },
    migrationVersion: { type: String },
    testResultsSummary: { type: String },
    securityReviewStatus: { type: String, default: "pending" },
    uatStatus: { type: String, default: "pending" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    deployedAt: { type: Date },
    rollbackReference: { type: String },
    status: {
      type: String,
      enum: ["draft", "testing", "approved", "deployed", "rolled_back"],
      default: "draft",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

releaseRecordSchema.index({ environment: 1, version: -1 });

export const ReleaseRecord =
  models.ReleaseRecord ?? model<IReleaseRecord>("ReleaseRecord", releaseRecordSchema);
