import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getSupplierOrganizationId } from "@/lib/auth/supplier-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { EmptyState } from "@/components/portal/EmptyState";
import { PortalPage } from "@/components/portal/PortalPage";
import { StatPill } from "@/components/portal/StatPill";

export default async function SupplierDashboard() {
  const session = await requirePortalAccess("supplier");
  let draftOffers = 0;
  let submittedOffers = 0;
  let activeProcurement = 0;
  let documents = 0;

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const orgId = await getSupplierOrganizationId(session);
    if (orgId) {
      const models = await import("@/models");
      draftOffers = await models.SupplierOffer.countDocuments({
        organizationId: orgId,
        status: "draft",
      });
      submittedOffers = await models.SupplierOffer.countDocuments({
        organizationId: orgId,
        status: { $in: ["submitted", "under_review", "more_information_required"] },
      });
      activeProcurement = await models.Transaction.countDocuments({
        organizationId: orgId,
        transactionType: "supplier_purchase",
        status: "active",
        deletedAt: null,
      });
      documents = await models.Document.countDocuments({
        organizationId: orgId,
        supplierVisible: true,
      }).catch(() => 0);
    }
  }

  return (
    <PortalPage
      title="Supplier overview"
      description="Manage trade offers, procurement transactions, documents, and messages."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill label="Draft offers" value={String(draftOffers)} />
        <StatPill label="Submitted offers" value={String(submittedOffers)} />
        <StatPill label="Active procurement" value={String(activeProcurement)} />
        <StatPill label="Documents" value={String(documents)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/portal/supplier/offers/new" className="btn btn-primary">
          New trade offer
        </Link>
        <Link href="/portal/supplier/offers" className="btn btn-outline">
          View offers
        </Link>
        <Link href="/portal/supplier/transactions" className="btn btn-outline">
          Procurement transactions
        </Link>
      </div>
      {draftOffers === 0 && activeProcurement === 0 && (
        <div className="mt-6">
          <EmptyState
            title="Supplier workspace ready"
            detail="Submit a trade offer or wait for Finekarts to open a procurement transaction."
          />
        </div>
      )}
    </PortalPage>
  );
}
