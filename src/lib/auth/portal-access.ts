import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { OrganizationMembership } from "@/models/OrganizationMembership";

export type PortalArea = "buyer" | "supplier" | "banking" | "workspace" | "admin";

const allowedRoles: Record<PortalArea, string[]> = {
  buyer: ["buyer_org_admin", "buyer_member"],
  supplier: ["supplier_org_admin", "supplier_member"],
  banking: ["banking_advisor", "finance"],
  workspace: ["ceo_super_admin", "general_manager", "trade_manager", "employee_operations", "finance", "compliance_reviewer"],
  admin: ["ceo_super_admin", "general_manager"],
};

export async function requirePortalAccess(area: PortalArea) {
  const session = await getSession();
  if (!session) redirect("/login");
  const devRole = (session.user as unknown as { role?: string }).role;
  if (devRole) {
    const mapped = devRole === "employee" ? "workspace" : devRole;
    if (mapped !== area && !(devRole === "admin" && area === "workspace")) redirect("/login");
    return session;
  }
  if (!isMongoConfigured()) redirect("/login");
  await tryConnectMongo();
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: allowedRoles[area] },
  }).lean();
  if (!membership) redirect("/login");
  return session;
}
