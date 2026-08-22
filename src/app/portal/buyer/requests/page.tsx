import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { EmptyState } from "@/components/portal/EmptyState";
import { PortalPage } from "@/components/portal/PortalPage";

export default async function RequestsPage() {
  const session = await requirePortalAccess("buyer");
  let rows: Array<{
    reference: string;
    productName: string;
    status: string;
    quantity?: string;
    unit?: string;
    contractTotal?: number;
    deliveryCount?: number;
    paymentPreference?: string;
    iccCode?: string;
    createdAt?: Date;
  }> = [];

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (orgId) {
      const { PurchaseRequest } = await import("@/models");
      const docs = await PurchaseRequest.find({ organizationId: orgId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      rows = docs.map((d) => ({
        reference: d.reference,
        productName: d.productName,
        status: d.status,
        quantity: d.quantity,
        unit: d.unit,
        contractTotal: d.contractTotal,
        deliveryCount: d.deliveryCount,
        paymentPreference: d.paymentPreference,
        iccCode: d.iccCode,
        createdAt: d.createdAt,
      }));
    }
  }

  return (
    <PortalPage
      title="Purchase requests"
      description="Requests submitted to Finekarts and their qualification status."
    >
      <div className="mb-4">
        <Link className="btn btn-primary" href="/portal/buyer/new-request">
          Submit new request
        </Link>
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="No purchase requests yet"
          detail="Submit a purchase request from this portal using the same email as your account so it links to your organization."
        />
      ) : (
        <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--sand)]/40 text-xs uppercase tracking-wide text-[var(--stone)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Volume</th>
                <th className="px-4 py-3 font-semibold">Contract</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.reference} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--navy)]">{row.reference}</td>
                  <td className="px-4 py-3">{row.productName}</td>
                  <td className="px-4 py-3">
                    {[row.quantity, row.unit].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {row.contractTotal
                      ? `USD ${row.contractTotal.toLocaleString()} (${row.deliveryCount ?? "—"} deliveries)`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {row.paymentPreference
                      ? `${row.paymentPreference}${row.iccCode ? ` (${row.iccCode})` : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{row.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-[var(--stone)]">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalPage>
  );
}
