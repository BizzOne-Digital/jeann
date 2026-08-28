import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IBankingInstrumentType {
  name: string;
  code: string;
  description?: string;
  active: boolean;
  buyerSideAvailable: boolean;
  supplierSideAvailable: boolean;
  requiredFields?: string[];
  allowedStatuses?: string[];
  approvalRequirements?: string;
  createdByUserId?: Types.ObjectId;
  updatedByUserId?: Types.ObjectId;
  effectiveAt?: Date;
}

export type BankingInstrumentTypeLean = LeanDoc<IBankingInstrumentType>;

const bankingInstrumentTypeSchema = new Schema<IBankingInstrumentType>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String },
    active: { type: Boolean, default: true },
    buyerSideAvailable: { type: Boolean, default: true },
    supplierSideAvailable: { type: Boolean, default: true },
    requiredFields: [{ type: String }],
    allowedStatuses: [{ type: String }],
    approvalRequirements: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    updatedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    effectiveAt: { type: Date },
  },
  { timestamps: true },
);

bankingInstrumentTypeSchema.index({ code: 1 }, { unique: true });

export const BankingInstrumentType =
  models.BankingInstrumentType ??
  model<IBankingInstrumentType>("BankingInstrumentType", bankingInstrumentTypeSchema);
