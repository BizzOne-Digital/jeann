import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITaxJurisdiction {
  country: string;
  stateProvince?: string;
  name: string;
  code: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  active: boolean;
}

export type TaxJurisdictionLean = LeanDoc<ITaxJurisdiction>;

const taxJurisdictionSchema = new Schema<ITaxJurisdiction>(
  {
    country: { type: String, required: true },
    stateProvince: { type: String },
    name: { type: String, required: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

taxJurisdictionSchema.index({ code: 1, effectiveFrom: -1 });

export const TaxJurisdiction =
  models.TaxJurisdiction ?? model<ITaxJurisdiction>("TaxJurisdiction", taxJurisdictionSchema);
