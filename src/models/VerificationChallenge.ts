import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type VerificationChannel = "email" | "phone";
export type VerificationPurpose =
  | "email_verify"
  | "phone_verify"
  | "password_reset"
  | "mfa_login";

export interface IVerificationChallenge {
  userId: Types.ObjectId;
  channel: VerificationChannel;
  codeHash: string;
  purpose: VerificationPurpose;
  expiresAt: Date;
  attempts: number;
  consumedAt?: Date;
}

export type VerificationChallengeLean = LeanDoc<IVerificationChallenge>;

const verificationChallengeSchema = new Schema<IVerificationChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: String, enum: ["email", "phone"], required: true },
    codeHash: { type: String, required: true, select: false },
    purpose: {
      type: String,
      enum: ["email_verify", "phone_verify", "password_reset", "mfa_login"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0, min: 0 },
    consumedAt: { type: Date },
  },
  { timestamps: true },
);

verificationChallengeSchema.index({ userId: 1, purpose: 1, consumedAt: 1 });
verificationChallengeSchema.index({ expiresAt: 1 });

export const VerificationChallenge =
  models.VerificationChallenge ??
  model<IVerificationChallenge>("VerificationChallenge", verificationChallengeSchema);
