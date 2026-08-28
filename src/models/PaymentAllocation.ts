import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IPaymentAllocation {
  paymentRecordId: Types.ObjectId;
  buyerInvoiceId?: Types.ObjectId;
  supplierBillId?: Types.ObjectId;
  allocatedAmount: Types.Decimal128;
  currency: string;
  fxRate?: Types.Decimal128;
  fxRateDate?: Date;
  allocationDate: Date;
  createdByUserId: Types.ObjectId;
  reversed: boolean;
  reversalReason?: string;
}

export type PaymentAllocationLean = LeanDoc<IPaymentAllocation>;

const paymentAllocationSchema = new Schema<IPaymentAllocation>(
  {
    paymentRecordId: { type: Schema.Types.ObjectId, ref: "PaymentRecord", required: true },
    buyerInvoiceId: { type: Schema.Types.ObjectId, ref: "BuyerInvoice" },
    supplierBillId: { type: Schema.Types.ObjectId, ref: "SupplierBill" },
    allocatedAmount: { type: Schema.Types.Decimal128, required: true },
    currency: { type: String, required: true },
    fxRate: { type: Schema.Types.Decimal128 },
    fxRateDate: { type: Date },
    allocationDate: { type: Date, required: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reversed: { type: Boolean, default: false },
    reversalReason: { type: String },
  },
  { timestamps: true },
);

paymentAllocationSchema.index({ paymentRecordId: 1 });
paymentAllocationSchema.index({ buyerInvoiceId: 1 });
paymentAllocationSchema.index({ supplierBillId: 1 });

export const PaymentAllocation =
  models.PaymentAllocation ?? model<IPaymentAllocation>("PaymentAllocation", paymentAllocationSchema);
