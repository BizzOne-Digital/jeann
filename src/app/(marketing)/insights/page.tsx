import type { Metadata } from "next";
import {
  InsightsHero,
  InsightsFeatured,
  InsightsCatalog,
  InsightsCta,
} from "@/components/marketing/InsightSections";
import { getPublishedInsights } from "@/lib/content/insights-catalog";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Educational articles on Incoterms, purchase requests, packaging, and shipping documents — not legal advice.",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const posts = await getPublishedInsights();
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
