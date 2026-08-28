import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ClauseClassification = "required" | "conditional" | "optional";

export interface IClause {
  name: string;
  category: string;
  version: number;
  text: string;
  requiredVariables?: string[];
  applicableDocumentTypes: string[];
  classification: ClauseClassification;
  applicabilityRules?: string;
  active: boolean;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
  effectiveAt?: Date;
}

export type ClauseLean = LeanDoc<IClause>;

const clauseSchema = new Schema<IClause>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 1 },
    text: { type: String, required: true },
    requiredVariables: [{ type: String }],
    applicableDocumentTypes: [{ type: String }],
    classification: {
      type: String,
      enum: ["required", "conditional", "optional"],
      default: "optional",
    },
    applicabilityRules: { type: String },
    active: { type: Boolean, default: false },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    effectiveAt: { type: Date },
  },
  { timestamps: true },
);

clauseSchema.index({ name: 1, version: 1 }, { unique: true });
clauseSchema.index({ category: 1, active: 1 });

export const Clause = models.Clause ?? model<IClause>("Clause", clauseSchema);
