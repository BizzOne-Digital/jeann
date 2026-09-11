import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(ent.name)) walk(p, files);
    } else if (/\.(tsx?|jsx?|mdx?)$/.test(ent.name)) {
      files.push(p);
    }
  }
  return files;
}

const routes = new Set();

function collectRoutes(dir, base = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(base, ent.name);
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith("(") || ent.name.startsWith("_")) {
        collectRoutes(full, base);
      } else if (ent.name.startsWith("[")) {
        routes.add("/" + base.replace(/\\/g, "/"));
      } else {
        collectRoutes(full, rel);
      }
    } else if (ent.name === "page.tsx" || ent.name === "page.ts") {
      const route = "/" + base.replace(/\\/g, "/");
      routes.add(route === "/" ? "/" : route.replace(/\/+/g, "/"));
    }
  }
}

collectRoutes("src/app");

const redirectRoutes = new Set([
  "/shipping",
  "/shipping-documents",
  "/testimonials",
  "/trade",
]);

const staticRoutes = new Set([...routes, ...redirectRoutes]);

function matchesDynamic(pathname) {
  for (const route of routes) {
    if (!route.includes("[")) continue;
    const pattern =
      "^" +
      route
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\\\[([^\\\]]+)\\\]/g, "[^/]+") +
      "$";
    if (new RegExp(pattern).test(pathname)) return true;
  }
  return false;
}

const hrefPatterns = [
  /href=["']([^"'#?][^"']*)["']/g,
  /href:\s*["']([^"'#?][^"']*)["']/g,
];

const broken = new Map();

for (const file of walk("src")) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of hrefPatterns) {
    let match;
    while ((match = re.exec(text))) {
      const href = match[1];
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("/api") ||
        href.startsWith("/docs/") ||
        href.startsWith("/videos/") ||
        href.startsWith("/images/")
      ) {
        continue;
      }
      if (!href.startsWith("/")) continue;
      const clean = href.split("#")[0].split("?")[0];
      if (!clean || clean.includes("[") || clean.includes("${")) continue;
      if (staticRoutes.has(clean) || matchesDynamic(clean)) continue;
      if (!broken.has(clean)) broken.set(clean, []);
      broken.get(clean).push(file.replace(/\\/g, "/"));
    }
  }
}

console.log(`Routes: ${staticRoutes.size}`);
console.log(`Broken internal paths: ${broken.size}`);
for (const [p, files] of [...broken.entries()].sort()) {
  console.log(`\n${p}`);
  for (const f of files.slice(0, 5)) console.log(`  ${f}`);
  if (files.length > 5) console.log(`  ... +${files.length - 5} more`);
}

process.exit(broken.size > 0 ? 1 : 0);
