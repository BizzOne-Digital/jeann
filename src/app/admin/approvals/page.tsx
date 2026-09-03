import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

export const dynamic = "force-dynamic";

export default async function AdminApprovalsPage() {
  await requirePortalAccess("admin");
  const conn = await tryConnectMongo();

  let rows: Array<{ key: string; cells: string[] }> = [];
  if (conn) {
    const { Approval, Organization } = await import("@/models");
    const approvals = await Approval.find({ targetType: "buyer_organization" })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const orgIds = approvals.map((a) => a.targetId);
    const orgs = await Organization.find({ _id: { $in: orgIds } }).lean();
    const orgById = new Map(orgs.map((o) => [String(o._id), o]));

    rows = approvals.map((item) => {
      const org = orgById.get(String(item.targetId));
      return {
        key: String(item._id),
        cells: [
          org?.legalName ?? String(item.targetId),
          item.decision,
          item.reason ?? "—",
          item.createdAt ? new Date(item.createdAt).toLocaleString() : "—",
          org ? `/admin/buyers/${String(org._id)}` : "—",
        ],
      };
    });
  }

  return (
    <PortalPage
      title="Approvals"
      description="Buyer organization approval decisions and audit trail."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          {conn ? `${rows.length} approval record(s)` : "MongoDB required."}
        </p>
        <AdminDataTable
          columns={["Organization", "Decision", "Reason", "When", "Review link"]}
          rows={rows}
          emptyMessage="No approvals yet. Pending buyer registrations appear after signup."
        />
        <p className="text-sm text-[var(--stone)]">
          Open a buyer from{" "}
          <Link href="/admin/buyers" className="font-semibold text-[var(--navy)] underline">
            Buyer Organizations
          </Link>{" "}
          to approve or reject.
        </p>
      </div>
    </PortalPage>
  );
}
