import { requirePortalAccess } from "@/lib/auth/portal-access";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { AgentDealForm } from "@/components/portal/AgentDealForm";
import { PortalPage } from "@/components/portal/PortalPage";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  declined: "Declined",
  more_information_required: "More information needed",
};

const ROLES = {
  agent: ["agent_org_admin", "agent_member"],
  broker: ["broker_org_admin", "broker_member"],
};

export async function IntermediaryDashboard({ kind }: { kind: "agent" | "broker" }) {
  const session = await requirePortalAccess(kind);
  let deals: Array<{ id: string; reference: string; buyer: string; supplier: string; product: string; type: string; status: string; date: string }> = [];

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const { OrganizationMembership, AgentDeal } = await import("@/models");
    const membership = await OrganizationMembership.findOne({
      userId: session.userId,
      status: "active",
      deletedAt: null,
      roles: { $in: ROLES[kind] },
    }).lean();
    if (membership) {
      const items = await AgentDeal.find({ agentOrganizationId: membership.organizationId, channel: kind })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      deals = items.map((d) => ({
        id: String(d._id),
        reference: d.reference,
        buyer: d.buyerCompanyName,
        supplier: d.supplierCompanyName ?? "",
        product: d.productName,
        type: String(d.documentType).toUpperCase(),
        status: d.status,
        date: new Date(d.createdAt).toLocaleDateString("en-CA"),
      }));
    }
  }

  const columns = ["Reference", "Buyer", ...(kind === "broker" ? ["Supplier"] : []), "Product", "Document", "Status", "Date"];

  return (
    <PortalPage
      title={kind === "broker" ? "Broker submissions" : "Agent submissions"}
      description={
        kind === "broker"
          ? "Introduce a buyer and a supplier to Finekarts by uploading the buyer's LOI or ICPO."
          : "Bring a deal to Finekarts for your principal by uploading the end buyer's LOI or ICPO."
      }
    >
      <div className="space-y-8">
        <AgentDealForm kind={kind} />
        <section>
          <h2 className="mb-3 text-base font-semibold text-[var(--navy)]">Your submissions</h2>
          {deals.length === 0 ? (
            <p className="text-sm text-[var(--stone)]">No submissions yet.</p>
          ) : (
            <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="px-4 py-3 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d) => (
                    <tr key={d.id} className="border-b border-[var(--line)] last:border-0">
                      <td className="px-4 py-3 font-medium">{d.reference}</td>
                      <td className="px-4 py-3">{d.buyer}</td>
                      {kind === "broker" ? <td className="px-4 py-3">{d.supplier}</td> : null}
                      <td className="px-4 py-3">{d.product}</td>
                      <td className="px-4 py-3">{d.type}</td>
                      <td className="px-4 py-3">{STATUS_LABEL[d.status] ?? d.status}</td>
                      <td className="px-4 py-3">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </PortalPage>
  );
}
