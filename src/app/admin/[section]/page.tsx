import { notFound } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { loadAdminSectionData } from "@/lib/admin/section-data";

export const dynamic = "force-dynamic";

const SECTIONS: Record<string, { title: string; description: string }> = {
  "purchase-requests": {
    title: "Purchase Requests",
    description: "Review inbound buyer RFQs and convert qualified requests into transactions.",
  },
  "trade-offers": {
    title: "Trade Offers",
    description: "Review supplier trade offers received through invitation or trade desk intake.",
  },
  transactions: {
    title: "Transactions",
    description: "Operate buyer and supplier transaction workflows, steps, and assignments.",
  },
  buyers: {
    title: "Buyer Organizations",
    description: "Verify buyer companies, memberships, CIS profiles, and duplicate-review flags.",
  },
  suppliers: {
    title: "Supplier Organizations",
    description: "Manage invite-only supplier onboarding, verification, and assigned transactions.",
  },
  documents: {
    title: "Documents & Templates",
    description: "Versioned SCO/FCO/ICPO/PSA/SPA templates and private document packages.",
  },
  "validation-rules": {
    title: "Validation Rules",
    description: "Deterministic document filter rules with versioning and activation approval.",
  },
  approvals: {
    title: "Approvals",
    description: "Queues for trade-manager and compliance approvals with immutable audit events.",
  },
  bookings: {
    title: "Bookings",
    description: "Consultation requests awaiting staff or calendar-provider confirmation.",
  },
  shipments: {
    title: "Shipments",
    description: "Manual milestones and provider adapters — never fabricated live locations.",
  },
  finance: {
    title: "Finance & Reports",
    description: "Per-transaction finance tabs, tax configuration, and export controls.",
  },
  ai: {
    title: "AI Knowledge & Settings",
    description: "Approved knowledge base, kill switch, and Gemini configuration status.",
  },
  integrations: {
    title: "Integrations",
    description: "Configured vs unconfigured providers — no fake success states.",
  },
  terms: {
    title: "Terms & Policies",
    description: "Versioned legal documents requiring professional review before production.",
  },
  audit: {
    title: "Audit Log",
    description: "Append-only sensitive-action history for authorized reviewers.",
  },
};

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const meta = SECTIONS[section];
  if (!meta) notFound();

  const { countLabel, columns, rows, emptyMessage } = await loadAdminSectionData(section);

  return (
    <PortalPage title={meta.title} description={meta.description}>
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database: {countLabel ?? "Not connected — set MONGODB_URI and run npm run seed"}
        </p>
        <AdminDataTable columns={columns} rows={rows} emptyMessage={emptyMessage} />
      </div>
    </PortalPage>
  );
}
