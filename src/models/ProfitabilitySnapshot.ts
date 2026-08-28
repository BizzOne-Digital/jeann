import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IProfitabilitySnapshot {
  transactionId?: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  dealGroupId?: Types.ObjectId;
  reportingPeriodLabel?: string;
  revenue: Types.Decimal128;
  procurementCost: Types.Decimal128;
  grossTradingMargin: Types.Decimal128;
  directOperationalCosts: Types.Decimal128;
  contributionProfit: Types.Decimal128;
  taxSummary?: Types.Decimal128;
  currency: string;
  fxBasis: string;
  calculationDate: Date;
  calculationVersion: number;
  createdByUserId: Types.ObjectId;
}

export type ProfitabilitySnapshotLean = LeanDoc<IProfitabilitySnapshot>;

const profitabilitySnapshotSchema = new Schema<IProfitabilitySnapshot>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup" },
    reportingPeriodLabel: { type: String },
    revenue: { type: Schema.Types.Decimal128, required: true },
    procurementCost: { type: Schema.Types.Decimal128, required: true },
    grossTradingMargin: { type: Schema.Types.Decimal128, required: true },
    directOperationalCosts: { type: Schema.Types.Decimal128, required: true },
    contributionProfit: { type: Schema.Types.Decimal128, required: true },
    taxSummary: { type: Schema.Types.Decimal128 },
    currency: { type: String, required: true },
    fxBasis: { type: String, default: "posted_entries" },
    calculationDate: { type: Date, required: true },
    calculationVersion: { type: Number, default: 1 },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

profitabilitySnapshotSchema.index({ transactionId: 1, calculationDate: -1 });
profitabilitySnapshotSchema.index({ dealGroupId: 1 });

export const ProfitabilitySnapshot =
  models.ProfitabilitySnapshot ??
  model<IProfitabilitySnapshot>("ProfitabilitySnapshot", profitabilitySnapshotSchema);
