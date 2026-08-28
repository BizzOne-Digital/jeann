import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITaxCode {
  jurisdictionCode: string;
  taxName: string;
  taxCode: string;
  ratePercent: Types.Decimal128;
  effectiveFrom: Date;
  effectiveTo?: Date;
  taxInclusive: boolean;
  recoverable: boolean;
  appliesToRules?: string;
  exemptionRules?: string;
  accountantReference?: string;
  manualReviewRequired: boolean;
  active: boolean;
  createdByUserId: Types.ObjectId;
}

export type TaxCodeLean = LeanDoc<ITaxCode>;

const taxCodeSchema = new Schema<ITaxCode>(
  {
    jurisdictionCode: { type: String, required: true },
    taxName: { type: String, required: true },
    taxCode: { type: String, required: true, trim: true, uppercase: true },
    ratePercent: { type: Schema.Types.Decimal128, required: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
    taxInclusive: { type: Boolean, default: false },
    recoverable: { type: Boolean, default: true },
    appliesToRules: { type: String },
    exemptionRules: { type: String },
    accountantReference: { type: String },
    manualReviewRequired: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

taxCodeSchema.index({ taxCode: 1, effectiveFrom: -1 });

export const TaxCode =
  models.TaxCode ?? model<ITaxCode>("TaxCode", taxCodeSchema);
