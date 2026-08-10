import { PortalPage } from "@/components/portal/PortalPage";
import { StatPill } from "@/components/portal/StatPill";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { integrationStatus } from "@/lib/config/env";

export default async function AdminPage() {
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;
  let products = 0;
  let categories = 0;
  let faqs = 0;
  let posts = 0;
  let users = 0;

  if (conn) {
    const models = await import("@/models");
    [products, categories, faqs, posts, users] = await Promise.all([
      models.Product.countDocuments(),
      models.ProductCategory.countDocuments(),
      models.Faq.countDocuments(),
      models.BlogPost.countDocuments(),
      models.User.countDocuments(),
    ]);
  }

  const integrations = integrationStatus();

  return (
    <PortalPage title="Administration">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatPill label="Database" value={conn ? "Connected" : mongoConfigured ? "URI set, unreachable" : "Not configured"} />
        <StatPill label="Products" value={String(products)} />
        <StatPill label="Categories" value={String(categories)} />
        <StatPill label="FAQs" value={String(faqs)} />
        <StatPill label="Insights posts" value={String(posts)} />
        <StatPill label="Users" value={String(users)} />
        <StatPill label="Email provider" value={integrations.email ? "Configured" : "Unconfigured"} />
        <StatPill label="Groq AI" value={integrations.groq ? "Configured" : "Unconfigured"} />
        <StatPill label="Storage" value={String(integrations.storage)} />
      </div>
    </PortalPage>
  );
}
