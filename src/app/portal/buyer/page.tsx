import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { EmptyState } from "@/components/portal/EmptyState";
import { PortalPage } from "@/components/portal/PortalPage";
import { StatPill } from "@/components/portal/StatPill";

export default async function BuyerDashboard() {
  const session = await requirePortalAccess("buyer");
  let requests = 0;
  let pending = 0;
  let transactions = 0;
  let activeTransactions = 0;
  let documents = 0;
  let messages = 0;

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (orgId) {
      const models = await import("@/models");
      requests = await models.PurchaseRequest.countDocuments({ organizationId: orgId });
      pending = await models.PurchaseRequest.countDocuments({
        organizationId: orgId,
        status: { $in: ["submitted", "under_review", "more_information_required"] },
      });
      transactions = await models.Transaction.countDocuments({
        organizationId: orgId,
        deletedAt: null,
      });
      activeTransactions = await models.Transaction.countDocuments({
        organizationId: orgId,
        status: "active",
        deletedAt: null,
      });
      documents = await models.Document.countDocuments({ organizationId: orgId }).catch(() => 0);
      messages = await models.MessageThread.countDocuments({
        organizationId: orgId,
      }).catch(() => 0);
    }
  }

  return (
    <PortalPage
      title="Buyer overview"
      description="Start a new transaction, follow your transactions and shipments, and keep your company profile up to date."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill label="Purchase requests" value={String(requests)} />
        <StatPill label="Pending review" value={String(pending)} />
        <StatPill label="Transactions" value={String(transactions)} />
        <StatPill label="Active deals" value={String(activeTransactions)} />
        <StatPill label="Documents" value={String(documents)} />
        <StatPill label="Message threads" value={String(messages)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/portal/buyer/new-request" className="btn btn-primary">
          New transaction
        </Link>
        <Link href="/portal/buyer/transactions" className="btn btn-outline">
          My transactions
        </Link>
        <Link href="/portal/buyer/shipments" className="btn btn-outline">
          Tracking shipments
        </Link>
      </div>
      <p className="mt-4 text-sm text-[var(--stone)]">
        Also:{" "}
        <Link href="/portal/buyer/invoices" className="font-medium text-[var(--navy)] underline">Invoices</Link>
        {" · "}
        <Link href="/portal/buyer/requests" className="font-medium text-[var(--navy)] underline">All requests</Link>
        {" · "}
        <Link href="/portal/buyer/company-details" className="font-medium text-[var(--navy)] underline">Company details</Link>
        {" · "}
        <Link href="/portal/buyer/organization" className="font-medium text-[var(--navy)] underline">Organization</Link>
        {" · "}
        <Link href="/portal/buyer/contact" className="font-medium text-[var(--navy)] underline">Contact Finekarts</Link>
      </p>
      {requests === 0 && transactions === 0 && (
        <div className="mt-6">
          <EmptyState
            title="Your trade desk is ready"
            detail="Submit an ICPO to begin trade desk review toward a PSA contract."
          />
        </div>
      )}
    </PortalPage>
  );
}
