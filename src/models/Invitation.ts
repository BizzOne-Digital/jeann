import { Schema, model, models, Types } from "mongoose";
import { ROLE_KEYS, type LeanDoc, type RoleKey } from "./shared";
import type { OrganizationType } from "./Organization";

export interface IInvitation {
  tokenHash: string;
  email: string;
  organizationId: Types.ObjectId;
  organizationType: OrganizationType;
  roles: RoleKey[];
  expiresAt: Date;
  revokedAt?: Date;
  acceptedAt?: Date;
  createdBy: Types.ObjectId;
}

export type InvitationLean = LeanDoc<IInvitation>;

const invitationSchema = new Schema<IInvitation>(
  {
    tokenHash: { type: String, required: true, select: false },
    email: { type: String, required: true, lowercase: true, trim: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    organizationType: {
      type: String,
      enum: ["buyer", "supplier", "internal"],
      required: true,
    },
    roles: [{ type: String, enum: ROLE_KEYS }],
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    acceptedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

invitationSchema.index({ tokenHash: 1 }, { unique: true });
invitationSchema.index({ email: 1, organizationId: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { acceptedAt: null, revokedAt: null } });

export const Invitation =
  models.Invitation ?? model<IInvitation>("Invitation", invitationSchema);
