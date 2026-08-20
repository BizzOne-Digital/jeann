import { serializeEmployee, type AdminEmployeeItem } from "@/lib/admin/employee-serializer";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function listInternalEmployees(): Promise<AdminEmployeeItem[]> {
  if (!(await tryConnectMongo())) return [];

  const { Organization, OrganizationMembership, User } = await import("@/models");
  const internalOrgs = await Organization.find({ type: "internal", deletedAt: null }).lean();
  if (internalOrgs.length === 0) return [];

  const orgIds = internalOrgs.map((org) => org._id);
  const memberships = await OrganizationMembership.find({
    organizationId: { $in: orgIds },
    deletedAt: null,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (memberships.length === 0) return [];

  const userIds = memberships.map((membership) => membership.userId);
  const users = await User.find({ _id: { $in: userIds }, deletedAt: null }).lean();
  const userById = new Map(users.map((user) => [String(user._id), user]));

  return memberships
    .map((membership) => {
      const user = userById.get(String(membership.userId));
      if (!user) return null;
      return serializeEmployee(membership, user);
    })
    .filter((item): item is AdminEmployeeItem => item !== null);
}
