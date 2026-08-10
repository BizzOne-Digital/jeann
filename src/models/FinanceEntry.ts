import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type FinanceEntryType =
  | "invoice"
  | "payment"
  | "fee"
  | "adjustment"
  | "estimate"
  | "credit";

export interface IFinanceEntry {
  transactionId: Types.ObjectId;
  type: FinanceEntryType;
  label: string;
  currency: string;
  amountDecimal: Types.Decimal128;
  scheduleMonth?: string;
  isEstimate: boolean;
  taxCode?: string;
}

export type FinanceEntryLean = LeanDoc<IFinanceEntry>;

const financeEntrySchema = new Schema<IFinanceEntry>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    type: {
      type: String,
      enum: ["invoice", "payment", "fee", "adjustment", "estimate", "credit"],
      required: true,
    },
    label: { type: String, required: true, trim: true },
    currency: { type: String, required: true, uppercase: true, trim: true },
    amountDecimal: { type: Schema.Types.Decimal128, required: true },
    scheduleMonth: { type: String, match: /^\d{4}-\d{2}$/ },
    isEstimate: { type: Boolean, default: false },
    taxCode: { type: String, trim: true },
  },
  { timestamps: true },
);

financeEntrySchema.index({ transactionId: 1, type: 1 });
financeEntrySchema.index({ transactionId: 1, scheduleMonth: 1 });

export const FinanceEntry =
  models.FinanceEntry ?? model<IFinanceEntry>("FinanceEntry", financeEntrySchema);
