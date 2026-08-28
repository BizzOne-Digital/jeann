import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type LegalHoldStatus = "active" | "released";

export interface ILegalHold {
  holdNumber: string;
  scopeDescription: string;
  organizationIds?: Types.ObjectId[];
  transactionIds?: Types.ObjectId[];
  documentIds?: Types.ObjectId[];
  startDate: Date;
  reason: string;
  authorizedByUserId: Types.ObjectId;
  status: LegalHoldStatus;
  releaseDate?: Date;
  releaseReason?: string;
}

export type LegalHoldLean = LeanDoc<ILegalHold>;

const legalHoldSchema = new Schema<ILegalHold>(
  {
    holdNumber: { type: String, required: true, unique: true },
    scopeDescription: { type: String, required: true },
    organizationIds: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    transactionIds: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    documentIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    startDate: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    authorizedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "released"], default: "active" },
    releaseDate: { type: Date },
    releaseReason: { type: String },
  },
  { timestamps: true },
);

export const LegalHold =
  models.LegalHold ?? model<ILegalHold>("LegalHold", legalHoldSchema);
