import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankPresentationChannel =
  | "physical_courier"
  | "participating_bank_portal"
  | "direct_bank_submission"
  | "electronic_presentation_approved"
  | "other";

export type BankPresentationStatus =
  | "recorded"
  | "receipt_confirmed"
  | "complying"
  | "discrepant"
  | "further_info_required"
  | "refused"
  | "honoured"
  | "pending";

export interface IBankPresentation {
  bankingInstrumentId: Types.ObjectId;
  transactionId: Types.ObjectId;
  presentationReference: string;
  presentedBy: string;
  presentedTo: string;
  presentationChannel: BankPresentationChannel;
  presentationDate: Date;
  documentsSummary?: string;
  courierReference?: string;
  receiptEvidence?: string;
  status: BankPresentationStatus;
  bankResponseDate?: Date;
  notes?: string;
  createdByUserId: Types.ObjectId;
}

export type BankPresentationLean = LeanDoc<IBankPresentation>;

const bankPresentationSchema = new Schema<IBankPresentation>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    presentationReference: { type: String, required: true, trim: true },
    presentedBy: { type: String, required: true },
    presentedTo: { type: String, required: true },
    presentationChannel: {
      type: String,
      enum: [
        "physical_courier",
        "participating_bank_portal",
        "direct_bank_submission",
        "electronic_presentation_approved",
        "other",
      ],
      required: true,
    },
    presentationDate: { type: Date, required: true },
    documentsSummary: { type: String },
    courierReference: { type: String },
    receiptEvidence: { type: String },
    status: {
      type: String,
      enum: [
        "recorded",
        "receipt_confirmed",
        "complying",
        "discrepant",
        "further_info_required",
        "refused",
        "honoured",
        "pending",
      ],
      default: "recorded",
    },
    bankResponseDate: { type: Date },
    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

bankPresentationSchema.index({ bankingInstrumentId: 1, presentationDate: -1 });

export const BankPresentation =
  models.BankPresentation ?? model<IBankPresentation>("BankPresentation", bankPresentationSchema);
