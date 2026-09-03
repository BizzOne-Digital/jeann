import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getAuthContext } from "@/lib/auth/auth-context";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";

export default async function BuyerOrganizationPage() {
  const session = await requirePortalAccess("buyer");
  let orgName = "—";
  let orgType = "—";
  let status = "—";
  let members = 0;

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const ctx = await getAuthContext(session.userId);
    const membership = ctx?.memberships.find((m) =>
      m.roles.some((r) => r === "buyer_org_admin" || r === "buyer_member"),
    );
    if (membership) {
      const { Organization, OrganizationMembership } = await import("@/models");
      const org = await Organization.findById(membership.organizationId).lean();
      orgName = org?.legalName ?? "—";
      orgType = org?.organizationType ?? membership.organizationType;
      status = org?.status ?? membership.status;
      members = await OrganizationMembership.countDocuments({
        organizationId: membership.organizationId,
        deletedAt: null,
      });
    }
  }

  return (
    <PortalPage
      title="Organization"
      description="Your registered buyer organization and verification status."
    >
      <dl className="grid max-w-xl gap-4 rounded-lg border border-[var(--line)] bg-white p-6 text-sm">
        <div>
          <dt className="font-semibold text-[var(--navy)]">Legal name</dt>
          <dd className="mt-1 text-[var(--stone)]">{orgName}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--navy)]">Type</dt>
          <dd className="mt-1 text-[var(--stone)]">{orgType}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--navy)]">Status</dt>
          <dd className="mt-1 text-[var(--stone)]">{status}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--navy)]">Active members</dt>
          <dd className="mt-1 text-[var(--stone)]">{members}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-[var(--stone)]">
        Update your Customer Information Sheet on{" "}
        <Link href="/portal/buyer/cis" className="font-semibold text-[var(--navy)] underline">
          CIS profile
        </Link>{" "}
        or complete{" "}
        <Link href="/portal/buyer/onboarding" className="font-semibold text-[var(--navy)] underline">
          onboarding
        </Link>
        .
      </p>
    </PortalPage>
  );
}
