import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IFinancialSettings {
  organizationId?: string;
  baseReportingCurrency: string;
  defaultTransactionCurrency: string;
  roundingPrecision: number;
  roundingMode: "half_up" | "half_down" | "floor" | "ceil";
  fiscalYearStartMonth: number;
  defaultTimezone: string;
  taxNumberFields?: Record<string, string>;
  invoiceNumberFormat: string;
  billNumberFormat: string;
  creditNoteNumberFormat: string;
  separationOfDutiesEnabled: boolean;
}

export type FinancialSettingsLean = LeanDoc<IFinancialSettings>;

const financialSettingsSchema = new Schema<IFinancialSettings>(
  {
    organizationId: { type: String },
    baseReportingCurrency: { type: String, required: true, default: "USD" },
    defaultTransactionCurrency: { type: String, required: true, default: "USD" },
    roundingPrecision: { type: Number, default: 2 },
    roundingMode: {
      type: String,
      enum: ["half_up", "half_down", "floor", "ceil"],
      default: "half_up",
    },
    fiscalYearStartMonth: { type: Number, default: 1, min: 1, max: 12 },
    defaultTimezone: { type: String, default: "UTC" },
    taxNumberFields: { type: Schema.Types.Mixed },
    invoiceNumberFormat: { type: String, default: "FK-INV-{YEAR}-{SEQ}" },
    billNumberFormat: { type: String, default: "FK-BILL-{YEAR}-{SEQ}" },
    creditNoteNumberFormat: { type: String, default: "FK-CN-{YEAR}-{SEQ}" },
    separationOfDutiesEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const FinancialSettings =
  models.FinancialSettings ?? model<IFinancialSettings>("FinancialSettings", financialSettingsSchema);
