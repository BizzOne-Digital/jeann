import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type RequestedDocumentStatus = "requested" | "received_from_supplier" | "provided_to_buyer";

/**
 * One document or certificate that belongs to ONE transaction. The documents are whatever the buyer asks
 * for, which Finekarts cannot know in advance, so the name is free text and nothing is imposed by the
 * platform. The same item is mirrored on the linked supplier order, because Finekarts asks its supplier
 * for exactly what the buyer asked Finekarts for.
 */
export interface IRequestedDocument {
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  side: "buyer" | "supplier";
  title: string;
  notes?: string;
  requestedBy: "buyer" | "staff";
  requestedByUserId?: Types.ObjectId;
  status: RequestedDocumentStatus;
  /**
   * The documents process repeats every month while the contract is filled in only once. An item of a monthly
   * round carries the month, for example "2026-12". Items without it belong to the contract itself.
   */
  cycleLabel?: string;
  /** The matching item on the linked transaction (the supplier order, for a buyer item). */
  mirroredItemId?: Types.ObjectId;
  deletedAt?: Date | null;
}

export type RequestedDocumentLean = LeanDoc<IRequestedDocument>;

const requestedDocumentSchema = new Schema<IRequestedDocument>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    side: { type: String, enum: ["buyer", "supplier"], required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    notes: { type: String, trim: true, maxlength: 1000 },
    requestedBy: { type: String, enum: ["buyer", "staff"], required: true },
    requestedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["requested", "received_from_supplier", "provided_to_buyer"],
      default: "requested",
    },
    cycleLabel: { type: String, trim: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    mirroredItemId: { type: Schema.Types.ObjectId, ref: "RequestedDocument" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

requestedDocumentSchema.index({ transactionId: 1, deletedAt: 1, createdAt: 1 });

export const RequestedDocument =
  models.RequestedDocument ?? model<IRequestedDocument>("RequestedDocument", requestedDocumentSchema);
