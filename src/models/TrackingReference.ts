import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITrackingReference {
  shipmentLotId: Types.ObjectId;
  provider: string;
  referenceType: string;
  trackingNumber: string;
  carrier?: string;
  dataSource: string;
  active: boolean;
  lastSynchronizedAt?: Date;
  createdByUserId: Types.ObjectId;
}

export type TrackingReferenceLean = LeanDoc<ITrackingReference>;

const trackingReferenceSchema = new Schema<ITrackingReference>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    provider: { type: String, required: true },
    referenceType: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    carrier: { type: String },
    dataSource: { type: String, default: "manual" },
    active: { type: Boolean, default: true },
    lastSynchronizedAt: { type: Date },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

trackingReferenceSchema.index({ shipmentLotId: 1 });
trackingReferenceSchema.index({ trackingNumber: 1 });

export const TrackingReference =
  models.TrackingReference ?? model<ITrackingReference>("TrackingReference", trackingReferenceSchema);
