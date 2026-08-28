import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type SecurityIncidentStatus =
  | "open"
  | "investigating"
  | "contained"
  | "recovering"
  | "resolved"
  | "closed";

export interface ISecurityIncident {
  incidentNumber: string;
  title: string;
  severity: string;
  description: string;
  detectedAt: Date;
  detectionSource: string;
  affectedSystems?: string[];
  affectedOrganizationIds?: Types.ObjectId[];
  assignedResponderIds?: Types.ObjectId[];
  containmentActions?: string[];
  investigationNotes?: string;
  evidenceReferences?: string[];
  status: SecurityIncidentStatus;
  resolution?: string;
  closedAt?: Date;
  postIncidentReview?: string;
  createdByUserId: Types.ObjectId;
}

export type SecurityIncidentLean = LeanDoc<ISecurityIncident>;

const securityIncidentSchema = new Schema<ISecurityIncident>(
  {
    incidentNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now },
    detectionSource: { type: String, default: "manual" },
    affectedSystems: [{ type: String }],
    affectedOrganizationIds: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    assignedResponderIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    containmentActions: [{ type: String }],
    investigationNotes: { type: String },
    evidenceReferences: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "investigating", "contained", "recovering", "resolved", "closed"],
      default: "open",
    },
    resolution: { type: String },
    closedAt: { type: Date },
    postIncidentReview: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const SecurityIncident =
  models.SecurityIncident ??
  model<ISecurityIncident>("SecurityIncident", securityIncidentSchema);
