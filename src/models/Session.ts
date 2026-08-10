import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ISession {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  rotatedFrom?: Types.ObjectId;
  userAgent?: string;
  ipHash?: string;
  revokedAt?: Date;
}

export type SessionLean = LeanDoc<ISession>;

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true },
    rotatedFrom: { type: Schema.Types.ObjectId, ref: "Session" },
    userAgent: { type: String },
    ipHash: { type: String },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

sessionSchema.index({ tokenHash: 1 }, { unique: true });
sessionSchema.index({ userId: 1, revokedAt: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { revokedAt: { $ne: null } } });

export const Session = models.Session ?? model<ISession>("Session", sessionSchema);
