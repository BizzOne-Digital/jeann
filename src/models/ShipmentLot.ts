import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentLotStatus =
  | "planned"
  | "awaiting_allocation"
  | "allocated"
  | "booking_requested"
  | "booking_confirmed"
  | "document_requirements_draft"
  | "document_requirements_locked"
  | "inspection_scheduled"
  | "goods_preparation"
  | "ready_for_loading"
  | "loading"
  | "loaded"
  | "departed"
  | "in_transit"
  | "transshipment"
  | "arrived"
  | "discharged"
  | "customs_hold"
  | "customs_clearance"
  | "customs_released"
  | "out_for_delivery"
  | "delivered"
  | "delivery_exception"
  | "claim_opened"
  | "reconciliation_pending"
  | "closed"
  | "cancelled";

export interface IShipmentLot {
  shipmentLotNumber: string;
  transactionId: Types.ObjectId;
  transactionSide: "buyer_sale" | "supplier_purchase";
  scheduleId?: Types.ObjectId;
  dealGroupId?: Types.ObjectId;
  sequenceNumber: number;
  plannedQuantity: Types.Decimal128;
  actualQuantity?: Types.Decimal128;
  quantityUnit: string;
  productId?: Types.ObjectId;
  productName?: string;
  specificationVersionId?: Types.ObjectId;
  origin?: string;
  packaging?: string;
  loadingPort?: string;
  destinationPort?: string;
  incoterm?: string;
  namedPortPlace?: string;
  plannedLoadingDate?: Date;
  actualLoadingDate?: Date;
  plannedDeparture?: Date;
  actualDeparture?: Date;
  estimatedArrival?: Date;
  actualArrival?: Date;
  deliveryDate?: Date;
  currentStatus: ShipmentLotStatus;
  assignedShippingManagerId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
}

export type ShipmentLotLean = LeanDoc<IShipmentLot>;

const shipmentLotSchema = new Schema<IShipmentLot>(
  {
    shipmentLotNumber: { type: String, required: true, trim: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    transactionSide: { type: String, enum: ["buyer_sale", "supplier_purchase"], required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: "ShipmentSchedule" },
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup" },
    sequenceNumber: { type: Number, required: true, min: 1 },
    plannedQuantity: { type: Schema.Types.Decimal128, required: true },
    actualQuantity: { type: Schema.Types.Decimal128 },
    quantityUnit: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String },
    specificationVersionId: { type: Schema.Types.ObjectId, ref: "ProductSpecificationVersion" },
    origin: { type: String },
    packaging: { type: String },
    loadingPort: { type: String },
    destinationPort: { type: String },
    incoterm: { type: String },
    namedPortPlace: { type: String },
    plannedLoadingDate: { type: Date },
    actualLoadingDate: { type: Date },
    plannedDeparture: { type: Date },
    actualDeparture: { type: Date },
    estimatedArrival: { type: Date },
    actualArrival: { type: Date },
    deliveryDate: { type: Date },
    currentStatus: {
      type: String,
      enum: [
        "planned",
        "awaiting_allocation",
        "allocated",
        "booking_requested",
        "booking_confirmed",
        "document_requirements_draft",
        "document_requirements_locked",
        "inspection_scheduled",
        "goods_preparation",
        "ready_for_loading",
        "loading",
        "loaded",
        "departed",
        "in_transit",
        "transshipment",
        "arrived",
        "discharged",
        "customs_hold",
        "customs_clearance",
        "customs_released",
        "out_for_delivery",
        "delivered",
        "delivery_exception",
        "claim_opened",
        "reconciliation_pending",
        "closed",
        "cancelled",
      ],
      default: "planned",
    },
    assignedShippingManagerId: { type: Schema.Types.ObjectId, ref: "User" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

shipmentLotSchema.index({ shipmentLotNumber: 1 }, { unique: true });
shipmentLotSchema.index({ transactionId: 1, sequenceNumber: 1 });
shipmentLotSchema.index({ transactionSide: 1, currentStatus: 1 });

export const ShipmentLot =
  models.ShipmentLot ?? model<IShipmentLot>("ShipmentLot", shipmentLotSchema);
