import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CourierRecordStatus =
  | "prepared"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "delivery_failed"
  | "returned"
  | "cancelled";

export type CourierVerificationStatus = "pending" | "verified_authentic" | "discrepancies_found";
export type CourierPaymentStatus = "pending" | "payment_confirmed" | "payment_refused";

export interface ICourierRecord {
  presentationPackageId?: Types.ObjectId;
  senderAdviserUserId?: Types.ObjectId;
  recipientBankName?: string;
  recipientAdviserName?: string;
  receivedDate?: Date;
  verificationStatus?: CourierVerificationStatus;
  verifiedAt?: Date;
  paymentStatus?: CourierPaymentStatus;
  paymentConfirmedAt?: Date;
  paymentReference?: string;
  statusNotes?: string;
  bankingInstrumentId: Types.ObjectId;
  courierCompany: string;
  trackingNumber?: string;
  sender: string;
  recipient: string;
  dispatchDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  packageDescription?: string;
  receiptProof?: string;
  status: CourierRecordStatus;
  createdByUserId: Types.ObjectId;
}

export type CourierRecordLean = LeanDoc<ICourierRecord>;

const courierRecordSchema = new Schema<ICourierRecord>(
  {
    presentationPackageId: { type: Schema.Types.ObjectId, ref: "PresentationPackage" },
    senderAdviserUserId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientBankName: { type: String },
    recipientAdviserName: { type: String },
    receivedDate: { type: Date },
    verificationStatus: { type: String, enum: ["pending", "verified_authentic", "discrepancies_found"], default: "pending" },
    verifiedAt: { type: Date },
    paymentStatus: { type: String, enum: ["pending", "payment_confirmed", "payment_refused"], default: "pending" },
    paymentConfirmedAt: { type: Date },
    paymentReference: { type: String },
    statusNotes: { type: String },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    courierCompany: { type: String, required: true },
    trackingNumber: { type: String },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    dispatchDate: { type: Date },
    expectedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    packageDescription: { type: String },
    receiptProof: { type: String },
    status: {
      type: String,
      enum: [
        "prepared",
        "dispatched",
        "in_transit",
        "delivered",
        "delivery_failed",
        "returned",
        "cancelled",
      ],
      default: "prepared",
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

courierRecordSchema.index({ bankingInstrumentId: 1 });

export const CourierRecord =
  models.CourierRecord ?? model<ICourierRecord>("CourierRecord", courierRecordSchema);
