/**
 * Duplicate-content audit for public product pages (seed catalog).
 * Run: npx tsx src/scripts/audit-product-duplicate-content.ts
 */
import { getAllProducts } from "@/lib/content/catalog";
import { getOilProductMarketing } from "@/lib/content/oil-product-content";
import { getPulseProductMarketing } from "@/lib/content/pulse-product-content";
import { getRiceProductMarketing } from "@/lib/content/rice-product-content";
import { getCoffeeProductMarketing } from "@/lib/content/coffee-product-content";
import { getSpiceProductMarketing } from "@/lib/content/spice-product-content";
import { getSugarProductMarketing } from "@/lib/content/sugar-product-content";

function marketingFor(categorySlug: string, productSlug: string) {
  if (categorySlug === "edible-oils") return getOilProductMarketing(productSlug);
  if (categorySlug === "beans-and-pulses") return getPulseProductMarketing(productSlug);
  if (categorySlug === "rice-and-grains") return getRiceProductMarketing(productSlug);
  if (categorySlug === "coffee") return getCoffeeProductMarketing(productSlug);
  if (categorySlug === "spices") return getSpiceProductMarketing(productSlug);
  if (categorySlug === "sugar") return getSugarProductMarketing(productSlug);
  return null;
}

const products = getAllProducts();
const pillarBodies: string[] = [];

console.log("| URL | Product | Overview (unique opener) | Duplicated blocks on page | Rewrite priority |");
console.log("| --- | --- | --- | --- | --- |");

for (const p of products) {
  const url = `/products/${p.categorySlug}/${p.slug}`;
  const m = marketingFor(p.categorySlug, p.slug);
  const boxes = m?.contentBoxes ?? [];
  const dup: string[] = [];
  if (boxes.length >= 3) {
    dup.push("Quality/Safety/Punctuality pillars (shared template per category)");
    for (const b of boxes) pillarBodies.push(b.body);
  }
  if (p.inspectionOptions?.join() === "Configurable when verified") {
    dup.push("Specs: generic inspection line");
  }
  if (p.incotermOptions?.join() === "FOB,CIF" || p.incotermOptions?.join() === "FOB, CIF") {
    dup.push("Specs: FOB/CIF only");
  }
  dup.push("BulkOrderBox + ORDER CTA (category pattern)");
  dup.push("Related links block (site-wide)");

  const overviewNote = p.overview.length > 72 ? `${p.overview.slice(0, 72)}…` : p.overview;
  const priority =
    boxes.length >= 3 && p.status === "pending_verification" ? "Medium — unique grade copy; pillars templated" : "Low";

  console.log(
    `| ${url} | ${p.name} | ${overviewNote.replace(/\|/g, "/")} | ${dup.join("; ").replace(/\|/g, "/")} | ${priority} |`,
  );
}

console.log(`\nTotal listings: ${products.length}`);

const bodyCounts = new Map<string, number>();
for (const b of pillarBodies) {
  bodyCounts.set(b, (bodyCounts.get(b) ?? 0) + 1);
}
const topShared = [...bodyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
console.log("\nMost-repeated pillar body text (across products):");
for (const [body, n] of topShared) {
  console.log(`- ${n}× ${body.slice(0, 100)}…`);
}
