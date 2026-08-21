import { Types } from "mongoose";
import type { OrganizationLean } from "@/models";
import type { UserLean } from "@/models/User";

export type AdminBuyerDetail = {
  _id: string;
  legalName: string;
  country: string;
  status: string;
  registrationNumber: string;
  domain: string;
  verificationNotes: string;
  createdAt: string | null;
  primaryContact: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    userStatus: string;
  } | null;
};

export function serializeBuyerDetail(
  org: OrganizationLean,
  contact: UserLean | null,
): AdminBuyerDetail {
  return {
    _id: String(org._id),
    legalName: org.legalName,
    country: org.country,
    status: org.status,
    registrationNumber: org.registrationNumber ?? "",
    domain: org.domain ?? "",
    verificationNotes: org.verificationNotes ?? "",
    createdAt: org.createdAt ? new Date(org.createdAt).toLocaleString() : null,
    primaryContact: contact
      ? {
          userId: String(contact._id),
          name: contact.name,
          email: contact.email,
          phone: contact.phone ?? "",
          userStatus: contact.status,
        }
      : null,
  };
}

export async function loadBuyerDetail(orgId: string): Promise<AdminBuyerDetail | null> {
  if (!Types.ObjectId.isValid(orgId)) return null;
  const { Organization, OrganizationMembership, User } = await import("@/models");
  const org = await Organization.findOne({
    _id: orgId,
    type: "buyer",
    deletedAt: null,
  }).lean();
  if (!org) return null;

  const membership = await OrganizationMembership.findOne({
    organizationId: org._id,
    deletedAt: null,
    roles: { $in: ["buyer_org_admin", "buyer_member"] },
  })
    .sort({ createdAt: 1 })
    .lean();

  const contact = membership
    ? await User.findOne({ _id: membership.userId, deletedAt: null }).lean()
    : null;

  return serializeBuyerDetail(org, contact);
}

export async function decideBuyerOrganization(input: {
  orgId: string;
  decision: "approved" | "rejected";
  actorUserId: Types.ObjectId | string;
  reason?: string;
}) {
  const { Organization, OrganizationMembership, User, Approval } = await import("@/models");
  const org = await Organization.findOne({
    _id: input.orgId,
    type: "buyer",
    deletedAt: null,
  });
  if (!org) throw new Error("Buyer organization not found.");

  const membership = await OrganizationMembership.findOne({
    organizationId: org._id,
    deletedAt: null,
    roles: { $in: ["buyer_org_admin", "buyer_member"] },
  })
    .sort({ createdAt: 1 })
    .lean();

  const contact = membership
    ? await User.findOne({ _id: membership.userId, deletedAt: null }).lean()
    : null;

  org.status = input.decision === "approved" ? "verified" : "rejected";
  if (input.reason) org.verificationNotes = input.reason;
  await org.save();

  await Approval.create({
    targetType: "buyer_organization",
    targetId: org._id,
    decision: input.decision,
      actorUserId: new Types.ObjectId(String(input.actorUserId)),
    reason: input.reason,
  });

  return { org: org.toObject(), contact };
}
