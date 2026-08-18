import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

/** Returns session if caller is an authenticated buyer (or dev buyer). */
export async function requireBuyerApiSession() {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  }

  const devRole = (session.user as unknown as { role?: string }).role;
  if (devRole === "buyer") return { session };

  if (!isMongoConfigured()) {
    return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  }

  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["buyer_org_admin", "buyer_member"] },
  }).lean();

  if (!membership) {
    return { error: NextResponse.json({ error: "Buyer portal access required." }, { status: 403 }) };
  }

  return { session };
}
