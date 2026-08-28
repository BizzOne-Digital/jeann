import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type OrganizationType = "buyer" | "supplier" | "internal" | "banking_adviser";
export type OrganizationStatus = "pending" | "verified" | "rejected" | "suspended";

export type OrganizationOnboardingStatus =
  | "invited"
  | "email_verification_pending"
  | "phone_verification_pending"
  | "terms_pending"
  | "cis_kyb_draft"
  | "cis_kyb_submitted"
  | "changes_requested"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export interface IOrganization {
  type: OrganizationType;
  legalName: string;
  tradingName?: string;
  normalizedLegalName: string;
  registrationNumber?: string;
  jurisdiction?: string;
  country: string;
  businessAddressLine1?: string;
  businessAddressCity?: string;
  businessAddressRegion?: string;
  businessAddressPostal?: string;
  website?: string;
  domain?: string;
  status: OrganizationStatus;
  onboardingStatus: OrganizationOnboardingStatus;
  verificationNotes?: string;
  mergeReviewFlag: boolean;
  duplicateReviewFlag: boolean;
  createdByUserId?: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
  suspendedAt?: Date;
  suspensionReason?: string;
  deletedAt?: Date;
}

export type OrganizationLean = LeanDoc<IOrganization>;

const organizationSchema = new Schema<IOrganization>(
  {
    type: {
      type: String,
      enum: ["buyer", "supplier", "internal", "banking_adviser"],
      required: true,
    },
    legalName: { type: String, required: true, trim: true },
    tradingName: { type: String, trim: true },
    normalizedLegalName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true },
    jurisdiction: { type: String, trim: true },
    country: { type: String, required: true, uppercase: true, trim: true },
    businessAddressLine1: { type: String, trim: true },
    businessAddressCity: { type: String, trim: true },
    businessAddressRegion: { type: String, trim: true },
    businessAddressPostal: { type: String, trim: true },
    website: { type: String, trim: true },
    domain: { type: String, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "suspended"],
      default: "pending",
    },
    onboardingStatus: {
      type: String,
      enum: [
        "invited",
        "email_verification_pending",
        "phone_verification_pending",
        "terms_pending",
        "cis_kyb_draft",
        "cis_kyb_submitted",
        "changes_requested",
        "under_review",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "email_verification_pending",
    },
    verificationNotes: { type: String },
    mergeReviewFlag: { type: Boolean, default: false },
    duplicateReviewFlag: { type: Boolean, default: false },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    suspendedAt: { type: Date },
    suspensionReason: { type: String },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

organizationSchema.index({ normalizedLegalName: 1, country: 1 });
organizationSchema.index({ type: 1, status: 1, deletedAt: 1 });
organizationSchema.index({ registrationNumber: 1, jurisdiction: 1 }, { sparse: true });

export const Organization =
  models.Organization ?? model<IOrganization>("Organization", organizationSchema);
