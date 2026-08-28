import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type WaiverRecordStatus =
  | "requested"
  | "counterparty_pending"
  | "counterparty_approved"
  | "counterparty_rejected"
  | "bank_pending"
  | "bank_accepted"
  | "bank_rejected"
  | "withdrawn";

export interface IWaiverRecord {
  discrepancyId: Types.ObjectId;
  bankingInstrumentId: Types.ObjectId;
  requestedByUserId: Types.ObjectId;
  requestedAt: Date;
  requestDetails: string;
  counterpartyDecision?: string;
  bankResponse?: string;
  conditions?: string;
  evidence?: string;
  status: WaiverRecordStatus;
  decisionDate?: Date;
}

export type WaiverRecordLean = LeanDoc<IWaiverRecord>;

const waiverRecordSchema = new Schema<IWaiverRecord>(
  {
    discrepancyId: { type: Schema.Types.ObjectId, ref: "BankingDiscrepancy", required: true },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    requestedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedAt: { type: Date, required: true, default: () => new Date() },
    requestDetails: { type: String, required: true },
    counterpartyDecision: { type: String },
    bankResponse: { type: String },
    conditions: { type: String },
    evidence: { type: String },
    status: {
      type: String,
      enum: [
        "requested",
        "counterparty_pending",
        "counterparty_approved",
        "counterparty_rejected",
        "bank_pending",
        "bank_accepted",
        "bank_rejected",
        "withdrawn",
      ],
      default: "requested",
    },
    decisionDate: { type: Date },
  },
  { timestamps: true },
);

waiverRecordSchema.index({ discrepancyId: 1 });

export const WaiverRecord =
  models.WaiverRecord ?? model<IWaiverRecord>("WaiverRecord", waiverRecordSchema);
