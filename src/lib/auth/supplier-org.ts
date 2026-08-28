import type { ActiveSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export async function getSupplierOrganizationId(
  session: ActiveSession,
): Promise<string | null> {
  if (!isMongoConfigured()) return null;
  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models/OrganizationMembership");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["supplier_org_admin", "supplier_member"] },
  }).lean();
  return membership ? String(membership.organizationId) : null;
}
