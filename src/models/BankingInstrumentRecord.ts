import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingInstrumentStatus =
  | "not_selected"
  | "draft_wording"
  | "internal_review"
  | "counterparty_review"
  | "agreed_wording"
  | "issuance_requested";

export interface IBankingInstrumentRecord {
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  instrumentType?: string;
  proposedWordingDocumentId?: Types.ObjectId;
  status: BankingInstrumentStatus;
  selectedByUserId?: Types.ObjectId;
  selectedAt?: Date;
  buyerInstructions?: string;
  supplierVisibleInstructions?: string;
  applicantOrganizationId?: Types.ObjectId;
  beneficiaryOrganizationId?: Types.ObjectId;
  internalNotes?: string;
  issuanceRequestedAt?: Date;
  issuanceReference?: string;
}

export type BankingInstrumentRecordLean = LeanDoc<IBankingInstrumentRecord>;

const bankingInstrumentRecordSchema = new Schema<IBankingInstrumentRecord>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    instrumentType: { type: String, trim: true },
    proposedWordingDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    status: {
      type: String,
      enum: [
        "not_selected",
        "draft_wording",
        "internal_review",
        "counterparty_review",
        "agreed_wording",
        "issuance_requested",
      ],
      default: "not_selected",
    },
    selectedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    selectedAt: { type: Date },
    buyerInstructions: { type: String },
    supplierVisibleInstructions: { type: String },
    applicantOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    beneficiaryOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    internalNotes: { type: String },
    issuanceRequestedAt: { type: Date },
    issuanceReference: { type: String, trim: true },
  },
  { timestamps: true },
);

export const BankingInstrumentRecord =
  models.BankingInstrumentRecord ??
  model<IBankingInstrumentRecord>("BankingInstrumentRecord", bankingInstrumentRecordSchema);
