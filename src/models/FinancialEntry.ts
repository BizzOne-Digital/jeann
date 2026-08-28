import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type FinancialEntryStatus =
  | "draft"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "posted"
  | "reversed"
  | "voided"
  | "archived";

export type FinancialEntryType =
  | "revenue"
  | "procurement_cost"
  | "direct_cost"
  | "fee"
  | "commission"
  | "tax"
  | "payment"
  | "adjustment"
  | "reversal"
  | "other";

export interface IFinancialEntry {
  entryNumber: string;
  entryType: FinancialEntryType;
  transactionId?: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  dealGroupId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  bankingInstrumentId?: Types.ObjectId;
  claimId?: Types.ObjectId;
  costCategoryCode?: string;
  accountCode?: string;
  description: string;
  originalCurrency: string;
  originalAmount: Types.Decimal128;
  baseCurrency: string;
  fxRate: Types.Decimal128;
  fxRateDate: Date;
  fxRateSource: string;
  convertedAmount: Types.Decimal128;
  roundingDifference?: Types.Decimal128;
  taxCode?: string;
  taxAmount?: Types.Decimal128;
  recoverableTaxAmount?: Types.Decimal128;
  nonRecoverableTaxAmount?: Types.Decimal128;
  entryDate: Date;
  serviceDate?: Date;
  dueDate?: Date;
  sourceDocumentId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  reviewedByUserId?: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  postedByUserId?: Types.ObjectId;
  status: FinancialEntryStatus;
  reversalOfEntryId?: Types.ObjectId;
  reversalEntryId?: Types.ObjectId;
  reversalReason?: string;
  buyerVisible: boolean;
  supplierVisible: boolean;
}

export type FinancialEntryLean = LeanDoc<IFinancialEntry>;

const financialEntrySchema = new Schema<IFinancialEntry>(
  {
    entryNumber: { type: String, required: true, trim: true, unique: true },
    entryType: {
      type: String,
      enum: ["revenue", "procurement_cost", "direct_cost", "fee", "commission", "tax", "payment", "adjustment", "reversal", "other"],
      required: true,
    },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument" },
    claimId: { type: Schema.Types.ObjectId, ref: "TradeClaim" },
    costCategoryCode: { type: String },
    accountCode: { type: String },
    description: { type: String, required: true },
    originalCurrency: { type: String, required: true },
    originalAmount: { type: Schema.Types.Decimal128, required: true },
    baseCurrency: { type: String, required: true },
    fxRate: { type: Schema.Types.Decimal128, required: true },
    fxRateDate: { type: Date, required: true },
    fxRateSource: { type: String, default: "manual" },
    convertedAmount: { type: Schema.Types.Decimal128, required: true },
    roundingDifference: { type: Schema.Types.Decimal128 },
    taxCode: { type: String },
    taxAmount: { type: Schema.Types.Decimal128 },
    recoverableTaxAmount: { type: Schema.Types.Decimal128 },
    nonRecoverableTaxAmount: { type: Schema.Types.Decimal128 },
    entryDate: { type: Date, required: true },
    serviceDate: { type: Date },
    dueDate: { type: Date },
    sourceDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    postedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "under_review", "changes_requested", "approved", "posted", "reversed", "voided", "archived"],
      default: "draft",
    },
    reversalOfEntryId: { type: Schema.Types.ObjectId, ref: "FinancialEntry" },
    reversalEntryId: { type: Schema.Types.ObjectId, ref: "FinancialEntry" },
    reversalReason: { type: String },
    buyerVisible: { type: Boolean, default: false },
    supplierVisible: { type: Boolean, default: false },
  },
  { timestamps: true },
);

financialEntrySchema.index({ transactionId: 1, status: 1 });
financialEntrySchema.index({ shipmentLotId: 1 });
financialEntrySchema.index({ dealGroupId: 1 });
financialEntrySchema.index({ entryDate: -1 });

financialEntrySchema.pre("save", async function () {
  if (this.isNew) return;
  const Model = this.constructor as typeof FinancialEntry;
  const prior = await Model.findById(this._id).select("status").lean();
  if (!prior || prior.status !== "posted") return;
  const allowed = new Set(["status", "reversalEntryId", "reversalReason", "updatedAt", "__v"]);
  const modified = this.modifiedPaths().filter((p) => !allowed.has(p));
  if (modified.length > 0) {
    throw new Error("posted_entry_immutable");
  }
});

export const FinancialEntry =
  models.FinancialEntry ?? model<IFinancialEntry>("FinancialEntry", financialEntrySchema);

/** @deprecated Legacy estimate entries — use FinancialEntry */
export const FinanceEntry = FinancialEntry;
