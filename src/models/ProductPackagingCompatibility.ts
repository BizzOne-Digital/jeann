import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ProductPackagingCompatibilityStatus = "active" | "inactive";

export interface IProductPackagingCompatibility {
  productId: Types.ObjectId;
  packagingTypeId: Types.ObjectId;
  notes?: string;
  status: ProductPackagingCompatibilityStatus;
}

export type ProductPackagingCompatibilityLean = LeanDoc<IProductPackagingCompatibility>;

const productPackagingCompatibilitySchema = new Schema<IProductPackagingCompatibility>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    packagingTypeId: {
      type: Schema.Types.ObjectId,
      ref: "PackagingType",
      required: true,
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

productPackagingCompatibilitySchema.index(
  { productId: 1, packagingTypeId: 1 },
  { unique: true },
);
productPackagingCompatibilitySchema.index({ packagingTypeId: 1, status: 1 });

export const ProductPackagingCompatibility =
  models.ProductPackagingCompatibility ??
  model<IProductPackagingCompatibility>(
    "ProductPackagingCompatibility",
    productPackagingCompatibilitySchema,
  );
