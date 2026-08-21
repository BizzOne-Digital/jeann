import { requirePortalAccess } from "@/lib/auth/portal-access";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminBuyersList } from "@/components/admin/AdminBuyersList";

export const dynamic = "force-dynamic";

export default async function AdminBuyersPage() {
  await requirePortalAccess("admin");
  const conn = isMongoConfigured() ? await tryConnectMongo() : null;

  let items: Array<{
    _id: string;
    legalName: string;
    country: string;
    status: string;
    createdAt: string | null;
    contactEmail: string;
    contactName: string;
  }> = [];

  if (conn) {
    const { Organization, OrganizationMembership, User } = await import("@/models");
    const orgs = await Organization.find({ type: "buyer", deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    const orgIds = orgs.map((org) => org._id);
    const memberships = await OrganizationMembership.find({
      organizationId: { $in: orgIds },
      deletedAt: null,
      roles: { $in: ["buyer_org_admin", "buyer_member"] },
    }).lean();
    const users = await User.find({
      _id: { $in: memberships.map((m) => m.userId) },
      deletedAt: null,
    }).lean();
    const userById = new Map(users.map((u) => [String(u._id), u]));
    const membershipByOrg = new Map(memberships.map((m) => [String(m.organizationId), m]));

    items = orgs.map((org) => {
      const membership = membershipByOrg.get(String(org._id));
      const contact = membership ? userById.get(String(membership.userId)) : null;
      return {
        _id: String(org._id),
        legalName: org.legalName,
        country: org.country,
        status: org.status,
        createdAt: org.createdAt ? new Date(org.createdAt).toLocaleDateString() : null,
        contactEmail: contact?.email ?? "",
        contactName: contact?.name ?? "",
      };
    });
  }

  return (
    <PortalPage
      title="Buyer Organizations"
      description="Review registrations, approve or reject buyer portal access, and track approval history."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          {conn
            ? `${items.length} buyer organization${items.length === 1 ? "" : "s"}`
            : "MongoDB required to review buyers."}
        </p>
        <AdminBuyersList items={items} />
      </div>
    </PortalPage>
  );
}
