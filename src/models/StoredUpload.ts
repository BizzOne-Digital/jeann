import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export interface IStoredUpload {
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
}

export type StoredUploadLean = LeanDoc<IStoredUpload>;

const storedUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      enum: UPLOAD_FOLDERS,
      required: true,
    },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export const StoredUpload =
  models.StoredUpload ?? model<IStoredUpload>("StoredUpload", storedUploadSchema);
