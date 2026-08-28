import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentIncidentStatus = "open" | "under_review" | "resolved" | "closed";

export interface IShipmentIncident {
  shipmentLotId: Types.ObjectId;
  incidentType: string;
  incidentDate: Date;
  location?: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedByUserId: Types.ObjectId;
  responsibleParty?: string;
  evidence?: string;
  status: ShipmentIncidentStatus;
  resolution?: string;
}

export type ShipmentIncidentLean = LeanDoc<IShipmentIncident>;

const shipmentIncidentSchema = new Schema<IShipmentIncident>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    incidentType: { type: String, required: true },
    incidentDate: { type: Date, required: true },
    location: { type: String },
    description: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    reportedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responsibleParty: { type: String },
    evidence: { type: String },
    status: { type: String, enum: ["open", "under_review", "resolved", "closed"], default: "open" },
    resolution: { type: String },
  },
  { timestamps: true },
);

shipmentIncidentSchema.index({ shipmentLotId: 1 });

export const ShipmentIncident =
  models.ShipmentIncident ?? model<IShipmentIncident>("ShipmentIncident", shipmentIncidentSchema);
