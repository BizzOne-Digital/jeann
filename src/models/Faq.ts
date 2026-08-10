import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type FaqStatus = "published" | "unpublished";

export interface IFaq {
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  status: FaqStatus;
}

export type FaqLean = LeanDoc<IFaq>;

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  { timestamps: true },
);

faqSchema.index({ status: 1, category: 1, displayOrder: 1 });

export const Faq = models.Faq ?? model<IFaq>("Faq", faqSchema);
