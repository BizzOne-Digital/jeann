import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IRetentionPolicy {
  dataCategory: string;
  organizationScope?: string;
  retentionDays: number;
  triggerEvent: string;
  archiveBehavior?: string;
  deletionBehavior?: string;
  legalReviewRequired: boolean;
  version: number;
  approvedByUserId?: Types.ObjectId;
  effectiveFrom: Date;
  active: boolean;
}

export type RetentionPolicyLean = LeanDoc<IRetentionPolicy>;

const retentionPolicySchema = new Schema<IRetentionPolicy>(
  {
    dataCategory: { type: String, required: true },
    organizationScope: { type: String },
    retentionDays: { type: Number, required: true },
    triggerEvent: { type: String, required: true },
    archiveBehavior: { type: String },
    deletionBehavior: { type: String },
    legalReviewRequired: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    effectiveFrom: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

retentionPolicySchema.index({ dataCategory: 1, version: -1 });

export const RetentionPolicy =
  models.RetentionPolicy ?? model<IRetentionPolicy>("RetentionPolicy", retentionPolicySchema);

export const DEFAULT_RETENTION_POLICIES = [
  { dataCategory: "audit_logs", retentionDays: 2555, triggerEvent: "created", legalReviewRequired: true },
  { dataCategory: "signed_contracts", retentionDays: 3650, triggerEvent: "signed", legalReviewRequired: true },
  { dataCategory: "financial_records", retentionDays: 2555, triggerEvent: "posted", legalReviewRequired: true },
  { dataCategory: "cis_kyb", retentionDays: 1825, triggerEvent: "submitted", legalReviewRequired: true },
  { dataCategory: "temporary_uploads", retentionDays: 30, triggerEvent: "uploaded", legalReviewRequired: false },
  { dataCategory: "security_incidents", retentionDays: 2555, triggerEvent: "created", legalReviewRequired: true },
];
