import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";
import type { TransactionSide } from "./Transaction";

export type DocumentTemplateStatus = "draft" | "published" | "archived";

export interface DocumentTemplateBlock {
  type: string;
  content: string;
  order: number;
}

export interface IDocumentTemplate {
  key: string;
  name: string;
  version: number;
  side: TransactionSide;
  bodyBlocks: DocumentTemplateBlock[];
  status: DocumentTemplateStatus;
}

export type DocumentTemplateLean = LeanDoc<IDocumentTemplate>;

const bodyBlockSchema = new Schema<DocumentTemplateBlock>(
  {
    type: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const documentTemplateSchema = new Schema<IDocumentTemplate>(
  {
    key: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 1 },
    side: { type: String, enum: ["buyer", "supplier"], required: true },
    bodyBlocks: [bodyBlockSchema],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);

documentTemplateSchema.index({ key: 1, version: 1 }, { unique: true });
documentTemplateSchema.index({ key: 1, side: 1, status: 1 });

export const DocumentTemplate =
  models.DocumentTemplate ?? model<IDocumentTemplate>("DocumentTemplate", documentTemplateSchema);
