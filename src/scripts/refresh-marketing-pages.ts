/**
 * Push registry default copy into MongoDB Page documents (published).
 * Run after site-wide messaging updates: npx tsx src/scripts/refresh-marketing-pages.ts
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
