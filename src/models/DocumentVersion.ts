import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type DocumentVersionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "sent"
  | "viewed"
  | "signed"
  | "superseded"
  | "archived";

export type WatermarkPolicy = "none" | "draft" | "confidential" | "view_only";

export interface IDocumentVersion {
  documentId: Types.ObjectId;
  version: number;
  storageKey: string;
  checksum: string;
  mimeType: string;
  size: number;
  originalFilename?: string;
  uploadedBy: Types.ObjectId;
  submittedByUserId?: Types.ObjectId;
  submittedAt?: Date;
  status: DocumentVersionStatus;
  watermarkPolicy: WatermarkPolicy;
  locked: boolean;
  structuredData?: Record<string, unknown>;
  selectedClauseIds?: Types.ObjectId[];
  reopenReason?: string;
  reopenedByUserId?: Types.ObjectId;
  supersededAt?: Date;
}

export type DocumentVersionLean = LeanDoc<IDocumentVersion>;

const IMMUTABLE_STATUSES: DocumentVersionStatus[] = [
  "approved",
  "sent",
  "signed",
  "superseded",
  "archived",
];

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
    originalFilename: { type: String, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "changes_requested",
        "approved",
        "rejected",
        "sent",
        "viewed",
        "signed",
        "superseded",
        "archived",
      ],
      default: "draft",
    },
    watermarkPolicy: {
      type: String,
      enum: ["none", "draft", "confidential", "view_only"],
      default: "none",
    },
    locked: { type: Boolean, default: false },
    structuredData: { type: Schema.Types.Mixed },
    selectedClauseIds: [{ type: Schema.Types.ObjectId, ref: "Clause" }],
    reopenReason: { type: String },
    reopenedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    supersededAt: { type: Date },
  },
  { timestamps: true },
);

documentVersionSchema.index({ documentId: 1, version: 1 }, { unique: true });
documentVersionSchema.index({ documentId: 1, status: 1 });

documentVersionSchema.pre("save", function () {
  if (!this.isNew && this.locked) {
    const modified = this.modifiedPaths().filter(
      (path) => path !== "updatedAt" && path !== "status" && path !== "supersededAt",
    );
    if (modified.length > 0) {
      throw new Error(
        `DocumentVersion ${this._id} is locked and cannot be modified`,
      );
    }
  }
  if (!this.isNew && IMMUTABLE_STATUSES.includes(this.status) && !this.locked) {
    const modified = this.modifiedPaths().filter(
      (path) => path !== "updatedAt" && path !== "status" && path !== "supersededAt",
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
