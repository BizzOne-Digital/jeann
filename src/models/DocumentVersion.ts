import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DocumentVersionStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "superseded";

export type WatermarkPolicy = "none" | "draft" | "confidential" | "view_only";

export interface IDocumentVersion {
  documentId: Types.ObjectId;
  version: number;
  storageKey: string;
  checksum: string;
  mimeType: string;
  size: number;
  uploadedBy: Types.ObjectId;
  status: DocumentVersionStatus;
  watermarkPolicy: WatermarkPolicy;
}

export type DocumentVersionLean = LeanDoc<IDocumentVersion>;

const IMMUTABLE_STATUSES: DocumentVersionStatus[] = ["approved", "superseded"];

const documentVersionSchema = new Schema<IDocumentVersion>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    version: { type: Number, required: true, min: 1 },
    storageKey: { type: String, required: true },
    checksum: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected", "superseded"],
      default: "draft",
    },
    watermarkPolicy: {
      type: String,
      enum: ["none", "draft", "confidential", "view_only"],
      default: "none",
    },
  },
  { timestamps: true },
);

documentVersionSchema.index({ documentId: 1, version: 1 }, { unique: true });
documentVersionSchema.index({ documentId: 1, status: 1 });

documentVersionSchema.pre("save", function () {
  if (!this.isNew && IMMUTABLE_STATUSES.includes(this.status)) {
    const modified = this.modifiedPaths().filter(
      (path) => path !== "updatedAt" && path !== "status",
    );
    if (modified.length > 0) {
      throw new Error(
        `DocumentVersion ${this._id} is immutable in status "${this.status}"`,
      );
    }
  }
});

export const DocumentVersion =
  models.DocumentVersion ?? model<IDocumentVersion>("DocumentVersion", documentVersionSchema);
