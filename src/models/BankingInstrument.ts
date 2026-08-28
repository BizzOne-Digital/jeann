import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingInstrumentLifecycleStatus =
  | "not_selected"
  | "draft_wording"
  | "internal_review"
  | "changes_requested"
  | "counterparty_review"
  | "counterparty_agreed"
  | "issuance_requested"
  | "issued_copy_uploaded"
  | "awaiting_advice_evidence"
  | "advice_evidence_recorded"
  | "instrument_comparison_required"
  | "amendment_required"
  | "active"
  | "presentation_pending"
  | "presented"
  | "complying"
  | "discrepant"
  | "waiver_pending"
  | "honoured"
  | "refused"
  | "expired"
  | "cancelled"
  | "closed";

export type BankingTransactionSide = "buyer_sale" | "supplier_purchase";

export type AdviceAuthenticationStatus =
  | "not_recorded"
  | "awaiting_evidence"
  | "evidence_uploaded"
  | "evidence_reviewed"
  | "recorded_by_authorized_human";

export interface IBankingInstrument {
  instrumentId: string;
  transactionId: Types.ObjectId;
  transactionSide: BankingTransactionSide;
  instrumentTypeCode: string;
  applicantOrganizationId: Types.ObjectId;
  beneficiaryOrganizationId: Types.ObjectId;
  issuingBankId?: Types.ObjectId;
  advisingBankId?: Types.ObjectId;
  confirmingBankId?: Types.ObjectId;
  nominatedBankId?: Types.ObjectId;
  instrumentReference?: string;
  currency: string;
  amount: Types.Decimal128;
  amountTolerance?: string;
  availabilityMethod?: string;
  sightDeferredTerms?: string;
  applicableRules?: string;
  issueDate?: Date;
  expiryDate?: Date;
  expiryPlace?: string;
  latestShipmentDate?: Date;
  presentationPeriod?: string;
  partialShipmentAllowed?: boolean;
  transshipmentAllowed?: boolean;
  loadingPortPlace?: string;
  destinationPortPlace?: string;
  goodsDescription?: string;
  requiredDocumentSnapshot?: string[];
  bankChargeAllocation?: string;
  confirmationRequired?: boolean;
  currentStatus: BankingInstrumentLifecycleStatus;
  currentVersion: number;
  adviceAuthenticationStatus: AdviceAuthenticationStatus;
  adviceDate?: Date;
  adviceReference?: string;
  adviceEvidenceSource?: string;
  adviceReviewedByUserId?: Types.ObjectId;
  adviceNotes?: string;
  issuedCopyDocumentId?: Types.ObjectId;
  issuedCopyUploadedAt?: Date;
  issuedCopyVerificationStatus: "unverified" | "evidence_reviewed" | "recorded";
  issuanceRequestedAt?: Date;
  issuanceRequestReference?: string;
  createdByUserId: Types.ObjectId;
  selectedByUserId?: Types.ObjectId;
  selectedAt?: Date;
  legacyRecordId?: Types.ObjectId;
}

export type BankingInstrumentLean = LeanDoc<IBankingInstrument>;

const bankingInstrumentSchema = new Schema<IBankingInstrument>(
  {
    instrumentId: { type: String, required: true, trim: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true, unique: true },
    transactionSide: {
      type: String,
      enum: ["buyer_sale", "supplier_purchase"],
      required: true,
    },
    instrumentTypeCode: { type: String, required: true, trim: true },
    applicantOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    beneficiaryOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    issuingBankId: { type: Schema.Types.ObjectId, ref: "BankOrganization" },
    advisingBankId: { type: Schema.Types.ObjectId, ref: "BankOrganization" },
    confirmingBankId: { type: Schema.Types.ObjectId, ref: "BankOrganization" },
    nominatedBankId: { type: Schema.Types.ObjectId, ref: "BankOrganization" },
    instrumentReference: { type: String, trim: true },
    currency: { type: String, required: true, uppercase: true, trim: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    amountTolerance: { type: String },
    availabilityMethod: { type: String },
    sightDeferredTerms: { type: String },
    applicableRules: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    expiryPlace: { type: String },
    latestShipmentDate: { type: Date },
    presentationPeriod: { type: String },
    partialShipmentAllowed: { type: Boolean },
    transshipmentAllowed: { type: Boolean },
    loadingPortPlace: { type: String },
    destinationPortPlace: { type: String },
    goodsDescription: { type: String },
    requiredDocumentSnapshot: [{ type: String }],
    bankChargeAllocation: { type: String },
    confirmationRequired: { type: Boolean, default: false },
    currentStatus: {
      type: String,
      enum: [
        "not_selected",
        "draft_wording",
        "internal_review",
        "changes_requested",
        "counterparty_review",
        "counterparty_agreed",
        "issuance_requested",
        "issued_copy_uploaded",
        "awaiting_advice_evidence",
        "advice_evidence_recorded",
        "instrument_comparison_required",
        "amendment_required",
        "active",
        "presentation_pending",
        "presented",
        "complying",
        "discrepant",
        "waiver_pending",
        "honoured",
        "refused",
        "expired",
        "cancelled",
        "closed",
      ],
      default: "draft_wording",
    },
    currentVersion: { type: Number, default: 1, min: 1 },
    adviceAuthenticationStatus: {
      type: String,
      enum: [
        "not_recorded",
        "awaiting_evidence",
        "evidence_uploaded",
        "evidence_reviewed",
        "recorded_by_authorized_human",
      ],
      default: "not_recorded",
    },
    adviceDate: { type: Date },
    adviceReference: { type: String },
    adviceEvidenceSource: { type: String },
    adviceReviewedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    adviceNotes: { type: String },
    issuedCopyDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    issuedCopyUploadedAt: { type: Date },
    issuedCopyVerificationStatus: {
      type: String,
      enum: ["unverified", "evidence_reviewed", "recorded"],
      default: "unverified",
    },
    issuanceRequestedAt: { type: Date },
    issuanceRequestReference: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    selectedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    selectedAt: { type: Date },
    legacyRecordId: { type: Schema.Types.ObjectId, ref: "BankingInstrumentRecord" },
  },
  { timestamps: true },
);

bankingInstrumentSchema.index({ instrumentId: 1 }, { unique: true });
bankingInstrumentSchema.index({ transactionSide: 1, currentStatus: 1 });

export const BankingInstrument =
  models.BankingInstrument ?? model<IBankingInstrument>("BankingInstrument", bankingInstrumentSchema);
