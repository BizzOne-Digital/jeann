import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type PaymentScheduleType =
  | "buyer_receivable"
  | "supplier_payable"
  | "deposit"
  | "shipment_payment"
  | "final_payment"
  | "fee"
  | "refund"
  | "claim_settlement"
  | "other";

export type PaymentScheduleStatus = "planned" | "due" | "partial" | "paid" | "cancelled";

export interface IPaymentSchedule {
  transactionId?: Types.ObjectId;
  bankingInstrumentId?: Types.ObjectId;
  buyerInvoiceId?: Types.ObjectId;
  supplierBillId?: Types.ObjectId;
  paymentType: PaymentScheduleType;
  expectedAmount: Types.Decimal128;
  currency: string;
  expectedDate: Date;
  triggerMilestone?: string;
  status: PaymentScheduleStatus;
  notes?: string;
  createdByUserId: Types.ObjectId;
}

export type PaymentScheduleLean = LeanDoc<IPaymentSchedule>;

const paymentScheduleSchema = new Schema<IPaymentSchedule>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument" },
    buyerInvoiceId: { type: Schema.Types.ObjectId, ref: "BuyerInvoice" },
    supplierBillId: { type: Schema.Types.ObjectId, ref: "SupplierBill" },
    paymentType: {
      type: String,
      enum: ["buyer_receivable", "supplier_payable", "deposit", "shipment_payment", "final_payment", "fee", "refund", "claim_settlement", "other"],
      required: true,
    },
    expectedAmount: { type: Schema.Types.Decimal128, required: true },
    currency: { type: String, required: true },
    expectedDate: { type: Date, required: true },
    triggerMilestone: { type: String },
    status: {
      type: String,
      enum: ["planned", "due", "partial", "paid", "cancelled"],
      default: "planned",
    },
    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

paymentScheduleSchema.index({ buyerInvoiceId: 1 });
paymentScheduleSchema.index({ supplierBillId: 1 });

export const PaymentSchedule =
  models.PaymentSchedule ?? model<IPaymentSchedule>("PaymentSchedule", paymentScheduleSchema);
