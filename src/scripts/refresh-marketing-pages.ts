/**
 * Push registry default copy into MongoDB Page documents (published).
 * Use when Admin → Pages shows old hero/section text that no longer matches the live
 * registry (verification/inspections/logistics bodies live in page-registry-bodies.ts).
 *
 *   npm run refresh:marketing-pages
 *
 * Note: Hub panels still read TypeScript defaults until this runs; blank CMS fields
 * already fall back to registry in code, but non-empty Mongo values override until refresh.
 */
import "./load-env";
import { refreshMarketingPagesFromRegistry } from "@/lib/content/page-content";

async function main() {
  const count = await refreshMarketingPagesFromRegistry();
  console.log(`Refreshed ${count} marketing page(s) from registry.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
