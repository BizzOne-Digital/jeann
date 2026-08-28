import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentLotAllocationStatus =
  | "proposed"
  | "confirmed"
  | "partially_fulfilled"
  | "fulfilled"
  | "cancelled";

export interface IShipmentLotAllocation {
  dealGroupId: Types.ObjectId;
  buyerShipmentLotId: Types.ObjectId;
  supplierShipmentLotId: Types.ObjectId;
  productId?: Types.ObjectId;
  specificationVersionId?: Types.ObjectId;
  allocatedQuantity: Types.Decimal128;
  unit: string;
  allocationStatus: ShipmentLotAllocationStatus;
  compatibilityResult?: string;
  internalNotes?: string;
  createdByUserId: Types.ObjectId;
}

export type ShipmentLotAllocationLean = LeanDoc<IShipmentLotAllocation>;

const shipmentLotAllocationSchema = new Schema<IShipmentLotAllocation>(
  {
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup", required: true },
    buyerShipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    supplierShipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    specificationVersionId: { type: Schema.Types.ObjectId, ref: "ProductSpecificationVersion" },
    allocatedQuantity: { type: Schema.Types.Decimal128, required: true },
    unit: { type: String, required: true },
    allocationStatus: {
      type: String,
      enum: ["proposed", "confirmed", "partially_fulfilled", "fulfilled", "cancelled"],
      default: "proposed",
    },
    compatibilityResult: { type: String },
    internalNotes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

shipmentLotAllocationSchema.index({ dealGroupId: 1 });
shipmentLotAllocationSchema.index({ buyerShipmentLotId: 1 });
shipmentLotAllocationSchema.index({ supplierShipmentLotId: 1 });

export const ShipmentLotAllocation =
  models.ShipmentLotAllocation ??
  model<IShipmentLotAllocation>("ShipmentLotAllocation", shipmentLotAllocationSchema);
