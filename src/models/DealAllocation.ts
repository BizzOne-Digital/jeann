import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DealAllocationStatus =
  | "proposed"
  | "confirmed"
  | "partially_fulfilled"
  | "fulfilled"
  | "cancelled";

export interface IDealAllocation {
  dealGroupId: Types.ObjectId;
  buyerTransactionId: Types.ObjectId;
  supplierTransactionId: Types.ObjectId;
  productId?: Types.ObjectId;
  specificationVersionId?: Types.ObjectId;
  allocatedQuantity: Types.Decimal128;
  unit: string;
  allocationStatus: DealAllocationStatus;
  internalNote?: string;
  createdByUserId: Types.ObjectId;
}

export type DealAllocationLean = LeanDoc<IDealAllocation>;

const dealAllocationSchema = new Schema<IDealAllocation>(
  {
    dealGroupId: { type: Schema.Types.ObjectId, ref: "DealGroup", required: true },
    buyerTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    supplierTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    specificationVersionId: {
      type: Schema.Types.ObjectId,
      ref: "ProductSpecificationVersion",
    },
    allocatedQuantity: { type: Schema.Types.Decimal128, required: true },
    unit: { type: String, required: true, trim: true },
    allocationStatus: {
      type: String,
      enum: ["proposed", "confirmed", "partially_fulfilled", "fulfilled", "cancelled"],
      default: "proposed",
    },
    internalNote: { type: String },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

dealAllocationSchema.index({ dealGroupId: 1, allocationStatus: 1 });
dealAllocationSchema.index({ buyerTransactionId: 1 });
dealAllocationSchema.index({ supplierTransactionId: 1 });

export const DealAllocation =
  models.DealAllocation ?? model<IDealAllocation>("DealAllocation", dealAllocationSchema);
