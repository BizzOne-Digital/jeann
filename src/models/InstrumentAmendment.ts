import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type InstrumentAmendmentStatus =
  | "draft"
  | "internal_review"
  | "changes_requested"
  | "internally_approved"
  | "counterparty_review"
  | "counterparty_accepted"
  | "counterparty_rejected"
  | "submitted_to_bank"
  | "bank_accepted"
  | "bank_rejected"
  | "withdrawn"
  | "superseded";

export interface IInstrumentAmendment {
  bankingInstrumentId: Types.ObjectId;
  amendmentNumber: number;
  requestedByUserId: Types.ObjectId;
  requestingOrganizationId: Types.ObjectId;
  reason: string;
  proposedChanges: string;
  previousValueSnapshot?: Record<string, unknown>;
  proposedValueSnapshot?: Record<string, unknown>;
  supportingDocumentId?: Types.ObjectId;
  feeResponsibilityStatus?: string;
  internalApprovalStatus: string;
  counterpartyStatus: string;
  bankRequestDate?: Date;
  bankResponse?: string;
  bankResponseDocumentId?: Types.ObjectId;
  effectiveDate?: Date;
  status: InstrumentAmendmentStatus;
  resultingWordingVersionId?: Types.ObjectId;
}

export type InstrumentAmendmentLean = LeanDoc<IInstrumentAmendment>;

const instrumentAmendmentSchema = new Schema<IInstrumentAmendment>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    amendmentNumber: { type: Number, required: true, min: 1 },
    requestedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestingOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    reason: { type: String, required: true },
    proposedChanges: { type: String, required: true },
    previousValueSnapshot: { type: Schema.Types.Mixed },
    proposedValueSnapshot: { type: Schema.Types.Mixed },
    supportingDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    feeResponsibilityStatus: { type: String },
    internalApprovalStatus: { type: String, default: "pending" },
    counterpartyStatus: { type: String, default: "pending" },
    bankRequestDate: { type: Date },
    bankResponse: { type: String },
    bankResponseDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    effectiveDate: { type: Date },
    status: {
      type: String,
      enum: [
        "draft",
        "internal_review",
        "changes_requested",
        "internally_approved",
        "counterparty_review",
        "counterparty_accepted",
        "counterparty_rejected",
        "submitted_to_bank",
        "bank_accepted",
        "bank_rejected",
        "withdrawn",
        "superseded",
      ],
      default: "draft",
    },
    resultingWordingVersionId: { type: Schema.Types.ObjectId, ref: "InstrumentWordingVersion" },
  },
  { timestamps: true },
);

instrumentAmendmentSchema.index({ bankingInstrumentId: 1, amendmentNumber: 1 }, { unique: true });

export const InstrumentAmendment =
  models.InstrumentAmendment ??
  model<IInstrumentAmendment>("InstrumentAmendment", instrumentAmendmentSchema);
