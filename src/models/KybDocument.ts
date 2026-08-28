import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type KybDocumentReviewStatus = "pending" | "approved" | "rejected" | "changes_requested";

export const KYB_DOCUMENT_TYPES = [
  "certificate_of_incorporation",
  "business_registration",
  "proof_of_address",
  "tax_registration",
  "authorized_signatory",
  "other",
] as const;

export type KybDocumentType = (typeof KYB_DOCUMENT_TYPES)[number];

export interface IKybDocument {
  organizationId: Types.ObjectId;
  cisProfileId: Types.ObjectId;
  cisVersion: number;
  documentType: KybDocumentType;
  storageKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  uploadedBy: Types.ObjectId;
  reviewStatus: KybDocumentReviewStatus;
  reviewerComments?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  deletedAt?: Date;
}

export type KybDocumentLean = LeanDoc<IKybDocument>;

const kybDocumentSchema = new Schema<IKybDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    cisProfileId: { type: Schema.Types.ObjectId, ref: "CisProfile", required: true },
    cisVersion: { type: Number, required: true, min: 1 },
    documentType: { type: String, enum: KYB_DOCUMENT_TYPES, required: true },
    storageKey: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true, min: 0 },
    checksum: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "changes_requested"],
      default: "pending",
    },
    reviewerComments: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

kybDocumentSchema.index({ organizationId: 1, cisVersion: 1, deletedAt: 1 });
kybDocumentSchema.index({ cisProfileId: 1, createdAt: -1 });

export const KybDocument =
  models.KybDocument ?? model<IKybDocument>("KybDocument", kybDocumentSchema);
