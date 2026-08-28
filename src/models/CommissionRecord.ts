import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CommissionCalculationType =
  | "percent_buyer_sales"
  | "percent_procurement"
  | "percent_gross_margin"
  | "fixed"
  | "per_unit"
  | "custom_approved";

export type CommissionApprovalStatus = "draft" | "pending_approval" | "approved" | "rejected";
export type CommissionPaymentStatus = "unpaid" | "scheduled" | "partial" | "paid";

export interface ICommissionRecord {
  transactionId?: Types.ObjectId;
  shipmentLotId?: Types.ObjectId;
  agentName: string;
  commissionType: CommissionCalculationType;
  calculationBasis?: string;
  ratePercent?: Types.Decimal128;
  fixedAmount?: Types.Decimal128;
  currency: string;
  calculatedAmount: Types.Decimal128;
  dueDate?: Date;
  approvalStatus: CommissionApprovalStatus;
  paymentStatus: CommissionPaymentStatus;
  supportingAgreementRef?: string;
  createdByUserId: Types.ObjectId;
  approvedByUserId?: Types.ObjectId;
}

export type CommissionRecordLean = LeanDoc<ICommissionRecord>;

const commissionRecordSchema = new Schema<ICommissionRecord>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot" },
    agentName: { type: String, required: true },
    commissionType: {
      type: String,
      enum: ["percent_buyer_sales", "percent_procurement", "percent_gross_margin", "fixed", "per_unit", "custom_approved"],
      required: true,
    },
    calculationBasis: { type: String },
    ratePercent: { type: Schema.Types.Decimal128 },
    fixedAmount: { type: Schema.Types.Decimal128 },
    currency: { type: String, required: true },
    calculatedAmount: { type: Schema.Types.Decimal128, required: true },
    dueDate: { type: Date },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected"],
      default: "draft",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "scheduled", "partial", "paid"],
      default: "unpaid",
    },
    supportingAgreementRef: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const CommissionRecord =
  models.CommissionRecord ?? model<ICommissionRecord>("CommissionRecord", commissionRecordSchema);
