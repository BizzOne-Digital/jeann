import { Types } from "mongoose";
import {
  permissionsForRoles,
  hasPermission,
  type Permission,
  type RoleKey,
} from "@/lib/authorization/permissions";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { UserLean } from "@/models/User";

export type AuthMembership = {
  organizationId: string;
  organizationType: string;
  roles: RoleKey[];
  status: string;
  permissions: Permission[];
};

export type AuthContext = {
  userId: string;
  user: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    mfaEnabled: boolean;
  };
  memberships: AuthMembership[];
  permissions: Permission[];
  isInternal: boolean;
};

export async function getAuthContext(userId: string): Promise<AuthContext | null> {
  if (!isMongoConfigured()) return null;
  await tryConnectMongo();

  const { User, OrganizationMembership, Organization } = await import("@/models");
  const user = await User.findOne({ _id: userId, deletedAt: null }).lean();
  if (!user) return null;

  const memberships = await OrganizationMembership.find({
    userId: new Types.ObjectId(userId),
    deletedAt: null,
    status: { $in: ["active", "invited", "pending"] },
  }).lean();

  const orgIds = memberships.map((m) => m.organizationId);
  const orgs = await Organization.find({ _id: { $in: orgIds } }).lean();
  const orgById = new Map(orgs.map((o) => [String(o._id), o]));

  const membershipContexts: AuthMembership[] = memberships.map((m) => {
    const org = orgById.get(String(m.organizationId));
    const perms = [
      ...new Set([
        ...permissionsForRoles(m.roles),
        ...(m.customPermissions ?? []),
      ]),
    ];
    return {
      organizationId: String(m.organizationId),
      organizationType: org?.type ?? "buyer",
      roles: m.roles,
      status: m.status,
      permissions: perms,
    };
  });

  const allPermissions = [
    ...new Set(membershipContexts.flatMap((m) => m.permissions)),
  ];

  const isInternal = membershipContexts.some(
    (m) => m.organizationType === "internal" || m.roles.some((r) =>
      ["ceo_super_admin", "general_manager", "trade_manager", "employee_operations", "finance", "compliance_reviewer"].includes(r),
    ),
  );

  return {
    userId: String(user._id),
    user: {
      email: user.email,
      name: user.name,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      status: user.status,
      emailVerified: Boolean(user.emailVerifiedAt),
      phoneVerified: Boolean(user.phoneVerifiedAt),
      mfaEnabled: user.mfaEnabled,
    },
    memberships: membershipContexts,
    permissions: allPermissions,
    isInternal,
  };
}

export function authContextHasPermission(
  ctx: AuthContext,
  required: Permission | Permission[],
): boolean {
  return hasPermission(ctx.permissions, required);
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function displayName(user: Pick<UserLean, "firstName" | "lastName" | "name">): string {
  const fromParts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return fromParts || user.name;
}
