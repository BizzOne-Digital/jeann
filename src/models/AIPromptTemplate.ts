import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IAIPromptTemplate {
  name: string;
  capability: string;
  version: number;
  systemInstruction: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  allowedRoles: string[];
  dataRestrictions?: string;
  active: boolean;
  createdByUserId: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  effectiveFrom: Date;
}

export type AIPromptTemplateLean = LeanDoc<IAIPromptTemplate>;

const aiPromptTemplateSchema = new Schema<IAIPromptTemplate>(
  {
    name: { type: String, required: true, trim: true },
    capability: { type: String, required: true },
    version: { type: Number, required: true },
    systemInstruction: { type: String, required: true },
    inputSchema: { type: Schema.Types.Mixed },
    outputSchema: { type: Schema.Types.Mixed },
    allowedRoles: [{ type: String }],
    dataRestrictions: { type: String },
    active: { type: Boolean, default: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    effectiveFrom: { type: Date, required: true },
  },
  { timestamps: true },
);

aiPromptTemplateSchema.index({ name: 1, capability: 1, version: 1 }, { unique: true });

export const AIPromptTemplate =
  models.AIPromptTemplate ?? model<IAIPromptTemplate>("AIPromptTemplate", aiPromptTemplateSchema);
