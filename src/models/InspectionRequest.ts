import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export const INSPECTION_REQUEST_STATUSES = ["requested", "granted", "declined", "report_received"] as const;
export type InspectionRequestStatus = (typeof INSPECTION_REQUEST_STATUSES)[number];

/**
 * The buyer's request to have the goods inspected at the loading port. It is made in the buyer portal (stage 1).
 * When Finekarts grants it, the supplier order (stage 2) gets a requested document for the inspection report, and
 * the report is received and handed to the buyer from there.
 */
export interface IInspectionRequest {
  /** The buyer order (stage 1). */
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  /** Who inspects and what the buyer wants checked, in the buyer's own words. */
  inspectionCompany?: string;
  scope?: string;
  loadingPort?: string;
  requestedBy: "buyer" | "staff";
  requestedByUserId: Types.ObjectId;
  status: InspectionRequestStatus;
  decisionNote?: string;
  decidedAt?: Date;
  decidedByUserId?: Types.ObjectId;
  /** The requested document on the supplier order that stands for the inspection report. */
  reportRequestedDocumentId?: Types.ObjectId;
  reportReceivedAt?: Date;
  deletedAt?: Date | null;
}

export type InspectionRequestLean = LeanDoc<IInspectionRequest>;

const inspectionRequestSchema = new Schema<IInspectionRequest>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    inspectionCompany: { type: String, trim: true, maxlength: 200 },
    scope: { type: String, trim: true, maxlength: 1000 },
    loadingPort: { type: String, trim: true, maxlength: 200 },
    requestedBy: { type: String, enum: ["buyer", "staff"], required: true },
    requestedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: INSPECTION_REQUEST_STATUSES, default: "requested" },
    decisionNote: { type: String, trim: true, maxlength: 1000 },
    decidedAt: { type: Date },
    decidedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reportRequestedDocumentId: { type: Schema.Types.ObjectId, ref: "RequestedDocument" },
    reportReceivedAt: { type: Date },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

inspectionRequestSchema.index({ transactionId: 1, deletedAt: 1, createdAt: 1 });

export const InspectionRequest =
  models.InspectionRequest ?? model<IInspectionRequest>("InspectionRequest", inspectionRequestSchema);
