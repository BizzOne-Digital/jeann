import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITermsDocument {
  key: string;
  version: number;
  locale: string;
  title: string;
  body: string;
  effectiveAt: Date;
  publishedAt?: Date;
  requiresAcceptance: boolean;
}

export type TermsDocumentLean = LeanDoc<ITermsDocument>;

const termsDocumentSchema = new Schema<ITermsDocument>(
  {
    key: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 1 },
    locale: { type: String, required: true, default: "en", trim: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    effectiveAt: { type: Date, required: true },
    publishedAt: { type: Date },
    requiresAcceptance: { type: Boolean, default: true },
  },
  { timestamps: true },
);

termsDocumentSchema.index({ key: 1, version: 1, locale: 1 }, { unique: true });
termsDocumentSchema.index({ key: 1, locale: 1, publishedAt: -1 });

export const TermsDocument =
  models.TermsDocument ?? model<ITermsDocument>("TermsDocument", termsDocumentSchema);
