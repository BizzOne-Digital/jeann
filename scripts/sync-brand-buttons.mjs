import fs from "fs";
import path from "path";

const replacements = [
  [
    /rounded-md bg-\[#d4a84b\] px-6 py-3\.5 text-base font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "marketing-btn-primary px-6 py-3.5 text-base font-semibold",
  ],
  [
    /rounded-md bg-\[#d4a84b\] px-6 py-3\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "marketing-btn-primary px-6 py-3.5 text-sm font-semibold",
  ],
  [
    /rounded-sm bg-\[#d4a84b\] px-6 py-3\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "marketing-btn-primary px-6 py-3.5 text-sm font-semibold",
  ],
  [
    /rounded-md bg-\[#d4a84b\] px-5 py-2\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "marketing-btn-primary px-5 py-2.5 text-sm font-semibold",
  ],
  [
    /inline-flex items-center gap-2 rounded-md bg-\[#d4a84b\] px-6 py-3\.5 text-base font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-base font-semibold",
  ],
  [
    /inline-flex items-center gap-2 rounded-md bg-\[#d4a84b\] px-6 py-3\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold",
  ],
  [
    /inline-flex w-fit items-center gap-2 rounded-md bg-\[#d4a84b\] px-5 py-2\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "inline-flex w-fit items-center gap-2 marketing-btn-primary px-5 py-2.5 text-sm font-semibold",
  ],
  [
    /inline-flex items-center gap-2 rounded-md bg-\[#d4a84b\] px-5 py-2\.5 text-sm font-semibold text-white transition hover:bg-\[#c4983f\]/g,
    "inline-flex items-center gap-2 marketing-btn-primary px-5 py-2.5 text-sm font-semibold",
  ],
  [
    /bg-\[#e89a2d\] px-6 py-3\.5 text-sm font-semibold text-\[#071525\] transition hover:bg-\[#f0a93c\]/g,
    "marketing-btn-primary px-6 py-3.5 text-sm font-semibold",
  ],
  [
    /bg-\[#e89a2d\] px-6 py-3\.5 text-base font-semibold text-\[#071525\] transition hover:bg-\[#f0a93c\]/g,
    "marketing-btn-primary px-6 py-3.5 text-base font-semibold",
  ],
  [
    /rounded-full bg-\[#e89a2d\] px-4 py-2\.5 text-sm font-semibold text-\[#071525\][^"]*hover:bg-\[#f0a93c\]/g,
    "rounded-full marketing-btn-primary px-4 py-2.5 text-sm shadow-[var(--shadow-soft)]",
  ],
  [
    /rounded-md bg-\[#d4a84b\] px-6 py-3 text-sm font-semibold text-\[#001a3d\] transition hover:bg-\[#e8c06a\]/g,
    "marketing-btn-primary px-6 py-3 text-sm font-semibold",
  ],
  [
    /rounded-md bg-\[#d4a84b\] px-6 py-3\.5 text-sm font-semibold text-\[#071525\] transition hover:bg-\[#c4983f\]/g,
    "marketing-btn-primary px-6 py-3.5 text-sm font-semibold",
  ],
  [
    /rounded-sm bg-\[#d4a84b\] px-5 py-3 font-semibold text-\[#071525\]/g,
    "marketing-btn-primary rounded-sm px-5 py-3 font-semibold",
  ],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".css")) {
      let content = fs.readFileSync(full, "utf8");
      const original = content;
      for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
      }
      if (content !== original) fs.writeFileSync(full, content);
    }
  }
}

walk(path.join(process.cwd(), "src"));
