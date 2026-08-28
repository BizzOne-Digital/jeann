import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type FinancialPeriodType = "month" | "quarter" | "year" | "custom";
export type FinancialPeriodStatus = "open" | "closing" | "closed" | "reopened" | "locked";

export interface IFinancialPeriod {
  periodType: FinancialPeriodType;
  label: string;
  startDate: Date;
  endDate: Date;
  status: FinancialPeriodStatus;
  closedByUserId?: Types.ObjectId;
  closedAt?: Date;
  reopenedByUserId?: Types.ObjectId;
  reopenReason?: string;
}

export type FinancialPeriodLean = LeanDoc<IFinancialPeriod>;

const financialPeriodSchema = new Schema<IFinancialPeriod>(
  {
    periodType: { type: String, enum: ["month", "quarter", "year", "custom"], required: true },
    label: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "closing", "closed", "reopened", "locked"],
      default: "open",
    },
    closedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    closedAt: { type: Date },
    reopenedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reopenReason: { type: String },
  },
  { timestamps: true },
);

financialPeriodSchema.index({ startDate: 1, endDate: 1 });

export const FinancialPeriod =
  models.FinancialPeriod ?? model<IFinancialPeriod>("FinancialPeriod", financialPeriodSchema);
