import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentScheduleFrequency =
  | "one_time"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "custom";

export type ShipmentScheduleStatus = "draft" | "approved" | "locked" | "superseded" | "cancelled";

export interface IShipmentSchedule {
  transactionId: Types.ObjectId;
  transactionSide: "buyer_sale" | "supplier_purchase";
  contractDocumentId?: Types.ObjectId;
  version: number;
  startDate: Date;
  endDate: Date;
  frequency: ShipmentScheduleFrequency;
  plannedLotCount: number;
  plannedQuantityPerLot: Types.Decimal128;
  quantityUnit: string;
  quantityTolerance?: string;
  status: ShipmentScheduleStatus;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
  createdByUserId: Types.ObjectId;
}

export type ShipmentScheduleLean = LeanDoc<IShipmentSchedule>;

const shipmentScheduleSchema = new Schema<IShipmentSchedule>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    transactionSide: { type: String, enum: ["buyer_sale", "supplier_purchase"], required: true },
    contractDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    version: { type: Number, required: true, min: 1, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    frequency: {
      type: String,
      enum: ["one_time", "weekly", "monthly", "quarterly", "custom"],
      required: true,
    },
    plannedLotCount: { type: Number, required: true, min: 1 },
    plannedQuantityPerLot: { type: Schema.Types.Decimal128, required: true },
    quantityUnit: { type: String, required: true },
    quantityTolerance: { type: String },
    status: {
      type: String,
      enum: ["draft", "approved", "locked", "superseded", "cancelled"],
      default: "draft",
    },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

shipmentScheduleSchema.index({ transactionId: 1, version: 1 }, { unique: true });

export const ShipmentSchedule =
  models.ShipmentSchedule ?? model<IShipmentSchedule>("ShipmentSchedule", shipmentScheduleSchema);
