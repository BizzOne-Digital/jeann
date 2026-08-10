import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITermsAcceptance {
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;
  termsKey: string;
  termsVersion: number;
  acceptedAt: Date;
  ipHash?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export type TermsAcceptanceLean = LeanDoc<ITermsAcceptance>;

const termsAcceptanceSchema = new Schema<ITermsAcceptance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    termsKey: { type: String, required: true, trim: true },
    termsVersion: { type: Number, required: true, min: 1 },
    acceptedAt: { type: Date, required: true, default: () => new Date() },
    ipHash: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

termsAcceptanceSchema.index({ userId: 1, termsKey: 1, termsVersion: 1 });
termsAcceptanceSchema.index({ organizationId: 1, termsKey: 1 });

export const TermsAcceptance =
  models.TermsAcceptance ?? model<ITermsAcceptance>("TermsAcceptance", termsAcceptanceSchema);
