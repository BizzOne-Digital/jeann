import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type AIKnowledgeVisibility =
  | "public"
  | "internal"
  | "buyer_organization"
  | "supplier_organization"
  | "transaction_restricted";

export type AIKnowledgeApprovalStatus = "draft" | "pending" | "approved" | "rejected" | "expired";

export interface IAIKnowledgeSource {
  name: string;
  sourceType: string;
  visibility: AIKnowledgeVisibility;
  organizationId?: Types.ObjectId;
  productId?: Types.ObjectId;
  transactionId?: Types.ObjectId;
  sourceDocumentId?: Types.ObjectId;
  approvalStatus: AIKnowledgeApprovalStatus;
  effectiveFrom?: Date;
  expiryDate?: Date;
  indexedAt?: Date;
  createdByUserId: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
}

export type AIKnowledgeSourceLean = LeanDoc<IAIKnowledgeSource>;

const aiKnowledgeSourceSchema = new Schema<IAIKnowledgeSource>(
  {
    name: { type: String, required: true },
    sourceType: { type: String, required: true },
    visibility: {
      type: String,
      enum: ["public", "internal", "buyer_organization", "supplier_organization", "transaction_restricted"],
      default: "internal",
    },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    sourceDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "expired"],
      default: "draft",
    },
    effectiveFrom: { type: Date },
    expiryDate: { type: Date },
    indexedAt: { type: Date },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const AIKnowledgeSource =
  models.AIKnowledgeSource ?? model<IAIKnowledgeSource>("AIKnowledgeSource", aiKnowledgeSourceSchema);
