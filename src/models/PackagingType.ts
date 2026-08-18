import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type PackagingMode = "dry" | "liquid" | "unpackaged";
export type PackagingTypeStatus = "active" | "inactive";

export interface IPackagingType {
  slug: string;
  name: string;
  mode: PackagingMode;
  description?: string;
  advantages?: string[];
  displayOrder: number;
  status: PackagingTypeStatus;
  deletedAt?: Date;
}

export type PackagingTypeLean = LeanDoc<IPackagingType>;

const packagingTypeSchema = new Schema<IPackagingType>(
  {
    slug: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    mode: {
      type: String,
      enum: ["dry", "liquid", "unpackaged"],
      required: true,
    },
    description: { type: String },
    advantages: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

packagingTypeSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
packagingTypeSchema.index({ mode: 1, status: 1, displayOrder: 1 });

export const PackagingType =
  models.PackagingType ?? model<IPackagingType>("PackagingType", packagingTypeSchema);
