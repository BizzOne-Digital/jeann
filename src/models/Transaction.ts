import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TransactionSide = "buyer" | "supplier";
export type TransactionStatus =
  | "draft"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface FinanceSnapshotLine {
  label: string;
  currency: string;
  amountDecimal: Types.Decimal128;
  isEstimate: boolean;
}

export interface FinanceSnapshot {
  currency: string;
  lines: FinanceSnapshotLine[];
  capturedAt: Date;
}

export interface ITransaction {
  transactionNumber: string;
  side: TransactionSide;
  organizationId: Types.ObjectId;
  counterpartyOrgId?: Types.ObjectId;
  linkedTransactionId?: Types.ObjectId;
  productId?: Types.ObjectId;
  status: TransactionStatus;
  currentStepKey?: string;
  templateId?: Types.ObjectId;
  financeSnapshot?: FinanceSnapshot;
  createdBy: Types.ObjectId;
  deletedAt?: Date;
}

export type TransactionLean = LeanDoc<ITransaction>;

const financeSnapshotLineSchema = new Schema<FinanceSnapshotLine>(
  {
    label: { type: String, required: true },
    currency: { type: String, required: true, uppercase: true, trim: true },
    amountDecimal: { type: Schema.Types.Decimal128, required: true },
    isEstimate: { type: Boolean, default: false },
  },
  { _id: false },
);

const financeSnapshotSchema = new Schema<FinanceSnapshot>(
  {
    currency: { type: String, required: true, uppercase: true, trim: true },
    lines: [financeSnapshotLineSchema],
    capturedAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const transactionSchema = new Schema<ITransaction>(
  {
    transactionNumber: { type: String, required: true, trim: true },
    side: { type: String, enum: ["buyer", "supplier"], required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    counterpartyOrgId: { type: Schema.Types.ObjectId, ref: "Organization" },
    linkedTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    status: {
      type: String,
      enum: ["draft", "active", "on_hold", "completed", "cancelled"],
      default: "draft",
    },
    currentStepKey: { type: String },
    templateId: { type: Schema.Types.ObjectId, ref: "WorkflowTemplate" },
    financeSnapshot: financeSnapshotSchema,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

transactionSchema.index({ transactionNumber: 1 }, { unique: true });
transactionSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
transactionSchema.index({ counterpartyOrgId: 1, status: 1 });
transactionSchema.index({ linkedTransactionId: 1 }, { sparse: true });

export const Transaction =
  models.Transaction ?? model<ITransaction>("Transaction", transactionSchema);
