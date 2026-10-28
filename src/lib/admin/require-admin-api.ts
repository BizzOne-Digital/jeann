import { NextResponse } from "next/server";
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

/**
 * Response for a failed requireAdminApiSession(). Tells the admin the real reason
 * (expired session, database unavailable, or wrong role) instead of a bare "Forbidden".
 */
export async function adminDeniedResponse(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Your session has expired. Please sign in again, then retry." },
      { status: 401 },
    );
  }
  if (!isMongoConfigured() || !(await tryConnectMongo())) {
    return NextResponse.json(
      { error: "The database is temporarily unavailable. Please try again in a moment." },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { error: "Only the CEO or General Manager account can do this." },
    { status: 403 },
  );
}
