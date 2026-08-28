import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ESignatureEnvelopeStatus =
  | "draft"
  | "created"
  | "sent"
  | "delivered"
  | "completed"
  | "declined"
  | "voided"
  | "expired";

export interface IESignatureEnvelope {
  providerAdapter: string;
  internalEnvelopeNumber: string;
  providerEnvelopeId?: string;
  transactionId?: Types.ObjectId;
  documentVersionId: Types.ObjectId;
  status: ESignatureEnvelopeStatus;
  createdByUserId: Types.ObjectId;
  sentAt?: Date;
  completedAt?: Date;
  declinedAt?: Date;
  expiresAt?: Date;
  signedDocumentKey?: string;
  evidenceDocumentKey?: string;
  finalChecksum?: string;
  lastProviderEvent?: string;
  qaMarker?: string;
}

export type ESignatureEnvelopeLean = LeanDoc<IESignatureEnvelope>;

const eSignatureEnvelopeSchema = new Schema<IESignatureEnvelope>(
  {
    providerAdapter: { type: String, required: true },
    internalEnvelopeNumber: { type: String, required: true, unique: true },
    providerEnvelopeId: { type: String },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    documentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion", required: true },
    status: {
      type: String,
      enum: ["draft", "created", "sent", "delivered", "completed", "declined", "voided", "expired"],
      default: "draft",
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sentAt: { type: Date },
    completedAt: { type: Date },
    declinedAt: { type: Date },
    expiresAt: { type: Date },
    signedDocumentKey: { type: String },
    evidenceDocumentKey: { type: String },
    finalChecksum: { type: String },
    lastProviderEvent: { type: String },
    qaMarker: { type: String },
  },
  { timestamps: true },
);

export const ESignatureEnvelope =
  models.ESignatureEnvelope ??
  model<IESignatureEnvelope>("ESignatureEnvelope", eSignatureEnvelopeSchema);
