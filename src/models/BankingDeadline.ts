import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingDeadlineType =
  | "wording_review"
  | "issuance_request"
  | "expected_issuance"
  | "instrument_expiry"
  | "latest_shipment"
  | "presentation_deadline"
  | "amendment_response"
  | "discrepancy_response"
  | "waiver_response"
  | "payment_honour_expected";

export type BankingDeadlineStatus =
  | "upcoming"
  | "due_soon"
  | "due_today"
  | "overdue"
  | "completed"
  | "cancelled"
  | "superseded";

export interface IBankingDeadline {
  bankingInstrumentId: Types.ObjectId;
  deadlineType: BankingDeadlineType;
  dueAt: Date;
  timezone: string;
  isCalendarDays: boolean;
  source: string;
  responsibleParty?: string;
  reminderSchedule?: string[];
  status: BankingDeadlineStatus;
  completedAt?: Date;
  completionEvidence?: string;
  createdByUserId: Types.ObjectId;
}

export type BankingDeadlineLean = LeanDoc<IBankingDeadline>;

const bankingDeadlineSchema = new Schema<IBankingDeadline>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    deadlineType: {
      type: String,
      enum: [
        "wording_review",
        "issuance_request",
        "expected_issuance",
        "instrument_expiry",
        "latest_shipment",
        "presentation_deadline",
        "amendment_response",
        "discrepancy_response",
        "waiver_response",
        "payment_honour_expected",
      ],
      required: true,
    },
    dueAt: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },
    isCalendarDays: { type: Boolean, default: true },
    source: { type: String, default: "manual" },
    responsibleParty: { type: String },
    reminderSchedule: [{ type: String }],
    status: {
      type: String,
      enum: ["upcoming", "due_soon", "due_today", "overdue", "completed", "cancelled", "superseded"],
      default: "upcoming",
    },
    completedAt: { type: Date },
    completionEvidence: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

bankingDeadlineSchema.index({ bankingInstrumentId: 1, status: 1, dueAt: 1 });
bankingDeadlineSchema.index({ dueAt: 1, status: 1 });

export const BankingDeadline =
  models.BankingDeadline ?? model<IBankingDeadline>("BankingDeadline", bankingDeadlineSchema);
