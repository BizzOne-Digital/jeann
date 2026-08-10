import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ValidationRule {
  field: string;
  operator: string;
  value?: unknown;
  message?: string;
}

export interface IValidationRuleSet {
  key: string;
  version: number;
  rules: ValidationRule[];
  active: boolean;
  approvedAt?: Date;
}

export type ValidationRuleSetLean = LeanDoc<IValidationRuleSet>;

const validationRuleSchema = new Schema<ValidationRule>(
  {
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: Schema.Types.Mixed },
    message: { type: String },
  },
  { _id: false },
);

const validationRuleSetSchema = new Schema<IValidationRuleSet>(
  {
    key: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 1 },
    rules: [validationRuleSchema],
    active: { type: Boolean, default: false },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

validationRuleSetSchema.index({ key: 1, version: 1 }, { unique: true });
validationRuleSetSchema.index({ key: 1, active: 1 });

export const ValidationRuleSet =
  models.ValidationRuleSet ?? model<IValidationRuleSet>("ValidationRuleSet", validationRuleSetSchema);
