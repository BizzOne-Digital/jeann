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

export interface ICourierRecord {
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
