import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

/**
 * The money lines of ONE transaction that the client named in the final instructions (2026-11-28):
 * the LC fee, the banking fee, the amendment fee, the MT101 deposit and the payment to the supplier.
 * Only Finekarts staff see and manage them. Nothing is final: any line can be changed at any time.
 */
export const TRANSACTION_FEE_KINDS = [
  "lc_fee",
  "banking_fee",
  "amendment_fee",
  "mt101_deposit",
  "supplier_payment",
  "other",
] as const;
export type TransactionFeeKind = (typeof TRANSACTION_FEE_KINDS)[number];

export const TRANSACTION_FEE_STATUSES = ["due", "paid", "waived"] as const;
export type TransactionFeeStatus = (typeof TRANSACTION_FEE_STATUSES)[number];

export interface ITransactionFee {
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  kind: TransactionFeeKind;
  description?: string;
  currency: string;
  amount: number;
  status: TransactionFeeStatus;
  dueDate?: Date;
  paidAt?: Date;
  /** Bank reference, MT101 / MT103 number or receipt number. */
  reference?: string;
  notes?: string;
  createdByUserId: Types.ObjectId;
  deletedAt?: Date | null;
}

export type TransactionFeeLean = LeanDoc<ITransactionFee>;

const transactionFeeSchema = new Schema<ITransactionFee>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    kind: { type: String, enum: TRANSACTION_FEE_KINDS, required: true },
    description: { type: String, trim: true, maxlength: 300 },
    currency: { type: String, required: true, uppercase: true, trim: true, minlength: 3, maxlength: 3, default: "USD" },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: TRANSACTION_FEE_STATUSES, default: "due" },
    dueDate: { type: Date },
    paidAt: { type: Date },
    reference: { type: String, trim: true, maxlength: 120 },
    notes: { type: String, trim: true, maxlength: 1000 },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

transactionFeeSchema.index({ transactionId: 1, deletedAt: 1, createdAt: 1 });

export const TransactionFee = models.TransactionFee ?? model<ITransactionFee>("TransactionFee", transactionFeeSchema);
