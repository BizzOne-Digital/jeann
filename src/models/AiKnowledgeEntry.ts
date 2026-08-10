import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type AiKnowledgeSourceType = "manual" | "faq" | "product" | "policy" | "page";

export interface IAiKnowledgeEntry {
  title: string;
  content: string;
  tags: string[];
  sourceType: AiKnowledgeSourceType;
  published: boolean;
  locale: string;
}

export type AiKnowledgeEntryLean = LeanDoc<IAiKnowledgeEntry>;

const aiKnowledgeEntrySchema = new Schema<IAiKnowledgeEntry>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    sourceType: {
      type: String,
      enum: ["manual", "faq", "product", "policy", "page"],
      default: "manual",
    },
    published: { type: Boolean, default: false },
    locale: { type: String, required: true, default: "en", trim: true },
  },
  { timestamps: true },
);

aiKnowledgeEntrySchema.index({ published: 1, locale: 1 });
aiKnowledgeEntrySchema.index({ tags: 1, published: 1 });

export const AiKnowledgeEntry =
  models.AiKnowledgeEntry ?? model<IAiKnowledgeEntry>("AiKnowledgeEntry", aiKnowledgeEntrySchema);
