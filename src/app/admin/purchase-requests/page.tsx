import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { loadAdminSectionData } from "@/lib/admin/section-data";

export const dynamic = "force-dynamic";

export default async function AdminPurchaseRequestsPage() {
  await requirePortalAccess("admin");
  const { countLabel, columns, rows, emptyMessage } = await loadAdminSectionData("purchase-requests");

  return (
    <PortalPage
      title="Purchase Requests"
      description="Review inbound buyer RFQs and convert qualified requests into transactions."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database: {countLabel ?? "Not connected — set MONGODB_URI and run npm run seed"}
        </p>
        <AdminDataTable columns={columns} rows={rows} emptyMessage={emptyMessage} />
      </div>
    </PortalPage>
  );
}
