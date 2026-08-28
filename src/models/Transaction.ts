import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TransactionSide = "buyer" | "supplier";
export type TransactionType = "buyer_sale" | "supplier_purchase";

export type TransactionOperationalStatus =
  | "draft"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type TransactionWorkflowStatus =
  | "draft"
  | "submitted"
  | "qualification"
  | "more_information_required"
  | "qualified"
  | "declined"
  | "on_hold"
  | "procurement_need_identified"
  | "supplier_selection"
  | "offer_pending"
  | "offer_draft"
  | "offer_under_review"
  | "offer_changes_requested"
  | "offer_approved"
  | "offer_sent"
  | "icpo_pending"
  | "icpo_draft"
  | "icpo_submitted"
  | "icpo_under_review"
  | "icpo_changes_requested"
  | "icpo_approved"
  | "icpo_sent"
  | "contract_pending"
  | "contract_draft"
  | "contract_under_review"
  | "contract_changes_requested"
  | "contract_approved"
  | "awaiting_buyer_signature"
  | "awaiting_finekarts_signature"
  | "awaiting_supplier_signature"
  | "contract_executed"
  | "banking_setup"
  | "instrument_issuance_requested"
  | "cancelled";

export interface FinanceSnapshotLine {
  label: string;
  currency: string;
  amountDecimal: Types.Decimal128;
  isEstimate: boolean;
}

export interface FinanceSnapshot {
  currency: string;
  lines: FinanceSnapshotLine[];
  capturedAt: Date;
}

export interface ITransaction {
  transactionNumber: string;
  transactionType: TransactionType;
  side: TransactionSide;
  organizationId: Types.ObjectId;
  counterpartyOrgId?: Types.ObjectId;
  linkedTransactionId?: Types.ObjectId;
  sourcePurchaseRequestId?: Types.ObjectId;
  sourceSupplierOfferId?: Types.ObjectId;
  productId?: Types.ObjectId;
  status: TransactionOperationalStatus;
  workflowStatus: TransactionWorkflowStatus;
  currentStepKey?: string;
  templateId?: Types.ObjectId;
  assignedTradeManagerId?: Types.ObjectId;
  assignedReviewerIds?: Types.ObjectId[];
  priority?: string;
  internalNotes?: string;
  buyerVisibleNotes?: string;
  supplierVisibleNotes?: string;
  submittedAt?: Date;
  closedAt?: Date;
  holdReason?: string;
  cancellationReason?: string;
  offerSkipped?: boolean;
  offerSkipReason?: string;
  offerSkipApprovedByUserId?: Types.ObjectId;
  offerSkippedAt?: Date;
  financeSnapshot?: FinanceSnapshot;
  createdBy: Types.ObjectId;
  deletedAt?: Date;
}

export type TransactionLean = LeanDoc<ITransaction>;

const financeSnapshotLineSchema = new Schema<FinanceSnapshotLine>(
  {
    label: { type: String, required: true },
    currency: { type: String, required: true, uppercase: true, trim: true },
    amountDecimal: { type: Schema.Types.Decimal128, required: true },
    isEstimate: { type: Boolean, default: false },
  },
  { _id: false },
);

const financeSnapshotSchema = new Schema<FinanceSnapshot>(
  {
    currency: { type: String, required: true, uppercase: true, trim: true },
    lines: [financeSnapshotLineSchema],
    capturedAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const WORKFLOW_STATUSES: TransactionWorkflowStatus[] = [
  "draft",
  "submitted",
  "qualification",
  "more_information_required",
  "qualified",
  "declined",
  "on_hold",
  "procurement_need_identified",
  "supplier_selection",
  "offer_pending",
  "offer_draft",
  "offer_under_review",
  "offer_changes_requested",
  "offer_approved",
  "offer_sent",
  "icpo_pending",
  "icpo_draft",
  "icpo_submitted",
  "icpo_under_review",
  "icpo_changes_requested",
  "icpo_approved",
  "icpo_sent",
  "contract_pending",
  "contract_draft",
  "contract_under_review",
  "contract_changes_requested",
  "contract_approved",
  "awaiting_buyer_signature",
  "awaiting_finekarts_signature",
  "awaiting_supplier_signature",
  "contract_executed",
  "banking_setup",
  "instrument_issuance_requested",
  "cancelled",
];

const transactionSchema = new Schema<ITransaction>(
  {
    transactionNumber: { type: String, required: true, trim: true },
    transactionType: {
      type: String,
      enum: ["buyer_sale", "supplier_purchase"],
      default: "buyer_sale",
    },
    side: { type: String, enum: ["buyer", "supplier"], required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    counterpartyOrgId: { type: Schema.Types.ObjectId, ref: "Organization" },
    linkedTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    sourcePurchaseRequestId: { type: Schema.Types.ObjectId, ref: "PurchaseRequest" },
    sourceSupplierOfferId: { type: Schema.Types.ObjectId, ref: "SupplierOffer" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    status: {
      type: String,
      enum: ["draft", "active", "on_hold", "completed", "cancelled"],
      default: "draft",
    },
    workflowStatus: {
      type: String,
      enum: WORKFLOW_STATUSES,
      default: "draft",
    },
    currentStepKey: { type: String },
    templateId: { type: Schema.Types.ObjectId, ref: "WorkflowTemplate" },
    assignedTradeManagerId: { type: Schema.Types.ObjectId, ref: "User" },
    assignedReviewerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    priority: { type: String, trim: true },
    internalNotes: { type: String },
    buyerVisibleNotes: { type: String },
    supplierVisibleNotes: { type: String },
    submittedAt: { type: Date },
    closedAt: { type: Date },
    holdReason: { type: String },
    cancellationReason: { type: String },
    offerSkipped: { type: Boolean, default: false },
    offerSkipReason: { type: String },
    offerSkipApprovedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    offerSkippedAt: { type: Date },
    financeSnapshot: financeSnapshotSchema,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

transactionSchema.index({ transactionNumber: 1 }, { unique: true });
transactionSchema.index({ organizationId: 1, workflowStatus: 1, createdAt: -1 });
transactionSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
transactionSchema.index({ counterpartyOrgId: 1, status: 1 });
transactionSchema.index({ linkedTransactionId: 1 }, { sparse: true });
transactionSchema.index({ sourcePurchaseRequestId: 1 }, { sparse: true });
transactionSchema.index({ sourceSupplierOfferId: 1 }, { sparse: true });
transactionSchema.index({ transactionType: 1, organizationId: 1, workflowStatus: 1 });

export const Transaction =
  models.Transaction ?? model<ITransaction>("Transaction", transactionSchema);
