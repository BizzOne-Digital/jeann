/**
 * Lists /images/ paths and files that reference them (for cross-page duplicate audit).
 * Run: npx tsx src/scripts/audit-site-image-uniqueness.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const IMG_RE = /\/images\/[a-zA-Z0-9_./-]+\.(?:png|jpg|jpeg|webp|gif|svg)/g;

/** Same path in multiple files is OK when it is one page's registry + component (e.g. home-images + HomeSections). */
const IGNORE_MULTI_FILE = new Set([
  "/images/home-1.png",
  "/images/home-2.png",
  "/images/home-3.png",
]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") walk(p, acc);
    else if (ent.isFile() && /\.(tsx?|jsx?)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const byImage = new Map<string, Set<string>>();

for (const file of walk(ROOT)) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf8");
  const matches = text.match(IMG_RE) ?? [];
  for (const img of matches) {
    if (!byImage.has(img)) byImage.set(img, new Set());
    byImage.get(img)!.add(rel);
  }
}

const dupes = [...byImage.entries()]
  .filter(([img, files]) => files.size > 1 && !IGNORE_MULTI_FILE.has(img))
  .sort((a, b) => b[1].size - a[1].size);

console.log(`Total unique image paths: ${byImage.size}`);
console.log(`Paths referenced from 2+ files: ${dupes.length}\n`);

for (const [img, files] of dupes) {
  console.log(`${img}`);
  for (const f of [...files].sort()) console.log(`  - ${f}`);
  console.log("");
}
