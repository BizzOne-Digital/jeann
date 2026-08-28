import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ShipmentChecklistStatus =
  | "draft"
  | "buyer_input_pending"
  | "supplier_input_pending"
  | "internal_review"
  | "changes_requested"
  | "approved"
  | "locked"
  | "superseded"
  | "completed";

export interface IShipmentDocumentChecklist {
  shipmentLotId: Types.ObjectId;
  transactionId: Types.ObjectId;
  bankingInstrumentId?: Types.ObjectId;
  destinationCountry?: string;
  destinationPort?: string;
  version: number;
  requestedByUserId?: Types.ObjectId;
  reviewedByUserId?: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
  approvalDate?: Date;
  lockDate?: Date;
  status: ShipmentChecklistStatus;
  sourceReferences?: string[];
  notes?: string;
  buyerAuthorityNoticeConfirmed?: boolean;
}

export type ShipmentDocumentChecklistLean = LeanDoc<IShipmentDocumentChecklist>;

const shipmentDocumentChecklistSchema = new Schema<IShipmentDocumentChecklist>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument" },
    destinationCountry: { type: String },
    destinationPort: { type: String },
    version: { type: Number, required: true, min: 1, default: 1 },
    requestedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvalDate: { type: Date },
    lockDate: { type: Date },
    status: {
      type: String,
      enum: [
        "draft",
        "buyer_input_pending",
        "supplier_input_pending",
        "internal_review",
        "changes_requested",
        "approved",
        "locked",
        "superseded",
        "completed",
      ],
      default: "draft",
    },
    sourceReferences: [{ type: String }],
    notes: { type: String },
    buyerAuthorityNoticeConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

shipmentDocumentChecklistSchema.index({ shipmentLotId: 1, version: 1 }, { unique: true });

export const ShipmentDocumentChecklist =
  models.ShipmentDocumentChecklist ??
  model<IShipmentDocumentChecklist>("ShipmentDocumentChecklist", shipmentDocumentChecklistSchema);
