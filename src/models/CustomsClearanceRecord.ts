import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CustomsClearanceStatus =
  | "preparation"
  | "submitted"
  | "under_review"
  | "additional_info_required"
  | "inspection_hold"
  | "duty_tax_pending"
  | "released"
  | "rejected"
  | "cancelled";

export interface ICustomsClearanceRecord {
  shipmentLotId: Types.ObjectId;
  country: string;
  port?: string;
  brokerAgent?: string;
  declarationReference?: string;
  submittedDate?: Date;
  currentStatus: CustomsClearanceStatus;
  holdReason?: string;
  requiredAction?: string;
  releaseDate?: Date;
  dataSource: string;
  notes?: string;
  createdByUserId: Types.ObjectId;
}

export type CustomsClearanceRecordLean = LeanDoc<ICustomsClearanceRecord>;

const customsClearanceRecordSchema = new Schema<ICustomsClearanceRecord>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    country: { type: String, required: true },
    port: { type: String },
    brokerAgent: { type: String },
    declarationReference: { type: String },
    submittedDate: { type: Date },
    currentStatus: {
      type: String,
      enum: [
        "preparation",
        "submitted",
        "under_review",
        "additional_info_required",
        "inspection_hold",
        "duty_tax_pending",
        "released",
        "rejected",
        "cancelled",
      ],
      default: "preparation",
    },
    holdReason: { type: String },
    requiredAction: { type: String },
    releaseDate: { type: Date },
    dataSource: { type: String, default: "manual" },
    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

customsClearanceRecordSchema.index({ shipmentLotId: 1 });

export const CustomsClearanceRecord =
  models.CustomsClearanceRecord ??
  model<ICustomsClearanceRecord>("CustomsClearanceRecord", customsClearanceRecordSchema);
