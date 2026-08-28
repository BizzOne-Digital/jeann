import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IBillLineItem {
  description: string;
  quantity?: Types.Decimal128;
  unit?: string;
  unitPrice?: Types.Decimal128;
  subtotal: Types.Decimal128;
  taxCode?: string;
  taxAmount?: Types.Decimal128;
  total: Types.Decimal128;
  transactionId?: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  costCategoryCode?: string;
}

export type SupplierBillStatus =
  | "draft"
  | "received"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "posted"
  | "partially_paid"
  | "paid"
  | "disputed"
  | "voided";

export interface ISupplierBill {
  billNumber: string;
  supplierInvoiceReference?: string;
  supplierOrganizationId: Types.ObjectId;
  transactionId: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  lineItems: IBillLineItem[];
  taxBreakdown?: Record<string, Types.Decimal128>;
  total: Types.Decimal128;
  amountPaid: Types.Decimal128;
  balance: Types.Decimal128;
  status: SupplierBillStatus;
  sourceDocumentId?: Types.ObjectId;
  reviewedByUserId?: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  postedByUserId?: Types.ObjectId;
  postedAt?: Date;
  accountingSyncStatus: string;
  qaMarker?: string;
  createdByUserId: Types.ObjectId;
}

export type SupplierBillLean = LeanDoc<ISupplierBill>;

const billLineSchema = new Schema<IBillLineItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Schema.Types.Decimal128 },
    unit: { type: String },
    unitPrice: { type: Schema.Types.Decimal128 },
    subtotal: { type: Schema.Types.Decimal128, required: true },
    taxCode: { type: String },
    taxAmount: { type: Schema.Types.Decimal128 },
    total: { type: Schema.Types.Decimal128, required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    costCategoryCode: { type: String },
  },
  { _id: false },
);

const supplierBillSchema = new Schema<ISupplierBill>(
  {
    billNumber: { type: String, required: true, trim: true, unique: true },
    supplierInvoiceReference: { type: String },
    supplierOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    currency: { type: String, required: true },
    lineItems: [billLineSchema],
    taxBreakdown: { type: Schema.Types.Mixed },
    total: { type: Schema.Types.Decimal128, required: true },
    amountPaid: { type: Schema.Types.Decimal128, default: Types.Decimal128.fromString("0") },
    balance: { type: Schema.Types.Decimal128, required: true },
    status: {
      type: String,
      enum: ["draft", "received", "under_review", "changes_requested", "approved", "posted", "partially_paid", "paid", "disputed", "voided"],
      default: "draft",
    },
    sourceDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    postedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    postedAt: { type: Date },
    accountingSyncStatus: { type: String, default: "not_configured" },
    qaMarker: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

supplierBillSchema.index({ supplierOrganizationId: 1, status: 1 });
supplierBillSchema.index({ transactionId: 1 });

const POSTED_BILL_MUTABLE = new Set(["status", "amountPaid", "balance", "updatedAt", "__v"]);

supplierBillSchema.pre("save", async function () {
  if (this.isNew) return;
  const Model = this.constructor as typeof SupplierBill;
  const prior = await Model.findById(this._id).select("status").lean();
  if (!prior) return;
  const lockedStatuses = ["posted", "partially_paid", "paid"];
  if (!lockedStatuses.includes(prior.status)) return;
  const modified = this.modifiedPaths().filter((p) => !POSTED_BILL_MUTABLE.has(p));
  if (modified.length > 0) {
    throw new Error("posted_bill_immutable");
  }
});

export const SupplierBill =
  models.SupplierBill ?? model<ISupplierBill>("SupplierBill", supplierBillSchema);
