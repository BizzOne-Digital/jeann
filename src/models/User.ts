import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type UserStatus = "active" | "disabled" | "pending_verification";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  mfaEnabled: boolean;
  status: UserStatus;
  lastLoginAt?: Date;
  failedLoginCount: number;
  lockedUntil?: Date;
  deletedAt?: Date;
}

export type UserLean = LeanDoc<IUser>;

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    emailVerifiedAt: { type: Date },
    phoneVerifiedAt: { type: Date },
    mfaEnabled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "disabled", "pending_verification"],
      default: "pending_verification",
    },
    lastLoginAt: { type: Date },
    failedLoginCount: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
userSchema.index({ phone: 1 }, { sparse: true });
userSchema.index({ status: 1, deletedAt: 1 });

export const User = models.User ?? model<IUser>("User", userSchema);
