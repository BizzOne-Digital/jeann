import { Types } from "mongoose";
import {
  hasPermission,
  permissionsForRoles,
  type Permission,
} from "@/lib/authorization/permissions";
import { ForbiddenError, OrganizationAccessError } from "@/lib/auth/errors";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { OrganizationMembership } from "@/models/OrganizationMembership";

export function assertPermission(
  granted: Permission[] | undefined,
  required: Permission | Permission[],
  message = "Insufficient permissions",
): void {
  if (!hasPermission(granted, required)) {
    throw new ForbiddenError(message);
  }
}

/** Pure org-id equality check — never trust a browser-supplied org without membership verification. */
export function assertResourceOrganization(
  sessionOrganizationId: string | undefined,
  resourceOrganizationId: string | undefined,
): void {
  if (!sessionOrganizationId || !resourceOrganizationId) {
    throw new OrganizationAccessError("Organization scope denied");
  }
  if (sessionOrganizationId !== resourceOrganizationId) {
    throw new OrganizationAccessError("Cross-tenant organization access denied");
  }
}

export async function assertOrgScope(
  userId: string,
  organizationId: string,
  required?: Permission | Permission[],
): Promise<Permission[]> {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new OrganizationAccessError("Invalid organization ID");
  }

  if (!isMongoConfigured()) {
    throw new OrganizationAccessError("Organization access requires database");
  }

  await tryConnectMongo();
  const membership = await OrganizationMembership.findOne({
    userId: new Types.ObjectId(userId),
    organizationId: new Types.ObjectId(organizationId),
    status: "active",
    deletedAt: null,
  }).lean();

  if (!membership) {
    throw new OrganizationAccessError("Organization membership required");
  }

  const granted = [
    ...new Set([
      ...permissionsForRoles(membership.roles),
      ...(membership.customPermissions ?? []),
    ]),
  ];

  if (required) {
    assertPermission(granted, required);
  }

  return granted;
}

export interface TransactionAccessContext {
  userId: string;
  transactionId: string;
  organizationId?: string;
  requiredPermissions?: Permission[];
}

/**
 * Asserts user may access a transaction via org membership or participant record.
 * TransactionParticipant lookup is used when the model is available.
 */
export async function assertTransactionAccess(
  ctx: TransactionAccessContext,
): Promise<void> {
  if (!Types.ObjectId.isValid(ctx.transactionId)) {
    throw new ForbiddenError("Invalid transaction");
  }

  if (!isMongoConfigured()) {
    throw new ForbiddenError("Transaction access requires database");
  }

  await tryConnectMongo();

  if (ctx.organizationId) {
    await assertOrgScope(ctx.userId, ctx.organizationId, ctx.requiredPermissions);
    return;
  }

  try {
    const { TransactionParticipant } = await import("@/models/TransactionParticipant");
    const participant = await TransactionParticipant.findOne({
      transactionId: new Types.ObjectId(ctx.transactionId),
      userId: new Types.ObjectId(ctx.userId),
      revokedAt: null,
      $or: [{ accessExpiresAt: null }, { accessExpiresAt: { $gt: new Date() } }],
    }).lean();

    if (participant) return;
  } catch {
    // Model not yet registered — fall through
  }

  throw new ForbiddenError("Transaction access denied");
}
