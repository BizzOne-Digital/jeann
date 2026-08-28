import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IFXRate {
  baseCurrency: string;
  quoteCurrency: string;
  rate: Types.Decimal128;
  rateDate: Date;
  source: string;
  sourceReference?: string;
  manualEntry: boolean;
  enteredByUserId: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
  status: "pending" | "approved" | "superseded";
}

export type FXRateLean = LeanDoc<IFXRate>;

const fxRateSchema = new Schema<IFXRate>(
  {
    baseCurrency: { type: String, required: true, uppercase: true },
    quoteCurrency: { type: String, required: true, uppercase: true },
    rate: { type: Schema.Types.Decimal128, required: true },
    rateDate: { type: Date, required: true },
    source: { type: String, default: "manual" },
    sourceReference: { type: String },
    manualEntry: { type: Boolean, default: true },
    enteredByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    status: { type: String, enum: ["pending", "approved", "superseded"], default: "approved" },
  },
  { timestamps: true },
);

fxRateSchema.index({ baseCurrency: 1, quoteCurrency: 1, rateDate: -1 });

export const FXRate =
  models.FXRate ?? model<IFXRate>("FXRate", fxRateSchema);
