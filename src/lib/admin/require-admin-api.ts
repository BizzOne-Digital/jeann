import { getSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export async function requireAdminApiSession() {
  const session = await getSession();
  if (!session) return null;
  if (!isMongoConfigured()) return null;
  if (!(await tryConnectMongo())) return null;
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager"] },
  }).lean();
  return membership ? session : null;
}
