import { notFound } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { loadAdminSectionData } from "@/lib/admin/section-data";

export const dynamic = "force-dynamic";

const SECTIONS: Record<string, { title: string; description: string }> = {
  "trade-offers": {
    title: "Trade Offers",
    description: "Review supplier trade offers received through invitation or trade desk intake.",
  },
  transactions: {
    title: "Transactions",
    description: "Operate buyer and supplier transaction workflows, steps, and assignments.",
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
  "buyer-requests": {
    title: "Buyer Requests",
    description: "Review and qualify buyer purchase requests before converting to formal transactions.",
  },
  "supplier-offers": {
    title: "Supplier Offers",
    description: "Review portal supplier trade offers and convert qualified offers to procurement.",
  },
  procurement: {
    title: "Procurement Transactions",
    description: "Supplier-purchase transactions, workflow status, and assignments.",
  },
  "deal-groups": {
    title: "Deal Groups",
    description: "Internal buyer–supplier linking and quantity allocations. Never exposed externally.",
  },
  banking: {
    title: "Banking Instruments",
    description: "Buyer-side and supplier-side banking coordination records. Not bank issuance.",
  },
  audit: {
    title: "Audit Log",
    description: "Append-only sensitive-action history for authorized reviewers.",
  },
  security: {
    title: "Security Dashboard",
    description: "Security events, incidents, lockouts, and production validation.",
  },
  invitations: {
    title: "Invitations",
    description: "Employee, supplier, and banking adviser invitation lifecycle.",
  },
  users: {
    title: "Users",
    description: "Platform user accounts, verification status, and memberships.",
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
