import { Types } from "mongoose";
import type { OrganizationLean } from "@/models";

export async function getBuyerOrganizationForUser(
  userId: Types.ObjectId | string,
): Promise<OrganizationLean | null> {
  const { OrganizationMembership, Organization } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["buyer_org_admin", "buyer_member"] },
  }).lean();
  if (!membership) return null;
  return Organization.findOne({
    _id: membership.organizationId,
    type: "buyer",
    deletedAt: null,
  }).lean();
}

export function isBuyerOrganizationVerified(org: OrganizationLean | null) {
  return org?.status === "verified";
}
