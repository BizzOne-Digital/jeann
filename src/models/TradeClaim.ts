import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TradeClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "information_required"
  | "counterparty_response_pending"
  | "accepted"
  | "partially_accepted"
  | "rejected"
  | "settlement_pending"
  | "resolved"
  | "closed"
  | "withdrawn";

export interface ITradeClaim {
  shipmentLotId: Types.ObjectId;
  transactionId: Types.ObjectId;
  claimNumber: string;
  claimType: string;
  claimantOrganizationId: Types.ObjectId;
  respondentOrganizationId?: Types.ObjectId;
  description: string;
  quantityAffected?: Types.Decimal128;
  claimedAmountPlaceholder?: Types.Decimal128;
  currency?: string;
  evidence?: string;
  submittedDate?: Date;
  responseDeadline?: Date;
  status: TradeClaimStatus;
  resolutionSummary?: string;
  closedDate?: Date;
  buyerVisible: boolean;
  supplierVisible: boolean;
  createdByUserId: Types.ObjectId;
}

export type TradeClaimLean = LeanDoc<ITradeClaim>;

const tradeClaimSchema = new Schema<ITradeClaim>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    claimNumber: { type: String, required: true, trim: true },
    claimType: { type: String, required: true },
    claimantOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    respondentOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    description: { type: String, required: true },
    quantityAffected: { type: Schema.Types.Decimal128 },
    claimedAmountPlaceholder: { type: Schema.Types.Decimal128 },
    currency: { type: String },
    evidence: { type: String },
    submittedDate: { type: Date },
    responseDeadline: { type: Date },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "information_required",
        "counterparty_response_pending",
        "accepted",
        "partially_accepted",
        "rejected",
        "settlement_pending",
        "resolved",
        "closed",
        "withdrawn",
      ],
      default: "draft",
    },
    resolutionSummary: { type: String },
    closedDate: { type: Date },
    buyerVisible: { type: Boolean, default: false },
    supplierVisible: { type: Boolean, default: false },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

tradeClaimSchema.index({ claimNumber: 1 }, { unique: true });
tradeClaimSchema.index({ shipmentLotId: 1 });

export const TradeClaim =
  models.TradeClaim ?? model<ITradeClaim>("TradeClaim", tradeClaimSchema);
