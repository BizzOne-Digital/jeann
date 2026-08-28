import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type FreightBookingStatus =
  | "draft"
  | "requested"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface IFreightBooking {
  shipmentLotId: Types.ObjectId;
  freightForwarder?: string;
  carrier?: string;
  bookingNumber?: string;
  bookingDate?: Date;
  transportMode: "ocean" | "air" | "road" | "rail" | "multimodal";
  vesselName?: string;
  imoNumber?: string;
  voyageNumber?: string;
  flightNumber?: string;
  containerReferences?: string[];
  loadingPort?: string;
  transshipmentPorts?: string[];
  destinationPort?: string;
  cutOffDate?: Date;
  plannedDeparture?: Date;
  estimatedArrival?: Date;
  bookingDocumentId?: Types.ObjectId;
  status: FreightBookingStatus;
  source: string;
  createdByUserId: Types.ObjectId;
}

export type FreightBookingLean = LeanDoc<IFreightBooking>;

const freightBookingSchema = new Schema<IFreightBooking>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    freightForwarder: { type: String },
    carrier: { type: String },
    bookingNumber: { type: String },
    bookingDate: { type: Date },
    transportMode: {
      type: String,
      enum: ["ocean", "air", "road", "rail", "multimodal"],
      required: true,
    },
    vesselName: { type: String },
    imoNumber: { type: String },
    voyageNumber: { type: String },
    flightNumber: { type: String },
    containerReferences: [{ type: String }],
    loadingPort: { type: String },
    transshipmentPorts: [{ type: String }],
    destinationPort: { type: String },
    cutOffDate: { type: Date },
    plannedDeparture: { type: Date },
    estimatedArrival: { type: Date },
    bookingDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    status: {
      type: String,
      enum: ["draft", "requested", "confirmed", "cancelled", "completed"],
      default: "draft",
    },
    source: { type: String, default: "manual" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

freightBookingSchema.index({ shipmentLotId: 1 });

export const FreightBooking =
  models.FreightBooking ?? model<IFreightBooking>("FreightBooking", freightBookingSchema);
