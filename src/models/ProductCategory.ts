import { Schema, model, models } from "mongoose";
import { seoSchema, type LeanDoc, type SeoFields } from "./shared";

export type ProductCategoryStatus = "draft" | "published" | "archived";

export interface IProductCategory {
  slug: string;
  name: string;
  summary?: string;
  displayOrder: number;
  status: ProductCategoryStatus;
  seo?: SeoFields;
  coverImage?: string;
  deletedAt?: Date;
}

export type ProductCategoryLean = LeanDoc<IProductCategory>;

const productCategorySchema = new Schema<IProductCategory>(
  {
    slug: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    seo: seoSchema,
    coverImage: { type: String },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

productCategorySchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
productCategorySchema.index({ status: 1, displayOrder: 1 });

export const ProductCategory =
  models.ProductCategory ?? model<IProductCategory>("ProductCategory", productCategorySchema);
