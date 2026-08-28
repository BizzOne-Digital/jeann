import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DealGroupTransactionType = "buyer_sale" | "supplier_purchase";
export type DealGroupRelationshipType = "buyer_sale" | "supplier_purchase";

export interface IDealGroupTransaction {
  dealGroupId: Types.ObjectId;
  transactionId: Types.ObjectId;
  transactionType: DealGroupTransactionType;
  relationshipType: DealGroupRelationshipType;
  linkedByUserId: Types.ObjectId;
  linkedAt: Date;
  active: boolean;
  unlinkReason?: string;
  unlinkedByUserId?: Types.ObjectId;
  unlinkedAt?: Date;
}

export type DealGroupTransactionLean = LeanDoc<IDealGroupTransaction>;

const dealGroupTransactionSchema = new Schema<IDealGroupTransaction>(
  {
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup", required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    transactionType: {
      type: String,
      enum: ["buyer_sale", "supplier_purchase"],
      required: true,
    },
    relationshipType: {
      type: String,
      enum: ["buyer_sale", "supplier_purchase"],
      required: true,
    },
    linkedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    linkedAt: { type: Date, required: true, default: () => new Date() },
    active: { type: Boolean, default: true },
    unlinkReason: { type: String },
    unlinkedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    unlinkedAt: { type: Date },
  },
  { timestamps: true },
);

dealGroupTransactionSchema.index({ dealGroupId: 1, transactionId: 1 });
dealGroupTransactionSchema.index({ transactionId: 1, active: 1 });

export const DealGroupTransaction =
  models.DealGroupTransaction ??
  model<IDealGroupTransaction>("DealGroupTransaction", dealGroupTransactionSchema);
