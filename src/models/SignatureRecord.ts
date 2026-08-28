import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type SignatureMethod =
  | "e_signature_provider"
  | "controlled_upload"
  | "admin_recorded_external";

export type SignatureStatus = "pending" | "completed" | "rejected" | "superseded";

export interface ISignatureRecord {
  documentId: Types.ObjectId;
  documentVersionId: Types.ObjectId;
  transactionId: Types.ObjectId;
  signatoryUserId?: Types.ObjectId;
  signatoryOrganizationId?: Types.ObjectId;
  signatoryName: string;
  signatoryTitle?: string;
  signatureMethod: SignatureMethod;
  providerReference?: string;
  signedFileChecksum?: string;
  signedStorageKey?: string;
  signedAt?: Date;
  evidenceIpHash?: string;
  evidenceUserAgent?: string;
  status: SignatureStatus;
}

export type SignatureRecordLean = LeanDoc<ISignatureRecord>;

const signatureRecordSchema = new Schema<ISignatureRecord>(
  {
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    documentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    signatoryUserId: { type: Schema.Types.ObjectId, ref: "User" },
    signatoryOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    signatoryName: { type: String, required: true, trim: true },
    signatoryTitle: { type: String, trim: true },
    signatureMethod: {
      type: String,
      enum: ["e_signature_provider", "controlled_upload", "admin_recorded_external"],
      required: true,
    },
    providerReference: { type: String },
    signedFileChecksum: { type: String },
    signedStorageKey: { type: String },
    signedAt: { type: Date },
    evidenceIpHash: { type: String },
    evidenceUserAgent: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected", "superseded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

signatureRecordSchema.index({ documentVersionId: 1 });
signatureRecordSchema.index({ transactionId: 1, status: 1 });

export const SignatureRecord =
  models.SignatureRecord ?? model<ISignatureRecord>("SignatureRecord", signatureRecordSchema);
