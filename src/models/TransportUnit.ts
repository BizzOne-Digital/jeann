import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TransportUnitType =
  | "dry_container"
  | "flexitank_container"
  | "iso_tank"
  | "ibc"
  | "drum"
  | "fibc_jumbo_bag"
  | "bulk_vessel_hold"
  | "product_tanker"
  | "other";

export type TransportUnitStatus =
  | "planned"
  | "allocated"
  | "loaded"
  | "sealed"
  | "departed"
  | "delivered"
  | "empty_returned";

export interface ITransportUnit {
  shipmentLotId: Types.ObjectId;
  type: TransportUnitType;
  containerNumber?: string;
  sealNumber?: string;
  tankReference?: string;
  sizeType?: string;
  plannedWeight?: Types.Decimal128;
  actualWeight?: Types.Decimal128;
  status: TransportUnitStatus;
}

export type TransportUnitLean = LeanDoc<ITransportUnit>;

const transportUnitSchema = new Schema<ITransportUnit>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    type: {
      type: String,
      enum: [
        "dry_container",
        "flexitank_container",
        "iso_tank",
        "ibc",
        "drum",
        "fibc_jumbo_bag",
        "bulk_vessel_hold",
        "product_tanker",
        "other",
      ],
      required: true,
    },
    containerNumber: { type: String },
    sealNumber: { type: String },
    tankReference: { type: String },
    sizeType: { type: String },
    plannedWeight: { type: Schema.Types.Decimal128 },
    actualWeight: { type: Schema.Types.Decimal128 },
    status: {
      type: String,
      enum: ["planned", "allocated", "loaded", "sealed", "departed", "delivered", "empty_returned"],
      default: "planned",
    },
  },
  { timestamps: true },
);

transportUnitSchema.index({ shipmentLotId: 1 });

export const TransportUnit =
  models.TransportUnit ?? model<ITransportUnit>("TransportUnit", transportUnitSchema);
