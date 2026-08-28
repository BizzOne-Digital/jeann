import { Schema, model, models, Types } from "mongoose";
import { ROLE_KEYS, type LeanDoc, type RoleKey } from "./shared";
import type { OrganizationType } from "./Organization";

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export interface IInvitation {
  tokenHash: string;
  email: string;
  phone?: string;
  contactName?: string;
  organizationId?: Types.ObjectId;
  organizationType: OrganizationType;
  intendedLegalName?: string;
  roles: RoleKey[];
  status: InvitationStatus;
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
    phone: { type: String, trim: true },
    contactName: { type: String, trim: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    organizationType: {
      type: String,
      enum: ["buyer", "supplier", "internal", "banking_adviser"],
      required: true,
    },
    intendedLegalName: { type: String, trim: true },
    roles: [{ type: String, enum: ROLE_KEYS }],
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "revoked"],
      default: "pending",
    },
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
