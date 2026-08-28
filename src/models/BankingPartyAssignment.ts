import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BankingPartyRole =
  | "internal_banking_coordinator"
  | "external_banking_adviser"
  | "issuing_bank_contact"
  | "advising_bank_contact"
  | "confirming_bank_contact"
  | "nominated_bank_contact"
  | "buyer_contact"
  | "supplier_contact";

export interface IBankingPartyAssignment {
  bankingInstrumentId: Types.ObjectId;
  userId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  bankingRole: BankingPartyRole;
  accessScope: string;
  assignedByUserId: Types.ObjectId;
  assignedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  revocationReason?: string;
  active: boolean;
}

export type BankingPartyAssignmentLean = LeanDoc<IBankingPartyAssignment>;

const bankingPartyAssignmentSchema = new Schema<IBankingPartyAssignment>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    bankingRole: {
      type: String,
      enum: [
        "internal_banking_coordinator",
        "external_banking_adviser",
        "issuing_bank_contact",
        "advising_bank_contact",
        "confirming_bank_contact",
        "nominated_bank_contact",
        "buyer_contact",
        "supplier_contact",
      ],
      required: true,
    },
    accessScope: { type: String, default: "assigned" },
    assignedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedAt: { type: Date, required: true, default: () => new Date() },
    expiresAt: { type: Date },
    revokedAt: { type: Date },
    revocationReason: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bankingPartyAssignmentSchema.index({ bankingInstrumentId: 1, userId: 1, active: 1 });
bankingPartyAssignmentSchema.index({ userId: 1, active: 1 });

export const BankingPartyAssignment =
  models.BankingPartyAssignment ??
  model<IBankingPartyAssignment>("BankingPartyAssignment", bankingPartyAssignmentSchema);
