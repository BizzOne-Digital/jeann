import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type MarketAlertCondition = "above" | "below" | "pct_change" | "new_forecast" | "data_stale";

export interface IMarketAlert {
  userId: Types.ObjectId;
  commodity: string;
  marketRegion: string;
  condition: MarketAlertCondition;
  threshold?: Types.Decimal128;
  thresholdPercent?: Types.Decimal128;
  currency: string;
  unit: string;
  frequency: string;
  active: boolean;
  lastTriggeredAt?: Date;
  notificationChannels: string[];
}

export type MarketAlertLean = LeanDoc<IMarketAlert>;

const marketAlertSchema = new Schema<IMarketAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commodity: { type: String, required: true },
    marketRegion: { type: String, required: true },
    condition: {
      type: String,
      enum: ["above", "below", "pct_change", "new_forecast", "data_stale"],
      required: true,
    },
    threshold: { type: Schema.Types.Decimal128 },
    thresholdPercent: { type: Schema.Types.Decimal128 },
    currency: { type: String, default: "USD" },
    unit: { type: String, default: "MT" },
    frequency: { type: String, default: "daily" },
    active: { type: Boolean, default: true },
    lastTriggeredAt: { type: Date },
    notificationChannels: [{ type: String }],
  },
  { timestamps: true },
);

marketAlertSchema.index({ userId: 1, active: 1 });

export const MarketAlert =
  models.MarketAlert ?? model<IMarketAlert>("MarketAlert", marketAlertSchema);
