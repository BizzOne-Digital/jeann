import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IMarketDataObservation {
  providerAdapter: string;
  commodity: string;
  marketRegion: string;
  dataType: string;
  unit: string;
  currency: string;
  observationDate: Date;
  value: Types.Decimal128;
  sourceTimestamp?: Date;
  providerReference?: string;
  licensingClassification: string;
  importedAt: Date;
}

export type MarketDataObservationLean = LeanDoc<IMarketDataObservation>;

const marketDataObservationSchema = new Schema<IMarketDataObservation>(
  {
    providerAdapter: { type: String, required: true },
    commodity: { type: String, required: true },
    marketRegion: { type: String, required: true },
    dataType: { type: String, required: true },
    unit: { type: String, required: true },
    currency: { type: String, required: true },
    observationDate: { type: Date, required: true },
    value: { type: Schema.Types.Decimal128, required: true },
    sourceTimestamp: { type: Date },
    providerReference: { type: String },
    licensingClassification: { type: String, default: "internal_only" },
    importedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

marketDataObservationSchema.index(
  { providerAdapter: 1, commodity: 1, marketRegion: 1, observationDate: -1 },
);
marketDataObservationSchema.index({ providerReference: 1 }, { sparse: true });

export const MarketDataObservation =
  models.MarketDataObservation ??
  model<IMarketDataObservation>("MarketDataObservation", marketDataObservationSchema);
