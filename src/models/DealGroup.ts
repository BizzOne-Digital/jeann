import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DealGroupStatus =
  | "draft"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type SpecificationCompatibilityStatus =
  | "compatible"
  | "compatible_with_warnings"
  | "incompatible"
  | "requires_manual_review"
  | "not_evaluated";

export interface IDealGroup {
  dealGroupNumber: string;
  name: string;
  description?: string;
  productId?: Types.ObjectId;
  productName?: string;
  specificationCompatibilityStatus: SpecificationCompatibilityStatus;
  status: DealGroupStatus;
  leadTradeManagerId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  internalNotes?: string;
}

export type DealGroupLean = LeanDoc<IDealGroup>;

const dealGroupSchema = new Schema<IDealGroup>(
  {
    dealGroupNumber: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, trim: true },
    specificationCompatibilityStatus: {
      type: String,
      enum: [
        "compatible",
        "compatible_with_warnings",
        "incompatible",
        "requires_manual_review",
        "not_evaluated",
      ],
      default: "not_evaluated",
    },
    status: {
      type: String,
      enum: ["draft", "active", "on_hold", "completed", "cancelled"],
      default: "draft",
    },
    leadTradeManagerId: { type: Schema.Types.ObjectId, ref: "User" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    internalNotes: { type: String },
  },
  { timestamps: true },
);

dealGroupSchema.index({ dealGroupNumber: 1 }, { unique: true });
dealGroupSchema.index({ status: 1, createdAt: -1 });

export const DealGroup =
  models.DealGroup ?? model<IDealGroup>("DealGroup", dealGroupSchema);
