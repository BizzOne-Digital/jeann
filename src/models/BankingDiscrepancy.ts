import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingDiscrepancyStatus =
  | "open"
  | "under_review"
  | "correction_requested"
  | "corrected"
  | "waiver_requested"
  | "waived"
  | "amendment_required"
  | "rejected"
  | "resolved"
  | "closed";

export interface IBankingDiscrepancy {
  bankingInstrumentId: Types.ObjectId;
  presentationId?: Types.ObjectId;
  discrepancyCode: string;
  description: string;
  affectedDocument?: string;
  affectedField?: string;
  raisedByUserId: Types.ObjectId;
  raisedAt: Date;
  severity: "low" | "medium" | "high" | "blocking";
  responsibleParty?: string;
  responseDeadline?: Date;
  resolutionMethod?: string;
  status: BankingDiscrepancyStatus;
  resolutionEvidence?: string;
  resolvedAt?: Date;
}

export type BankingDiscrepancyLean = LeanDoc<IBankingDiscrepancy>;

const bankingDiscrepancySchema = new Schema<IBankingDiscrepancy>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    presentationId: { type: Schema.Types.ObjectId, ref: "BankPresentation" },
    discrepancyCode: { type: String, required: true },
    description: { type: String, required: true },
    affectedDocument: { type: String },
    affectedField: { type: String },
    raisedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    raisedAt: { type: Date, required: true, default: () => new Date() },
    severity: { type: String, enum: ["low", "medium", "high", "blocking"], default: "medium" },
    responsibleParty: { type: String },
    responseDeadline: { type: Date },
    resolutionMethod: { type: String },
    status: {
      type: String,
      enum: [
        "open",
        "under_review",
        "correction_requested",
        "corrected",
        "waiver_requested",
        "waived",
        "amendment_required",
        "rejected",
        "resolved",
        "closed",
      ],
      default: "open",
    },
    resolutionEvidence: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
);

bankingDiscrepancySchema.index({ bankingInstrumentId: 1, status: 1 });

export const BankingDiscrepancy =
  models.BankingDiscrepancy ??
  model<IBankingDiscrepancy>("BankingDiscrepancy", bankingDiscrepancySchema);
