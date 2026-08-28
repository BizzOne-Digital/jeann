import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITransactionCounter {
  year: number;
  side: string;
  sequence: number;
}

export type TransactionCounterLean = LeanDoc<ITransactionCounter>;

const transactionCounterSchema = new Schema<ITransactionCounter>(
  {
    year: { type: Number, required: true },
    side: { type: String, required: true, trim: true },
    sequence: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

transactionCounterSchema.index({ year: 1, side: 1 }, { unique: true });

export const TransactionCounter =
  models.TransactionCounter ??
  model<ITransactionCounter>("TransactionCounter", transactionCounterSchema);
