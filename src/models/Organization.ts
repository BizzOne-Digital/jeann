import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type OrganizationType = "buyer" | "supplier" | "internal";
export type OrganizationStatus = "pending" | "verified" | "rejected" | "suspended";

export interface IOrganization {
  type: OrganizationType;
  legalName: string;
  normalizedLegalName: string;
  registrationNumber?: string;
  country: string;
  domain?: string;
  status: OrganizationStatus;
  verificationNotes?: string;
  mergeReviewFlag: boolean;
  deletedAt?: Date;
}

export type OrganizationLean = LeanDoc<IOrganization>;

const organizationSchema = new Schema<IOrganization>(
  {
    type: {
      type: String,
      enum: ["buyer", "supplier", "internal"],
      required: true,
    },
    legalName: { type: String, required: true, trim: true },
    normalizedLegalName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true },
    country: { type: String, required: true, uppercase: true, trim: true },
    domain: { type: String, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "suspended"],
      default: "pending",
    },
    verificationNotes: { type: String },
    mergeReviewFlag: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

organizationSchema.index({ normalizedLegalName: 1, country: 1 });
organizationSchema.index({ type: 1, status: 1, deletedAt: 1 });
organizationSchema.index({ domain: 1 }, { sparse: true });

export const Organization =
  models.Organization ?? model<IOrganization>("Organization", organizationSchema);
