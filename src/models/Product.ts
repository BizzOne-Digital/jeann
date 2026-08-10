import { Schema, model, models, Types } from "mongoose";
import {
  claimSchema,
  seoSchema,
  type ClaimFields,
  type LeanDoc,
  type SeoFields,
} from "./shared";

export type ProductStatus =
  | "draft"
  | "pending_verification"
  | "published"
  | "archived";

export interface ProductGalleryItem {
  storageKey: string;
  alt?: string;
  caption?: string;
  displayOrder: number;
}

export interface ProductDocumentCategory {
  key: string;
  label: string;
  required: boolean;
}

export interface ProductClaims {
  certified: ClaimFields;
  inStock: ClaimFields;
  readyToShip: ClaimFields;
  specificOrigin: ClaimFields;
}

export interface IProduct {
  categoryId: Types.ObjectId;
  slug: string;
  name: string;
  overview?: string;
  status: ProductStatus;
  availabilityText?: string;
  originOptions: string[];
  gradeSummary?: string;
  packagingOptionIds: Types.ObjectId[];
  inspectionOptions: string[];
  incotermOptions: string[];
  documentCategories: ProductDocumentCategory[];
  gallery: ProductGalleryItem[];
  minOrderText?: string;
  claims: ProductClaims;
  seo?: SeoFields;
  displayOrder: number;
  requiresAdminVerification: boolean;
  deletedAt?: Date;
}

export type ProductLean = LeanDoc<IProduct>;

const galleryItemSchema = new Schema<ProductGalleryItem>(
  {
    storageKey: { type: String, required: true },
    alt: { type: String },
    caption: { type: String },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const documentCategorySchema = new Schema<ProductDocumentCategory>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
  { _id: false },
);

const claimsSchema = new Schema<ProductClaims>(
  {
    certified: { type: claimSchema, default: () => ({ enabled: false }) },
    inStock: { type: claimSchema, default: () => ({ enabled: false }) },
    readyToShip: { type: claimSchema, default: () => ({ enabled: false }) },
    specificOrigin: { type: claimSchema, default: () => ({ enabled: false }) },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    slug: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    overview: { type: String },
    status: {
      type: String,
      enum: ["draft", "pending_verification", "published", "archived"],
      default: "draft",
    },
    availabilityText: { type: String },
    originOptions: [{ type: String }],
    gradeSummary: { type: String },
    packagingOptionIds: [{ type: Schema.Types.ObjectId, ref: "PackagingType" }],
    inspectionOptions: [{ type: String }],
    incotermOptions: [{ type: String }],
    documentCategories: [documentCategorySchema],
    gallery: [galleryItemSchema],
    minOrderText: { type: String },
    claims: { type: claimsSchema, default: () => ({}) },
    seo: seoSchema,
    displayOrder: { type: Number, default: 0 },
    requiresAdminVerification: { type: Boolean, default: true },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
productSchema.index({ categoryId: 1, status: 1, displayOrder: 1 });
productSchema.index({ status: 1, requiresAdminVerification: 1 });

export const Product = models.Product ?? model<IProduct>("Product", productSchema);
