import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CreditNoteStatus = "draft" | "approved" | "issued" | "voided";

export interface ICreditNote {
  noteNumber: string;
  noteType: "credit" | "debit";
  buyerInvoiceId?: Types.ObjectId;
  supplierBillId?: Types.ObjectId;
  reason: string;
  currency: string;
  amount: Types.Decimal128;
  taxAdjustment?: Types.Decimal128;
  status: CreditNoteStatus;
  approvedByUserId?: Types.ObjectId;
  issuedAt?: Date;
  createdByUserId: Types.ObjectId;
  qaMarker?: string;
}

export type CreditNoteLean = LeanDoc<ICreditNote>;

const creditNoteSchema = new Schema<ICreditNote>(
  {
    noteNumber: { type: String, required: true, trim: true, unique: true },
    noteType: { type: String, enum: ["credit", "debit"], required: true },
    buyerInvoiceId: { type: Schema.Types.ObjectId, ref: "BuyerInvoice" },
    supplierBillId: { type: Schema.Types.ObjectId, ref: "SupplierBill" },
    reason: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    taxAdjustment: { type: Schema.Types.Decimal128 },
    status: { type: String, enum: ["draft", "approved", "issued", "voided"], default: "draft" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    issuedAt: { type: Date },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qaMarker: { type: String },
  },
  { timestamps: true },
);

export const CreditNote =
  models.CreditNote ?? model<ICreditNote>("CreditNote", creditNoteSchema);
