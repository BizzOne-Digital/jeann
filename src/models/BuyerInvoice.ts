import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IInvoiceLineItem {
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

export type BuyerInvoiceStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "issued"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "disputed"
  | "credited"
  | "voided";

export interface IBuyerInvoice {
  invoiceNumber: string;
  buyerOrganizationId: Types.ObjectId;
  transactionId: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  contractReference?: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  lineItems: IInvoiceLineItem[];
  subtotal: Types.Decimal128;
  discountAmount?: Types.Decimal128;
  taxBreakdown?: Record<string, Types.Decimal128>;
  total: Types.Decimal128;
  amountPaid: Types.Decimal128;
  balance: Types.Decimal128;
  status: BuyerInvoiceStatus;
  issuedDocumentId?: Types.ObjectId;
  version: number;
  createdByUserId: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  issuedByUserId?: Types.ObjectId;
  issuedAt?: Date;
  accountingSyncStatus: string;
  qaMarker?: string;
}

export type BuyerInvoiceLean = LeanDoc<IBuyerInvoice>;

const lineItemSchema = new Schema<IInvoiceLineItem>(
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

const buyerInvoiceSchema = new Schema<IBuyerInvoice>(
  {
    invoiceNumber: { type: String, required: true, trim: true, unique: true },
    buyerOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    contractReference: { type: String },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    currency: { type: String, required: true },
    lineItems: [lineItemSchema],
    subtotal: { type: Schema.Types.Decimal128, required: true },
    discountAmount: { type: Schema.Types.Decimal128 },
    taxBreakdown: { type: Schema.Types.Mixed },
    total: { type: Schema.Types.Decimal128, required: true },
    amountPaid: { type: Schema.Types.Decimal128, default: Types.Decimal128.fromString("0") },
    balance: { type: Schema.Types.Decimal128, required: true },
    status: {
      type: String,
      enum: ["draft", "under_review", "approved", "issued", "partially_paid", "paid", "overdue", "disputed", "credited", "voided"],
      default: "draft",
    },
    issuedDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    version: { type: Number, default: 1 },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    issuedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    issuedAt: { type: Date },
    accountingSyncStatus: { type: String, default: "not_configured" },
    qaMarker: { type: String },
  },
  { timestamps: true },
);

buyerInvoiceSchema.index({ buyerOrganizationId: 1, status: 1 });
buyerInvoiceSchema.index({ transactionId: 1 });

const ISSUED_INVOICE_MUTABLE = new Set([
  "status",
  "amountPaid",
  "balance",
  "updatedAt",
  "__v",
]);

buyerInvoiceSchema.pre("save", async function () {
  if (this.isNew) return;
  const Model = this.constructor as typeof BuyerInvoice;
  const prior = await Model.findById(this._id).select("status").lean();
  if (!prior) return;
  const lockedStatuses = ["issued", "partially_paid", "paid", "credited"];
  if (!lockedStatuses.includes(prior.status)) return;
  const modified = this.modifiedPaths().filter((p) => !ISSUED_INVOICE_MUTABLE.has(p));
  if (modified.length > 0) {
    throw new Error("issued_invoice_immutable");
  }
});

export const BuyerInvoice =
  models.BuyerInvoice ?? model<IBuyerInvoice>("BuyerInvoice", buyerInvoiceSchema);
