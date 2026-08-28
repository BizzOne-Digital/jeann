import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IProductSpecificationVersion {
  productId: Types.ObjectId;
  categoryId?: Types.ObjectId;
  specificationName: string;
  version: number;
  fields: Record<string, unknown>;
  origin?: string;
  packagingOptions?: string[];
  active: boolean;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
}

export type ProductSpecificationVersionLean = LeanDoc<IProductSpecificationVersion>;

const productSpecificationVersionSchema = new Schema<IProductSpecificationVersion>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "ProductCategory" },
    specificationName: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 1 },
    fields: { type: Schema.Types.Mixed, default: {} },
    origin: { type: String, trim: true },
    packagingOptions: [{ type: String }],
    active: { type: Boolean, default: false },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

productSpecificationVersionSchema.index({ productId: 1, version: 1 }, { unique: true });
productSpecificationVersionSchema.index({ productId: 1, active: 1 });

export const ProductSpecificationVersion =
  models.ProductSpecificationVersion ??
  model<IProductSpecificationVersion>("ProductSpecificationVersion", productSpecificationVersionSchema);
