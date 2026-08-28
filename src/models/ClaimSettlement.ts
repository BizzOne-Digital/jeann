import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ClaimSettlementStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "paid"
  | "closed"
  | "rejected";

export interface IClaimSettlement {
  tradeClaimId: Types.ObjectId;
  settlementAmount: Types.Decimal128;
  currency: string;
  responsibleOrganizationId?: Types.ObjectId;
  settlementMethod?: string;
  creditNoteId?: Types.ObjectId;
  paymentRecordId?: Types.ObjectId;
  approvalStatus: ClaimSettlementStatus;
  approvedByUserId?: Types.ObjectId;
  notes?: string;
  createdByUserId: Types.ObjectId;
}

export type ClaimSettlementLean = LeanDoc<IClaimSettlement>;

const claimSettlementSchema = new Schema<IClaimSettlement>(
  {
    tradeClaimId: { type: Schema.Types.ObjectId, ref: "TradeClaim", required: true },
    settlementAmount: { type: Schema.Types.Decimal128, required: true },
    currency: { type: String, required: true },
    responsibleOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    settlementMethod: { type: String },
    creditNoteId: { type: Schema.Types.ObjectId, ref: "CreditNote" },
    paymentRecordId: { type: Schema.Types.ObjectId, ref: "PaymentRecord" },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "paid", "closed", "rejected"],
      default: "draft",
    },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

claimSettlementSchema.index({ tradeClaimId: 1 });

export const ClaimSettlement =
  models.ClaimSettlement ?? model<IClaimSettlement>("ClaimSettlement", claimSettlementSchema);
