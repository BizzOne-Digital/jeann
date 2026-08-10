import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITaxConfiguration {
  jurisdiction: string;
  code: string;
  rateString: string;
  effectiveFrom: Date;
  notes?: string;
  exampleOnly: boolean;
}

export type TaxConfigurationLean = LeanDoc<ITaxConfiguration>;

const taxConfigurationSchema = new Schema<ITaxConfiguration>(
  {
    jurisdiction: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    rateString: { type: String, required: true },
    effectiveFrom: { type: Date, required: true },
    notes: { type: String },
    exampleOnly: { type: Boolean, default: false },
  },
  { timestamps: true },
);

taxConfigurationSchema.index({ jurisdiction: 1, code: 1, effectiveFrom: -1 });

export const TaxConfiguration =
  models.TaxConfiguration ?? model<ITaxConfiguration>("TaxConfiguration", taxConfigurationSchema);
