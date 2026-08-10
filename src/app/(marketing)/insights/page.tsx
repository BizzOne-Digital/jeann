import type { Metadata } from "next";
import {
  InsightsHero,
  InsightsFeatured,
  InsightsCatalog,
  InsightsCta,
} from "@/components/marketing/InsightSections";
import { SEED_INSIGHTS } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Educational articles on Incoterms, purchase requests, packaging, and shipping documents — not legal advice.",
};

export default function InsightsPage() {
  const posts = [...SEED_INSIGHTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [featured, ...rest] = posts;
  const catalog = rest.length > 0 ? rest : posts;

  return (
    <>
      <InsightsHero />
      {featured ? <InsightsFeatured post={featured} /> : null}
      <InsightsCatalog posts={catalog.length === posts.length ? posts : catalog} />
      <InsightsCta />
    </>
  );
}
