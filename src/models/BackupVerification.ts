import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type BackupVerificationResult = "success" | "failed" | "partial";

export interface IBackupVerification {
  backupSource: string;
  backupDate: Date;
  encryptionStatus: string;
  verificationDate: Date;
  restoreTestResult: BackupVerificationResult;
  testedByUserId: Types.ObjectId;
  recoveryLocation?: string;
  errorSummary?: string;
  notes?: string;
}

export type BackupVerificationLean = LeanDoc<IBackupVerification>;

const backupVerificationSchema = new Schema<IBackupVerification>(
  {
    backupSource: { type: String, required: true },
    backupDate: { type: Date, required: true },
    encryptionStatus: { type: String, default: "encrypted" },
    verificationDate: { type: Date, required: true },
    restoreTestResult: {
      type: String,
      enum: ["success", "failed", "partial"],
      required: true,
    },
    testedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recoveryLocation: { type: String },
    errorSummary: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

export const BackupVerification =
  models.BackupVerification ??
  model<IBackupVerification>("BackupVerification", backupVerificationSchema);
