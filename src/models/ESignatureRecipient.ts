import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ESignatureRecipientStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "signed"
  | "declined"
  | "completed";

export interface IESignatureRecipient {
  envelopeId: Types.ObjectId;
  userId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  legalName: string;
  email: string;
  signingOrder: number;
  role: string;
  authenticationMethod?: string;
  status: ESignatureRecipientStatus;
  signedAt?: Date;
  providerRecipientId?: string;
}

export type ESignatureRecipientLean = LeanDoc<IESignatureRecipient>;

const eSignatureRecipientSchema = new Schema<IESignatureRecipient>(
  {
    envelopeId: { type: Schema.Types.ObjectId, ref: "ESignatureEnvelope", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    legalName: { type: String, required: true },
    email: { type: String, required: true },
    signingOrder: { type: Number, default: 1 },
    role: { type: String, default: "signer" },
    authenticationMethod: { type: String },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "signed", "declined", "completed"],
      default: "pending",
    },
    signedAt: { type: Date },
    providerRecipientId: { type: String },
  },
  { timestamps: true },
);

eSignatureRecipientSchema.index({ envelopeId: 1, signingOrder: 1 });

export const ESignatureRecipient =
  models.ESignatureRecipient ??
  model<IESignatureRecipient>("ESignatureRecipient", eSignatureRecipientSchema);
