import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type UserStatus =
  | "pending"
  | "active"
  | "suspended"
  | "locked"
  | "disabled"
  | "pending_verification";

export interface IUser {
  email: string;
  normalizedEmail: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  mfaEnabled: boolean;
  status: UserStatus;
  lastLoginAt?: Date;
  failedLoginCount: number;
  lockedUntil?: Date;
  passwordChangedAt?: Date;
  deletedAt?: Date;
}

export type UserLean = LeanDoc<IUser>;

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    normalizedEmail: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    emailVerifiedAt: { type: Date },
    phoneVerifiedAt: { type: Date },
    mfaEnabled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "locked", "disabled", "pending_verification"],
      default: "pending_verification",
    },
    lastLoginAt: { type: Date },
    failedLoginCount: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date },
    passwordChangedAt: { type: Date },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
userSchema.index({ normalizedEmail: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });
userSchema.index({ status: 1, deletedAt: 1 });

export const User = models.User ?? model<IUser>("User", userSchema);
