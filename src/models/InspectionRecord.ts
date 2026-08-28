import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type InspectionRecordStatus =
  | "not_required"
  | "requested"
  | "scheduled"
  | "in_progress"
  | "report_pending"
  | "report_uploaded"
  | "under_review"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface IInspectionRecord {
  shipmentLotId: Types.ObjectId;
  inspectionType: string;
  inspectionProvider: string;
  inspectionLocation?: string;
  requestedDate?: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  scope?: string;
  requestedTests?: string[];
  resultSummary?: string;
  status: InspectionRecordStatus;
  reportDocumentId?: Types.ObjectId;
  evidenceSource?: string;
  verificationStatus: "unverified" | "evidence_reviewed" | "accepted";
  reviewedByUserId?: Types.ObjectId;
  reviewDate?: Date;
  createdByUserId: Types.ObjectId;
}

export type InspectionRecordLean = LeanDoc<IInspectionRecord>;

const inspectionRecordSchema = new Schema<IInspectionRecord>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    inspectionType: { type: String, required: true },
    inspectionProvider: { type: String, required: true },
    inspectionLocation: { type: String },
    requestedDate: { type: Date },
    scheduledDate: { type: Date },
    completedDate: { type: Date },
    scope: { type: String },
    requestedTests: [{ type: String }],
    resultSummary: { type: String },
    status: {
      type: String,
      enum: [
        "not_required",
        "requested",
        "scheduled",
        "in_progress",
        "report_pending",
        "report_uploaded",
        "under_review",
        "accepted",
        "rejected",
        "cancelled",
      ],
      default: "requested",
    },
    reportDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    evidenceSource: { type: String },
    verificationStatus: {
      type: String,
      enum: ["unverified", "evidence_reviewed", "accepted"],
      default: "unverified",
    },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewDate: { type: Date },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

inspectionRecordSchema.index({ shipmentLotId: 1 });

export const InspectionRecord =
  models.InspectionRecord ?? model<IInspectionRecord>("InspectionRecord", inspectionRecordSchema);
