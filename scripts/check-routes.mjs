/**
 * Smoke-test all public marketing routes against a running Next server.
 * Usage: node scripts/check-routes.mjs
 * Env: BASE_URL (default http://localhost:3002)
 */

const BASE = process.env.BASE_URL || "http://localhost:3002";

const categories = {
  "edible-oils": [
    "sunflower-oil",
    "soybean-oil",
    "palm-oil",
    "rapeseed-oil",
    "canola-oil",
    "corn-oil",
    "coconut-oil",
    "olive-oil",
    "vegetable-oil",
  ],
  sugar: ["icumsa-45", "icumsa-100", "icumsa-150", "icumsa-600", "icumsa-1200"],
  "beans-and-pulses": [
    "kidney-beans",
    "white-beans",
    "red-beans",
    "black-beans",
    "pinto-beans",
    "soybeans",
  ],
  "rice-and-grains": ["basmati-rice", "parboiled-rice", "jasmine-rice"],
  "other-commodities": [
    "coffee-beans",
    "cashews",
    "cinnamon-sticks",
    "black-pepper",
    "turmeric",
    "cloves",
    "cardamom",
    "nutmeg",
  ],
};

const staticPages = [
  "/",
  "/about",
  "/accessibility",
  "/booking",
  "/buyer-request",
  "/buyer-terms",
  "/contact",
  "/cookies",
  "/faq",
  "/insights",
  "/inspections",
  "/login",
  "/logistics",
  "/packaging",
  "/partners",
  "/privacy",
  "/products",
  "/register/buyer",
  "/resources",
  "/shipping",
  "/shipping-documents",
  "/supplier-offer",
  "/team",
  "/terms",
  "/testimonials",
  "/trade",
  "/verification",
  "/verify-email",
  "/verify-phone",
  "/robots.txt",
  "/sitemap.xml",
];

const insights = [
  "fob-vs-cif-for-bulk-commodities",
  "how-purchase-requests-work",
  "packaging-options-in-bulk-trade",
  "document-checklists-are-route-specific",
];

const expect404 = [
  "/products/other-commodities/cinnamon",
  "/products/other-commodities/cashews-and-nuts",
  "/products/does-not-exist",
  "/this-page-does-not-exist",
];

const expectAuthRedirect = ["/admin", "/portal/buyer", "/portal/supplier", "/workspace"];

const urls = [...staticPages];
for (const [cat, products] of Object.entries(categories)) {
  urls.push(`/products/${cat}`);
  for (const p of products) urls.push(`/products/${cat}/${p}`);
}
for (const slug of insights) urls.push(`/insights/${slug}`);
urls.push("/api/health", "/api/health/ready");

async function check(path, expectStatus) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    const ok = expectStatus ? res.status === expectStatus : res.status >= 200 && res.status < 400;
    return { path, status: res.status, ok, expect: expectStatus ?? "2xx/3xx" };
  } catch (e) {
    return { path, status: "ERR", ok: false, expect: expectStatus ?? "2xx/3xx", error: String(e) };
  }
}

const results = [];
for (const u of urls) results.push(await check(u));
for (const u of expect404) results.push(await check(u, 404));
for (const u of expectAuthRedirect) {
  const r = await check(u);
  r.expect = "302/307/303";
  r.ok = r.status === 302 || r.status === 307 || r.status === 303;
  results.push(r);
}

const failed = results.filter((r) => !r.ok);
console.log(`Base: ${BASE}`);
console.log(`Checked: ${results.length}`);
console.log(`Passed: ${results.length - failed.length}`);
console.log(`Failed: ${failed.length}`);
if (failed.length) {
  console.log("--- FAILURES ---");
  for (const f of failed) {
    console.log(`${f.path} → ${f.status} (expected ${f.expect})${f.error ? ` ${f.error}` : ""}`);
  }
  process.exit(1);
}
