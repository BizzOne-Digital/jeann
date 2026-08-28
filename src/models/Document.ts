import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DocumentSensitivity = "public" | "internal" | "confidential" | "restricted";
export type DocumentRetentionState = "active" | "archived" | "pending_deletion";

export type TradeDocumentType =
  | "loi"
  | "sco"
  | "fco"
  | "icpo"
  | "spa"
  | "proposed_lc_wording"
  | "contract_amendment"
  | "other";

export type TradeDocumentStatus =
  | "draft"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "sent"
  | "viewed"
  | "signed"
  | "superseded"
  | "archived";

export interface IDocument {
  organizationId: Types.ObjectId;
  transactionId?: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  checklistRequirementId?: Types.ObjectId;
  shippingDocumentType?: string;
  bankingVisible?: boolean;
  stepKey?: string;
  documentType?: TradeDocumentType;
  templateKey?: string;
  templateVersion?: number;
  category: string;
  title: string;
  sensitivity: DocumentSensitivity;
  retentionState: DocumentRetentionState;
  buyerVisible: boolean;
  supplierVisible: boolean;
  internalOnly: boolean;
  workflowStatus: TradeDocumentStatus;
  currentVersionId?: Types.ObjectId;
  createdByUserId?: Types.ObjectId;
  ownerOrganizationId?: Types.ObjectId;
  deletedAt?: Date;
}

export type DocumentLean = LeanDoc<IDocument>;

const documentSchema = new Schema<IDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    checklistRequirementId: {
      type: Schema.Types.ObjectId,
      ref: "ShipmentDocumentRequirement",
    },
    shippingDocumentType: { type: String, trim: true },
    bankingVisible: { type: Boolean, default: false },
    stepKey: { type: String, trim: true },
    documentType: {
      type: String,
      enum: ["loi", "sco", "fco", "icpo", "spa", "proposed_lc_wording", "contract_amendment", "other"],
    },
    templateKey: { type: String, trim: true },
    templateVersion: { type: Number, min: 1 },
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    sensitivity: {
      type: String,
      enum: ["public", "internal", "confidential", "restricted"],
      default: "internal",
    },
    retentionState: {
      type: String,
      enum: ["active", "archived", "pending_deletion"],
      default: "active",
    },
    buyerVisible: { type: Boolean, default: false },
    supplierVisible: { type: Boolean, default: false },
    internalOnly: { type: Boolean, default: true },
    workflowStatus: {
      type: String,
      enum: [
        "draft",
        "under_review",
        "changes_requested",
        "approved",
        "sent",
        "viewed",
        "signed",
        "superseded",
        "archived",
      ],
      default: "draft",
    },
    currentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    ownerOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

documentSchema.index({ organizationId: 1, transactionId: 1, category: 1 });
documentSchema.index({ transactionId: 1, documentType: 1 });
documentSchema.index({ transactionId: 1, stepKey: 1 });
documentSchema.index({ shipmentLotId: 1, category: 1 });

export const Document = models.Document ?? model<IDocument>("Document", documentSchema);
