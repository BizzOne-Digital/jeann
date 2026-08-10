import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TransactionParticipantRole =
  | "owner"
  | "collaborator"
  | "viewer"
  | "banking_advisor"
  | "internal_reviewer";

export interface ITransactionParticipant {
  transactionId: Types.ObjectId;
  userId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  role: TransactionParticipantRole;
  accessExpiresAt?: Date;
  revokedAt?: Date;
}

export type TransactionParticipantLean = LeanDoc<ITransactionParticipant>;

const transactionParticipantSchema = new Schema<ITransactionParticipant>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    role: {
      type: String,
      enum: ["owner", "collaborator", "viewer", "banking_advisor", "internal_reviewer"],
      required: true,
    },
    accessExpiresAt: { type: Date },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

transactionParticipantSchema.index({ transactionId: 1, userId: 1, role: 1 });
transactionParticipantSchema.index({ transactionId: 1, organizationId: 1 });
transactionParticipantSchema.index({ userId: 1, revokedAt: 1 });

export const TransactionParticipant =
  models.TransactionParticipant ??
  model<ITransactionParticipant>("TransactionParticipant", transactionParticipantSchema);
