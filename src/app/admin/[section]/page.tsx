import { notFound } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { EmptyState } from "@/components/portal/EmptyState";
import { tryConnectMongo } from "@/lib/db/mongoose";

const SECTIONS: Record<string, { title: string; description: string }> = {
  pages: {
    title: "Website Pages",
    description: "Edit public page heroes, sections, CTAs, and SEO. Publish/draft/archive with revalidation.",
  },
  products: {
    title: "Products & Categories",
    description: "Manage commodity categories, products, packaging compatibility, and verification status.",
  },
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
  employees: {
    title: "Employees & Roles",
    description: "Create/disable staff accounts and grant granular module permissions.",
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
  blog: {
    title: "Blog / Insights",
    description: "CMS-managed educational posts with draft/publish workflow.",
  },
  team: {
    title: "Team",
    description: "Public team profiles. Do not publish unverified named individuals.",
  },
  testimonials: {
    title: "Testimonials",
    description: "Only CMS-approved testimonials appear publicly.",
  },
  faqs: {
    title: "FAQs",
    description: "Manage frequently asked questions shown on the public site.",
  },
  leads: {
    title: "Leads & Contact Messages",
    description: "Internal lead pipeline from contact forms, RFQs, and assistant escalations.",
  },
  newsletter: {
    title: "Newsletter / CRM",
    description: "Consented subscribers, suppression list, and CRM sync status.",
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
  settings: {
    title: "Global Settings",
    description: "Company contact, feature flags, locales, and SEO defaults.",
  },
};

type Row = { cells: string[]; key: string };

async function loadSectionData(section: string): Promise<{
  countLabel: string | null;
  columns?: string[];
  rows?: Row[];
}> {
  const conn = await tryConnectMongo();
  if (!conn) return { countLabel: null };

  try {
    const models = await import("@/models");
    switch (section) {
      case "products":
        return {
          countLabel: `${await models.Product.countDocuments()} products / ${await models.ProductCategory.countDocuments()} categories`,
        };
      case "faqs":
        return { countLabel: `${await models.Faq.countDocuments()} FAQ records` };
      case "blog":
        return { countLabel: `${await models.BlogPost.countDocuments()} posts` };
      case "buyers": {
        const buyers = await models.Organization.find({ type: "buyer", deletedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return {
          countLabel: `${buyers.length} buyer orgs (showing up to 50)`,
          columns: ["Legal name", "Country", "Status", "Created"],
          rows: buyers.map((b) => ({
            key: String(b._id),
            cells: [
              b.legalName,
              b.country,
              b.status,
              b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "suppliers": {
        const suppliers = await models.Organization.find({ type: "supplier", deletedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return {
          countLabel: `${suppliers.length} supplier orgs (showing up to 50)`,
          columns: ["Legal name", "Country", "Status", "Created"],
          rows: suppliers.map((s) => ({
            key: String(s._id),
            cells: [
              s.legalName,
              s.country,
              s.status,
              s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "purchase-requests": {
        const docs = await models.PurchaseRequest.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return {
          countLabel: `${await models.PurchaseRequest.countDocuments()} total`,
          columns: ["Reference", "Company", "Product", "Qty", "Status", "Submitted"],
          rows: docs.map((d) => ({
            key: d.reference,
            cells: [
              d.reference,
              d.contactCompany || d.contactEmail || "—",
              d.productName,
              [d.quantity, d.unit].filter(Boolean).join(" ") || "—",
              d.status,
              d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "trade-offers": {
        const docs = await models.TradeOffer.find().sort({ createdAt: -1 }).limit(50).lean();
        return {
          countLabel: `${await models.TradeOffer.countDocuments()} total`,
          columns: ["Reference", "Contact", "Product", "Status", "Submitted"],
          rows: docs.map((d) => ({
            key: d.reference,
            cells: [
              d.reference,
              d.contactEmail || d.contactName || "—",
              d.productName,
              d.status,
              d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "bookings": {
        const docs = await models.BookingRequest.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return {
          countLabel: `${await models.BookingRequest.countDocuments()} total`,
          columns: ["Contact", "Topic", "Status", "Requested"],
          rows: docs.map((d) => ({
            key: String(d._id),
            cells: [
              d.contact?.email || d.contact?.name || "—",
              d.topic,
              d.status,
              d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "leads": {
        const docs = await models.Lead.find().sort({ createdAt: -1 }).limit(50).lean();
        const contacts = await models.ContactSubmission.find()
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();
        return {
          countLabel: `${await models.Lead.countDocuments()} leads / ${await models.ContactSubmission.countDocuments()} contact messages`,
          columns: ["Source", "Contact", "Company", "Stage", "Created"],
          rows: [
            ...docs.map((d) => ({
              key: String(d._id),
              cells: [
                d.source,
                d.contact?.email || d.contact?.name || "—",
                d.company || "—",
                d.stage,
                d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
              ],
            })),
            ...contacts.map((c) => ({
              key: `contact-${String(c._id)}`,
              cells: [
                "contact-message",
                c.email,
                c.department || "—",
                c.status,
                c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—",
              ],
            })),
          ],
        };
      }
      case "newsletter": {
        const docs = await models.NewsletterSubscriber.find({ suppressedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return {
          countLabel: `${await models.NewsletterSubscriber.countDocuments({ suppressedAt: null })} subscribers`,
          columns: ["Email", "Source", "Confirmed", "Joined"],
          rows: docs.map((d) => ({
            key: String(d._id),
            cells: [
              d.email,
              d.source,
              d.confirmedAt ? "yes" : "pending",
              d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—",
            ],
          })),
        };
      }
      case "integrations":
        return {
          countLabel: `${await models.IntegrationConfiguration.countDocuments()} integration records`,
        };
      case "settings":
        return {
          countLabel: (await models.SiteSettings.countDocuments())
            ? "Site settings present"
            : "No settings yet",
        };
      default:
        return { countLabel: "MongoDB connected" };
    }
  } catch (error) {
    console.error("[admin/section]", section, error);
    return { countLabel: "MongoDB connected (query error — check server logs)" };
  }
}

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const meta = SECTIONS[section];
  if (!meta) notFound();
  const { countLabel, columns, rows } = await loadSectionData(section);

  return (
    <PortalPage title={meta.title} description={meta.description}>
      <div className="space-y-4">
        <p className="text-sm text-stone">
          Database: {countLabel ?? "Not connected — set MONGODB_URI and run npm run seed"}
        </p>
        {columns && rows && rows.length > 0 ? (
          <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--sand)]/40 text-xs uppercase tracking-wide text-[var(--stone)]">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-[var(--line)] last:border-0">
                    {row.cells.map((cell, i) => (
                      <td key={`${row.key}-${i}`} className="px-4 py-3 capitalize">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={rows && rows.length === 0 ? "No records yet" : "Editable workspace"}
            detail={
              rows && rows.length === 0
                ? "Inbound forms write here when MongoDB is connected. Submit a test RFQ, contact message, or booking from the public site."
                : "This module is wired to platform models. Seeded catalog/settings are available in MongoDB under the finekarts database."
            }
          />
        )}
      </div>
    </PortalPage>
  );
}
