import { Types } from "mongoose";
import type { ActiveSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export async function getBuyerOrganizationId(
  session: ActiveSession,
): Promise<Types.ObjectId | null> {
  const devOrg = (session.user as unknown as { organizationId?: string }).organizationId;
  if (devOrg && !Types.ObjectId.isValid(devOrg)) return null;
  if (!isMongoConfigured()) return null;
  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["buyer_org_admin", "buyer_member"] },
  }).lean();
  return membership?.organizationId ?? null;
}
