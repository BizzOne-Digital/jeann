import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type WordingVersionSource =
  | "contract_proposal"
  | "buyer_draft"
  | "supplier_draft"
  | "finekarts_draft"
  | "bank_issued"
  | "amendment";

export type WordingVersionStatus =
  | "draft"
  | "under_internal_review"
  | "changes_requested"
  | "approved_internally"
  | "counterparty_review"
  | "counterparty_agreed"
  | "issued_copy_uploaded"
  | "superseded"
  | "archived";

export interface IInstrumentWordingVersion {
  bankingInstrumentId: Types.ObjectId;
  version: number;
  source: WordingVersionSource;
  structuredSnapshot?: Record<string, unknown>;
  linkedDocumentId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  submittedByUserId?: Types.ObjectId;
  status: WordingVersionStatus;
  reviewDate?: Date;
  approvalDate?: Date;
  supersededAt?: Date;
  checksum?: string;
  attachments: AttachmentFields[];
}

export type InstrumentWordingVersionLean = LeanDoc<IInstrumentWordingVersion>;

const instrumentWordingVersionSchema = new Schema<IInstrumentWordingVersion>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    version: { type: Number, required: true, min: 1 },
    source: {
      type: String,
      enum: [
        "contract_proposal",
        "buyer_draft",
        "supplier_draft",
        "finekarts_draft",
        "bank_issued",
        "amendment",
      ],
      required: true,
    },
    structuredSnapshot: { type: Schema.Types.Mixed },
    linkedDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        "draft",
        "under_internal_review",
        "changes_requested",
        "approved_internally",
        "counterparty_review",
        "counterparty_agreed",
        "issued_copy_uploaded",
        "superseded",
        "archived",
      ],
      default: "draft",
    },
    reviewDate: { type: Date },
    approvalDate: { type: Date },
    supersededAt: { type: Date },
    checksum: { type: String },
    attachments: [attachmentSchema],
  },
  { timestamps: true },
);

instrumentWordingVersionSchema.index({ bankingInstrumentId: 1, version: 1 }, { unique: true });

export const InstrumentWordingVersion =
  models.InstrumentWordingVersion ??
  model<IInstrumentWordingVersion>("InstrumentWordingVersion", instrumentWordingVersionSchema);
