import Link from "next/link";
import { PortalPage } from "@/components/portal/PortalPage";
import { StatPill } from "@/components/portal/StatPill";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { href: "/admin/pages", label: "Website Pages" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/settings", label: "Global Settings" },
  { href: "/admin/purchase-requests", label: "Purchase Requests" },
  { href: "/admin/integrations", label: "Integrations" },
];

export default async function AdminPage() {
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let products = 0;
  let categories = 0;
  let faqs = 0;
  let testimonials = 0;
  let team = 0;
  let purchaseRequests = 0;
  let integrations = 0;
  let users = 0;

  if (conn) {
    const models = await import("@/models");
    [
      products,
      categories,
      faqs,
      testimonials,
      team,
      purchaseRequests,
      integrations,
      users,
    ] = await Promise.all([
      models.Product.countDocuments({ deletedAt: null }),
      models.ProductCategory.countDocuments({ deletedAt: null }),
      models.Faq.countDocuments(),
      models.Testimonial.countDocuments(),
      models.TeamMember.countDocuments(),
      models.PurchaseRequest.countDocuments(),
      models.IntegrationConfiguration.countDocuments(),
      models.User.countDocuments({ deletedAt: null }),
    ]);
  }

  return (
    <PortalPage title="Administration" description="Manage catalogue content, organizations, and platform configuration.">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill
            label="Database"
            value={conn ? "Connected" : mongoConfigured ? "URI set, unreachable" : "Not configured"}
          />
          <StatPill label="Products" value={String(products)} />
          <StatPill label="Categories" value={String(categories)} />
          <StatPill label="Users" value={String(users)} />
          <StatPill label="FAQs" value={String(faqs)} />
          <StatPill label="Testimonials" value={String(testimonials)} />
          <StatPill label="Team profiles" value={String(team)} />
          <StatPill label="Purchase requests" value={String(purchaseRequests)} />
          <StatPill label="Integrations" value={String(integrations)} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--stone)]">
            Quick links
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)] transition hover:border-[var(--ocean)]"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>

        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Set <code>MONGODB_URI</code> in <code>.env.local</code> and run <code>npm run seed</code>{" "}
            to load admin data.
          </p>
        ) : null}
      </div>
    </PortalPage>
  );
}
