import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type PaymentDirection = "incoming" | "outgoing";
export type PaymentRecordStatus =
  | "planned"
  | "evidence_uploaded"
  | "pending_verification"
  | "recorded"
  | "cleared"
  | "partially_allocated"
  | "fully_allocated"
  | "failed"
  | "reversed"
  | "refunded";

export type PaymentVerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface IPaymentRecord {
  paymentNumber: string;
  direction: PaymentDirection;
  payerOrganizationId?: Types.ObjectId;
  payeeOrganizationId?: Types.ObjectId;
  originalAmount: Types.Decimal128;
  currency: string;
  paymentDate: Date;
  valueDate?: Date;
  method?: string;
  bankReference?: string;
  bankingInstrumentId?: Types.ObjectId;
  evidenceDocumentId?: Types.ObjectId;
  verificationStatus: PaymentVerificationStatus;
  verifiedByUserId?: Types.ObjectId;
  verifiedAt?: Date;
  status: PaymentRecordStatus;
  reversalOfPaymentId?: Types.ObjectId;
  reversalPaymentId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  buyerVisible: boolean;
  supplierVisible: boolean;
}

export type PaymentRecordLean = LeanDoc<IPaymentRecord>;

const paymentRecordSchema = new Schema<IPaymentRecord>(
  {
    paymentNumber: { type: String, required: true, trim: true, unique: true },
    direction: { type: String, enum: ["incoming", "outgoing"], required: true },
    payerOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    payeeOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    originalAmount: { type: Schema.Types.Decimal128, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    valueDate: { type: Date },
    method: { type: String },
    bankReference: { type: String },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument" },
    evidenceDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    verifiedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    status: {
      type: String,
      enum: ["planned", "evidence_uploaded", "pending_verification", "recorded", "cleared", "partially_allocated", "fully_allocated", "failed", "reversed", "refunded"],
      default: "planned",
    },
    reversalOfPaymentId: { type: Schema.Types.ObjectId, ref: "PaymentRecord" },
    reversalPaymentId: { type: Schema.Types.ObjectId, ref: "PaymentRecord" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyerVisible: { type: Boolean, default: false },
    supplierVisible: { type: Boolean, default: false },
  },
  { timestamps: true },
);

paymentRecordSchema.index({ payerOrganizationId: 1 });
paymentRecordSchema.index({ payeeOrganizationId: 1 });
paymentRecordSchema.index({ bankReference: 1 });

export const PaymentRecord =
  models.PaymentRecord ?? model<IPaymentRecord>("PaymentRecord", paymentRecordSchema);
