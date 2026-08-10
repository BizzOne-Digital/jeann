import { redirect } from "next/navigation";
import { Types } from "mongoose";
import {
  hasPermission,
  permissionsForRoles,
  type Permission,
} from "@/lib/authorization/permissions";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { OrganizationMembership } from "@/models/OrganizationMembership";
import type { UserLean } from "@/models/User";
import { AuthError, ForbiddenError, OrganizationAccessError } from "@/lib/auth/errors";
import { getSession, type ActiveSession } from "@/lib/auth/session";

export interface AuthenticatedUser extends ActiveSession {
  permissions: Permission[];
}

async function loadMembershipPermissions(
  userId: string,
  organizationId: string,
): Promise<Permission[]> {
  if (!isMongoConfigured()) return [];

  await tryConnectMongo();
  const membership = await OrganizationMembership.findOne({
    userId: new Types.ObjectId(userId),
    organizationId: new Types.ObjectId(organizationId),
    status: "active",
    deletedAt: null,
  }).lean();

  if (!membership) return [];

  const rolePerms = permissionsForRoles(membership.roles);
  const custom = membership.customPermissions ?? [];
  return [...new Set([...rolePerms, ...custom])];
}

export async function requireUser(options?: {
  redirectTo?: string;
}): Promise<AuthenticatedUser> {
  const session = await getSession();
  if (!session) {
    if (options?.redirectTo) redirect(options.redirectTo);
    throw new AuthError("Authentication required");
  }
  return { ...session, permissions: [] };
}

export async function requirePermission(
  required: Permission | Permission[],
  options?: { redirectTo?: string; organizationId?: string },
): Promise<AuthenticatedUser> {
  const session = await requireUser(options);

  let granted = session.permissions;
  if (options?.organizationId) {
    granted = await loadMembershipPermissions(session.userId, options.organizationId);
  }

  if (!hasPermission(granted, required)) {
    if (options?.redirectTo) redirect(options.redirectTo);
    throw new ForbiddenError("Insufficient permissions");
  }

  return { ...session, permissions: granted };
}

/**
 * Validates organization access from server-side context — never trust org IDs
 * supplied by the browser without verifying active membership.
 */
export async function requireOrganizationAccess(
  organizationId: string,
  options?: {
    requiredPermissions?: Permission | Permission[];
    redirectTo?: string;
  },
): Promise<AuthenticatedUser & { organizationId: string }> {
  const session = await requireUser(options);

  if (!Types.ObjectId.isValid(organizationId)) {
    throw new OrganizationAccessError("Invalid organization");
  }

  const permissions = await loadMembershipPermissions(session.userId, organizationId);
  if (!permissions.length) {
    if (options?.redirectTo) redirect(options.redirectTo);
    throw new OrganizationAccessError("Not a member of this organization");
  }

  if (options?.requiredPermissions && !hasPermission(permissions, options.requiredPermissions)) {
    if (options?.redirectTo) redirect(options.redirectTo);
    throw new ForbiddenError("Insufficient organization permissions");
  }

  return { ...session, permissions, organizationId };
}

export type { UserLean };
