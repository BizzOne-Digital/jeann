import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type FinancialAccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "cogs"
  | "expense"
  | "tax"
  | "receivable"
  | "payable"
  | "clearing";

export interface IFinancialAccount {
  accountCode: string;
  accountName: string;
  accountType: FinancialAccountType;
  description?: string;
  active: boolean;
  accountingProviderMapping?: string;
  effectiveDate: Date;
  createdByUserId: Types.ObjectId;
}

export type FinancialAccountLean = LeanDoc<IFinancialAccount>;

const financialAccountSchema = new Schema<IFinancialAccount>(
  {
    accountCode: { type: String, required: true, trim: true, unique: true },
    accountName: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["asset", "liability", "equity", "revenue", "cogs", "expense", "tax", "receivable", "payable", "clearing"],
      required: true,
    },
    description: { type: String },
    active: { type: Boolean, default: true },
    accountingProviderMapping: { type: String },
    effectiveDate: { type: Date, required: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const FinancialAccount =
  models.FinancialAccount ?? model<IFinancialAccount>("FinancialAccount", financialAccountSchema);
