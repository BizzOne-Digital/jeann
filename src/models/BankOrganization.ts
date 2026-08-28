import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankVerificationStatus =
  | "unverified"
  | "information_provided"
  | "under_review"
  | "evidence_reviewed"
  | "confirmed_by_authorized_human"
  | "rejected"
  | "archived";

export interface IBankOrganization {
  bankId: string;
  legalName: string;
  country: string;
  address?: string;
  swiftBic?: string;
  branch?: string;
  contactEmail?: string;
  contactPhone?: string;
  verificationStatus: BankVerificationStatus;
  verificationSource?: string;
  notes?: string;
  createdByUserId?: Types.ObjectId;
}

export type BankOrganizationLean = LeanDoc<IBankOrganization>;

const bankOrganizationSchema = new Schema<IBankOrganization>(
  {
    bankId: { type: String, required: true, trim: true },
    legalName: { type: String, required: true, trim: true },
    country: { type: String, required: true, uppercase: true, trim: true },
    address: { type: String },
    swiftBic: { type: String, uppercase: true, trim: true },
    branch: { type: String },
    contactEmail: { type: String, lowercase: true },
    contactPhone: { type: String },
    verificationStatus: {
      type: String,
      enum: [
        "unverified",
        "information_provided",
        "under_review",
        "evidence_reviewed",
        "confirmed_by_authorized_human",
        "rejected",
        "archived",
      ],
      default: "unverified",
    },
    verificationSource: { type: String },
    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

bankOrganizationSchema.index({ bankId: 1 }, { unique: true });
bankOrganizationSchema.index({ legalName: 1 });

export const BankOrganization =
  models.BankOrganization ?? model<IBankOrganization>("BankOrganization", bankOrganizationSchema);
