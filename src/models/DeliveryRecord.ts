import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DeliveryRecordStatus = "pending" | "confirmed" | "exception" | "disputed";

export interface IDeliveryRecord {
  shipmentLotId: Types.ObjectId;
  deliveredQuantity: Types.Decimal128;
  unit: string;
  deliveryDate: Date;
  recipient?: string;
  deliveryLocation?: string;
  proofDocumentId?: Types.ObjectId;
  condition?: string;
  shortageDamageNotes?: string;
  acceptedByUserId?: Types.ObjectId;
  status: DeliveryRecordStatus;
  createdByUserId: Types.ObjectId;
}

export type DeliveryRecordLean = LeanDoc<IDeliveryRecord>;

const deliveryRecordSchema = new Schema<IDeliveryRecord>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    deliveredQuantity: { type: Schema.Types.Decimal128, required: true },
    unit: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    recipient: { type: String },
    deliveryLocation: { type: String },
    proofDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    condition: { type: String },
    shortageDamageNotes: { type: String },
    acceptedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "exception", "disputed"],
      default: "pending",
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

deliveryRecordSchema.index({ shipmentLotId: 1 });

export const DeliveryRecord =
  models.DeliveryRecord ?? model<IDeliveryRecord>("DeliveryRecord", deliveryRecordSchema);
