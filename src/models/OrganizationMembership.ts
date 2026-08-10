import { Schema, model, models, Types } from "mongoose";
import { ROLE_KEYS, type LeanDoc, type Permission, type RoleKey } from "./shared";

export type MembershipStatus = "active" | "invited" | "suspended" | "removed";

export interface IOrganizationMembership {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  roles: RoleKey[];
  customPermissions: Permission[];
  status: MembershipStatus;
  invitedBy?: Types.ObjectId;
  deletedAt?: Date;
}

export type OrganizationMembershipLean = LeanDoc<IOrganizationMembership>;

const organizationMembershipSchema = new Schema<IOrganizationMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    roles: [{ type: String, enum: ROLE_KEYS }],
    customPermissions: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "invited", "suspended", "removed"],
      default: "invited",
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

organizationMembershipSchema.index(
  { userId: 1, organizationId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
organizationMembershipSchema.index({ organizationId: 1, status: 1 });

export const OrganizationMembership =
  models.OrganizationMembership ??
  model<IOrganizationMembership>("OrganizationMembership", organizationMembershipSchema);
