import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface INewsletterSubscriber {
  email: string;
  consentAt: Date;
  source: string;
  confirmTokenHash?: string;
  confirmedAt?: Date;
  unsubscribeTokenHash: string;
  suppressedAt?: Date;
}

export type NewsletterSubscriberLean = LeanDoc<INewsletterSubscriber>;

const newsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    consentAt: { type: Date, required: true, default: () => new Date() },
    source: { type: String, required: true, trim: true },
    confirmTokenHash: { type: String, select: false },
    confirmedAt: { type: Date },
    unsubscribeTokenHash: { type: String, required: true, select: false },
    suppressedAt: { type: Date },
  },
  { timestamps: true },
);

newsletterSubscriberSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { suppressedAt: null } },
);
newsletterSubscriberSchema.index({ confirmedAt: 1, suppressedAt: 1 });

export const NewsletterSubscriber =
  models.NewsletterSubscriber ??
  model<INewsletterSubscriber>("NewsletterSubscriber", newsletterSubscriberSchema);
