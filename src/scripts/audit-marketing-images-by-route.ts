/**
 * Route-level marketing image audit (rendered paths only — not whole image registries).
 * Run: npx tsx src/scripts/audit-marketing-images-by-route.ts
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const IMG_RE = /\/images\/[a-zA-Z0-9_./-]+\.(?:png|jpg|jpeg|webp|gif|svg)/g;
const IMPORT_RE = /from\s+["']@\/([^"']+)["']/g;

const REGISTRY_MODULES = new Set([
  "src/lib/marketing/page-hero-images.ts",
  "src/lib/content/packaging-images.ts",
  "src/lib/content/agriculture-images.ts",
  "src/lib/content/logistics-images.ts",
  "src/lib/content/office-hero-images.ts",
  "src/lib/content/product-images.ts",
  "src/lib/content/verification-content.ts",
  "src/lib/media/resolve-image-src.ts",
  "src/lib/content/marketing-pages.ts",
  "src/lib/content/oil-product-content.ts",
  "src/lib/content/sugar-product-content.ts",
  "src/lib/content/rice-product-content.ts",
  "src/lib/content/coffee-product-content.ts",
  "src/lib/content/spice-product-content.ts",
  "src/lib/content/pulse-product-content.ts",
]);

type RouteDef = { route: string; entry: string; heroKey?: string };

const ROUTES: RouteDef[] = [
  { route: "/", entry: "src/app/(marketing)/page.tsx", heroKey: "home" },
  { route: "/about", entry: "src/app/(marketing)/about/page.tsx", heroKey: "about" },
  { route: "/products", entry: "src/app/(marketing)/products/page.tsx", heroKey: "products" },
  { route: "/products/[category]", entry: "src/app/(marketing)/products/[categorySlug]/page.tsx" },
  { route: "/products/[category]/[product]", entry: "src/app/(marketing)/products/[categorySlug]/[productSlug]/page.tsx" },
  { route: "/contact", entry: "src/app/(marketing)/contact/page.tsx", heroKey: "contact" },
  { route: "/resources", entry: "src/app/(marketing)/resources/page.tsx", heroKey: "resources" },
  { route: "/insights", entry: "src/app/(marketing)/insights/page.tsx", heroKey: "insights" },
  { route: "/insights/[slug]", entry: "src/app/(marketing)/insights/[slug]/page.tsx" },
  { route: "/inspections", entry: "src/app/(marketing)/inspections/page.tsx", heroKey: "inspections" },
  { route: "/verification", entry: "src/app/(marketing)/verification/page.tsx", heroKey: "verification" },
  { route: "/partners", entry: "src/app/(marketing)/partners/page.tsx", heroKey: "partners" },
  { route: "/logistics", entry: "src/app/(marketing)/logistics/page.tsx", heroKey: "logistics" },
  { route: "/packaging", entry: "src/app/(marketing)/packaging/page.tsx", heroKey: "packaging" },
  { route: "/team", entry: "src/app/(marketing)/team/page.tsx", heroKey: "team" },
  { route: "/privacy", entry: "src/app/(marketing)/privacy/page.tsx", heroKey: "careers" },
  { route: "/faq", entry: "src/app/(marketing)/faq/page.tsx", heroKey: "faq" },
  { route: "/testimonials", entry: "src/app/(marketing)/testimonials/page.tsx", heroKey: "testimonials" },
  { route: "/booking", entry: "src/app/(marketing)/booking/page.tsx", heroKey: "booking" },
  { route: "/buyer-request", entry: "src/app/(marketing)/buyer-request/page.tsx", heroKey: "buyerRequest" },
  { route: "/supplier-offer", entry: "src/app/(marketing)/supplier-offer/page.tsx", heroKey: "supplierOffer" },
  { route: "/buyer-terms", entry: "src/app/(marketing)/buyer-terms/page.tsx", heroKey: "buyerTerms" },
  { route: "/cookies", entry: "src/app/(marketing)/cookies/page.tsx", heroKey: "cookies" },
  { route: "/dispute-resolution", entry: "src/app/(marketing)/dispute-resolution/page.tsx", heroKey: "disputeResolution" },
];

const EXTRA_MODULES: Record<string, string[]> = {
  "/": [
    "src/lib/content/home-images.ts",
    "src/lib/content/home-page-images.ts",
    "src/lib/content/product-images.ts",
    "src/components/marketing/HomeLogisticsImageBand.tsx",
    "src/components/marketing/FoodSafetyAgencyMarquee.tsx",
  ],
  "/products/[category]": ["src/lib/content/product-images.ts"],
  "/products/[category]/[product]": [
    "src/lib/content/oil-product-content.ts",
    "src/lib/content/sugar-product-content.ts",
    "src/lib/content/rice-product-content.ts",
    "src/lib/content/coffee-product-content.ts",
    "src/lib/content/spice-product-content.ts",
    "src/lib/content/pulse-product-content.ts",
  ],
  "/insights": [
    "src/lib/content/insight-images.ts",
    "src/lib/content/insights-operational-images.ts",
    "src/lib/content/product-quality-spotlights.ts",
  ],
  "/insights/[slug]": ["src/lib/content/insight-images.ts", "src/components/marketing/InsightSections.tsx"],
  "/inspections": ["src/lib/content/inspections-images.ts", "src/lib/content/inspections-content.ts"],
  "/verification": ["src/lib/content/verification-page-images.ts"],
  "/partners": ["src/lib/content/producer-partners-content.ts"],
  "/products": ["src/lib/content/product-images.ts", "src/lib/content/product-quality-spotlights.ts"],
  "/logistics": ["src/lib/content/logistics-images.ts", "src/lib/content/logistics-story.ts"],
  "/packaging": ["src/lib/content/packaging-page-images.ts", "src/lib/content/packaging-images.ts"],
  "/resources": ["src/lib/content/resources-page-images.ts", "src/lib/content/product-quality-spotlights.ts"],
  "/about": ["src/lib/content/about-images.ts", "src/components/marketing/AboutSections.tsx"],
};

function resolveImport(spec: string): string | null {
  const base = path.join(SRC, spec);
  for (const c of [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`]) {
    if (fs.existsSync(c)) return path.relative(ROOT, c).replace(/\\/g, "/");
  }
  return null;
}

function collectModuleGraph(entryRel: string, depth = 0, seen = new Set<string>()): Set<string> {
  if (depth > 5 || seen.has(entryRel)) return seen;
  const abs = path.join(ROOT, entryRel);
  if (!fs.existsSync(abs)) return seen;
  seen.add(entryRel);
  const text = fs.readFileSync(abs, "utf8");
  let m: RegExpExecArray | null;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(text))) {
    const resolved = resolveImport(m[1]);
    if (!resolved?.startsWith("src/")) continue;
    if (REGISTRY_MODULES.has(resolved)) continue;
    collectModuleGraph(resolved, depth + 1, seen);
  }
  return seen;
}

function extractPackagingTeaserOnly(): string[] {
  const text = fs.readFileSync(path.join(SRC, "lib/content/packaging-images.ts"), "utf8");
  const block = text.match(/HOMEPAGE_PACKAGING_TEASER = \[([\s\S]*?)\] as const/)?.[1] ?? "";
  return [...(block.match(IMG_RE) ?? [])];
}

function extractShippingTermsImage(): string[] {
  const text = fs.readFileSync(path.join(SRC, "components/marketing/HomeSections.tsx"), "utf8");
  const m = text.match(/ShippingTerms[\s\S]*?src=\{PACKAGING_IMAGES\.(\w+)\.src\}/);
  if (!m) return [];
  const pack = fs.readFileSync(path.join(SRC, "lib/content/packaging-images.ts"), "utf8");
  const srcM = pack.match(new RegExp(`${m[1]}:\\s*\\{[^}]*src:\\s*"([^"]+)"`));
  return srcM ? [srcM[1]] : [];
}

function extractImages(fileRel: string, route: string): string[] {
  const abs = path.join(ROOT, fileRel);
  if (!fs.existsSync(abs)) return [];
  const text = fs.readFileSync(abs, "utf8");
  return [...(text.match(IMG_RE) ?? [])];
}

function loadHeroSrc(heroKey: string): string | null {
  const { getPageHeroImage } = require(path.join(ROOT, "src/lib/marketing/page-hero-images.ts")) as {
    getPageHeroImage: (k: string) => { src: string };
  };
  return getPageHeroImage(heroKey as never).src;
}

const imageToRoutes = new Map<string, Set<string>>();
const routeToImages = new Map<string, Map<string, number>>();

function addImage(route: string, img: string) {
  if (!imageToRoutes.has(img)) imageToRoutes.set(img, new Set());
  imageToRoutes.get(img)!.add(route);
  if (!routeToImages.has(route)) routeToImages.set(route, new Map());
  const counts = routeToImages.get(route)!;
  counts.set(img, (counts.get(img) ?? 0) + 1);
}

for (const { route, entry, heroKey } of ROUTES) {
  const modules = collectModuleGraph(entry);
  for (const extra of EXTRA_MODULES[route] ?? []) modules.add(extra);
  for (const mod of modules) {
    for (const img of extractImages(mod, route)) addImage(route, img);
  }
  if (route === "/") {
    for (const img of extractPackagingTeaserOnly()) addImage(route, img);
    for (const img of extractShippingTermsImage()) addImage(route, img);
  }
  if (heroKey) {
    const src = loadHeroSrc(heroKey);
    if (src) addImage(route, src);
  }
}

console.log("=== CROSS-ROUTE DUPLICATES ===\n");
const cross = [...imageToRoutes.entries()]
  .filter(([, routes]) => routes.size > 1)
  .sort((a, b) => b[1].size - a[1].size);

for (const [img, routes] of cross) {
  console.log(img);
  console.log(`  → ${[...routes].sort().join(", ")}`);
}
console.log(`\nTotal cross-route duplicates: ${cross.length}\n`);

console.log("=== WITHIN-ROUTE (2+ references in bundle) ===\n");
for (const [route, counts] of [...routeToImages.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const inner = [...counts.entries()].filter(([, n]) => n > 1);
  if (!inner.length) continue;
  console.log(route);
  for (const [img, n] of inner.sort((a, b) => b[1] - a[1])) console.log(`  ${n}× ${img}`);
  console.log("");
}

console.log("=== UNIQUE IMAGES PER ROUTE ===\n");
for (const [route, counts] of [...routeToImages.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`${route}: ${counts.size}`);
}
