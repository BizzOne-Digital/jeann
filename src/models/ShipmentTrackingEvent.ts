import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IShipmentTrackingEvent {
  shipmentLotId: Types.ObjectId;
  trackingReferenceId?: Types.ObjectId;
  eventType: string;
  eventTimestamp: Date;
  eventTimezone: string;
  location?: string;
  description: string;
  source: string;
  sourceReference?: string;
  confidence: "confirmed" | "estimated";
  rawProviderStatus?: string;
  buyerVisible: boolean;
  supplierVisible: boolean;
}

export type ShipmentTrackingEventLean = LeanDoc<IShipmentTrackingEvent>;

const shipmentTrackingEventSchema = new Schema<IShipmentTrackingEvent>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    trackingReferenceId: { type: Schema.Types.ObjectId, ref: "TrackingReference" },
    eventType: { type: String, required: true },
    eventTimestamp: { type: Date, required: true },
    eventTimezone: { type: String, default: "UTC" },
    location: { type: String },
    description: { type: String, required: true },
    source: { type: String, required: true },
    sourceReference: { type: String },
    confidence: { type: String, enum: ["confirmed", "estimated"], default: "estimated" },
    rawProviderStatus: { type: String },
    buyerVisible: { type: Boolean, default: false },
    supplierVisible: { type: Boolean, default: false },
  },
  { timestamps: true },
);

shipmentTrackingEventSchema.index({ shipmentLotId: 1, eventTimestamp: -1 });

export const ShipmentTrackingEvent =
  models.ShipmentTrackingEvent ??
  model<IShipmentTrackingEvent>("ShipmentTrackingEvent", shipmentTrackingEventSchema);
