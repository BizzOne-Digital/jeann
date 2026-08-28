import fs from "fs";
import path from "path";

const BASE = process.env.BASE_URL || "http://localhost:3002";
const files = [
  "src/lib/content/oil-product-content.ts",
  "src/lib/content/sugar-product-content.ts",
  "src/lib/content/pulse-product-content.ts",
  "src/lib/content/rice-product-content.ts",
  "src/lib/content/spice-product-content.ts",
  "src/components/marketing/HomeSections.tsx",
];

const imgs = new Set();
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  for (const m of t.matchAll(/["'](\/images\/[^"']+)["']/g)) imgs.add(m[1]);
}

const missingDisk = [];
const missingHttp = [];
for (const img of [...imgs].sort()) {
  const disk = path.join("public", img.replace(/^\//, ""));
  if (!fs.existsSync(disk)) missingDisk.push(img);
  else {
    const r = await fetch(BASE + img);
    if (!r.ok) missingHttp.push({ img, status: r.status });
  }
}

console.log("Referenced images:", imgs.size);
console.log("Missing on disk:", missingDisk.length, missingDisk);
console.log("Missing HTTP:", missingHttp.length, missingHttp);
if (missingDisk.length || missingHttp.length) process.exit(1);
