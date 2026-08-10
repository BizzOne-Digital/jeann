import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentMode = "sea" | "air" | "land" | "multimodal";
export type ShipmentStatus =
  | "planned"
  | "booked"
  | "in_transit"
  | "delivered"
  | "exception"
  | "cancelled";

export interface ShipmentMilestone {
  key: string;
  label: string;
  occurredAt?: Date;
  location?: string;
  notes?: string;
}

export interface IShipment {
  transactionId: Types.ObjectId;
  mode: ShipmentMode;
  carrier?: string;
  references: string[];
  originPort?: string;
  destinationPort?: string;
  etd?: Date;
  eta?: Date;
  atd?: Date;
  ata?: Date;
  milestones: ShipmentMilestone[];
  provider?: string;
  status: ShipmentStatus;
}

export type ShipmentLean = LeanDoc<IShipment>;

const milestoneSchema = new Schema<ShipmentMilestone>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    occurredAt: { type: Date },
    location: { type: String },
    notes: { type: String },
  },
  { _id: false },
);

const shipmentSchema = new Schema<IShipment>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    mode: {
      type: String,
      enum: ["sea", "air", "land", "multimodal"],
      required: true,
    },
    carrier: { type: String },
    references: [{ type: String }],
    originPort: { type: String },
    destinationPort: { type: String },
    etd: { type: Date },
    eta: { type: Date },
    atd: { type: Date },
    ata: { type: Date },
    milestones: [milestoneSchema],
    provider: { type: String },
    status: {
      type: String,
      enum: ["planned", "booked", "in_transit", "delivered", "exception", "cancelled"],
      default: "planned",
    },
  },
  { timestamps: true },
);

shipmentSchema.index({ transactionId: 1, status: 1 });
shipmentSchema.index({ references: 1 });

export const Shipment = models.Shipment ?? model<IShipment>("Shipment", shipmentSchema);
