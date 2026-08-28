import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IDocumentRequirementTemplate {
  name: string;
  destinationCountry?: string;
  destinationPort?: string;
  productId?: Types.ObjectId;
  transportMode?: string;
  incoterm?: string;
  bankingInstrumentTypeCode?: string;
  inspectionRequired?: boolean;
  effectiveDate: Date;
  documentTypes: string[];
  notes?: string;
  active: boolean;
  createdByUserId: Types.ObjectId;
}

export type DocumentRequirementTemplateLean = LeanDoc<IDocumentRequirementTemplate>;

const documentRequirementTemplateSchema = new Schema<IDocumentRequirementTemplate>(
  {
    name: { type: String, required: true, trim: true },
    destinationCountry: { type: String },
    destinationPort: { type: String },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    transportMode: { type: String },
    incoterm: { type: String },
    bankingInstrumentTypeCode: { type: String },
    inspectionRequired: { type: Boolean, default: false },
    effectiveDate: { type: Date, required: true },
    documentTypes: [{ type: String }],
    notes: { type: String },
    active: { type: Boolean, default: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

documentRequirementTemplateSchema.index({ destinationCountry: 1, destinationPort: 1, active: 1 });

export const DocumentRequirementTemplate =
  models.DocumentRequirementTemplate ??
  model<IDocumentRequirementTemplate>("DocumentRequirementTemplate", documentRequirementTemplateSchema);
