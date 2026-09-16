import { Types } from "mongoose";
import { getSession, type ActiveSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

/** Same roles as `requirePortalAccess("admin")`. */
export const ADMIN_API_ROLES = ["ceo_super_admin", "general_manager"] as const;

async function hasAdminMembership(userId: string): Promise<boolean> {
  const { OrganizationMembership } = await import("@/models");
  const oid = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
  const membership = await OrganizationMembership.findOne({
    userId: oid,
    status: "active",
    deletedAt: null,
    roles: { $in: [...ADMIN_API_ROLES] },
  }).lean();
  return Boolean(membership);
}

export async function requireAdminApiSession(): Promise<ActiveSession | null> {
  const session = await getSession();
  if (!session) return null;

  const devRole = (session.user as unknown as { role?: string }).role;
  if (devRole) {
    if (devRole !== "admin") return null;
    if (!isMongoConfigured() || !(await tryConnectMongo())) return null;
    return session;
  }

  if (!isMongoConfigured() || !(await tryConnectMongo())) return null;
  return (await hasAdminMembership(session.userId)) ? session : null;
}
