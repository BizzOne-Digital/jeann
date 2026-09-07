import fs from "fs";
import path from "path";

const sourcePath = path.join("scripts", "privacy-source.txt");
const outPath = path.join("src", "lib", "content", "legal", "privacy-policy.json");

const raw = fs.readFileSync(sourcePath, "utf8");
const lines = raw.split(/\r?\n/);

function shouldSkip(line) {
  if (!line) return true;
  if (line === "•") return true;
  if (/^\d+$/.test(line)) return true; // page numbers
  if (/^\d+\.$/.test(line)) return true; // orphaned PDF numbering
  return false;
}

function isListItem(line) {
  return /;\s*(and)?\s*$/i.test(line);
}

function isSubsectionHeader(line) {
  return /^\d+\.\d+\s+/.test(line);
}

function isSectionHeader(line) {
  return /^\d+\.\s+/.test(line) && !isSubsectionHeader(line);
}

function isTitleContinuation(line) {
  return /^[A-Z][A-Z\s/&-]+$/.test(line) && line.length < 60 && !line.includes(";");
}

function joinParagraph(parts) {
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function isListIntro(line) {
  return /:\s*$/.test(line) || /:\s*$/i.test(joinParagraph([line]));
}

function looksLikeParagraphStart(line) {
  return /^(This |Finekarts |Where |If you |Because |You may |You should |An |A |The |Unless |Subject |Nothing |Personal |By using |For |In |To |As |At |Each |Neither |No |Some |Such |Users |Withdrawal |Opting |Disabling |Continued |Failure |If this |Additional |Mandatory |Complaints |Finekarts'|Finekarts may|Finekarts will|Finekarts does|Finekarts is|Finekarts seeks|Finekarts retains|Finekarts intends|Depending )/.test(
    line,
  );
}

function parseContent(contentLines) {
  const paragraphs = [];
  const bullets = [];
  const subsections = [];

  let paragraphParts = [];
  let currentSub = null;
  let listMode = false;

  function flushParagraph() {
    const text = joinParagraph(paragraphParts);
    paragraphParts = [];
    if (!text) return;
    if (currentSub) currentSub.paragraphs.push(text);
    else paragraphs.push(text);
    listMode = isListIntro(text);
  }

  function flushSubsection() {
    if (!currentSub) return;
    flushParagraph();
    subsections.push(currentSub);
    currentSub = null;
    listMode = false;
  }

  function addBullet(item) {
    const clean = item.replace(/;\s*(and)?\s*$/i, "").trim();
    if (!clean) return;
    if (currentSub) currentSub.bullets.push(clean);
    else bullets.push(clean);
  }

  for (const line of contentLines) {
    const trimmed = line.trim();
    if (shouldSkip(trimmed)) continue;

    if (isSubsectionHeader(trimmed)) {
      flushSubsection();
      flushParagraph();
      currentSub = { title: trimmed, paragraphs: [], bullets: [] };
      listMode = false;
      continue;
    }

    if (isListItem(trimmed)) {
      flushParagraph();
      addBullet(trimmed);
      listMode = true;
      continue;
    }

    if (listMode && !looksLikeParagraphStart(trimmed) && trimmed.length < 200) {
      flushParagraph();
      addBullet(trimmed);
      continue;
    }

    if (listMode && looksLikeParagraphStart(trimmed)) {
      listMode = false;
    }

    paragraphParts.push(trimmed);
  }

  flushSubsection();
  flushParagraph();

  return { paragraphs, bullets, subsections };
}

// Intro: after header block until section 1
const introStart = lines.findIndex((l) => l.trim().startsWith('Finekarts Inc. ("Finekarts'));
const section1Index = lines.findIndex((l) => /^1\.\s+PURPOSE/.test(l.trim()));

const introLines = lines.slice(introStart, section1Index);
const intro = [];
let introParts = [];
for (const line of introLines) {
  const t = line.trim();
  if (!t || t.startsWith("Effective Date") || t.startsWith("Last Updated")) continue;
  if (t === "PRIVACY POLICY" || t === "FINEKARTS INC.") continue;
  introParts.push(t);
}
if (introParts.length) {
  intro.push(
    'Finekarts Inc. ("Finekarts," "we," "us," "our") respects the privacy of individuals and is committed to protecting personal information collected through our website, online platforms, business communications, customer and supplier relationships, commodity-trading activities, procurement activities, and related services.',
    "This Privacy Policy explains how Finekarts collects, uses, discloses, stores, protects, and otherwise processes personal information.",
    "By accessing or using the Finekarts website or providing personal information to Finekarts, you acknowledge that you have read and understood this Privacy Policy.",
    "If you do not agree with this Privacy Policy, please do not use the website or provide personal information through our online services.",
  );
}

// Collect sections
const sections = [];
let i = section1Index;

while (i < lines.length) {
  const line = lines[i].trim();
  if (!isSectionHeader(line)) {
    i++;
    continue;
  }

  const idMatch = line.match(/^(\d+)\.\s+(.+)$/);
  let id = idMatch[1];
  let title = `${id}. ${idMatch[2]}`;
  i++;

  // Multi-line section title (e.g. "INFORMATION" on next line)
  while (i < lines.length) {
    const next = lines[i].trim();
    if (!next) {
      i++;
      continue;
    }
    if (isSectionHeader(next) || isSubsectionHeader(next)) break;
    if (isTitleContinuation(next)) {
      title += ` ${next}`;
      i++;
      continue;
    }
    break;
  }

  const contentLines = [];
  while (i < lines.length) {
    const next = lines[i].trim();
    if (isSectionHeader(next)) break;
    contentLines.push(lines[i]);
    i++;
  }

  const parsed = parseContent(contentLines);
  sections.push({
    id,
    title,
    paragraphs: parsed.paragraphs,
    bullets: parsed.bullets,
    subsections: parsed.subsections,
  });
}

const doc = {
  company: "FINEKARTS INC.",
  title: "PRIVACY POLICY",
  effectiveDate: "September 7, 2026",
  lastUpdated: "September 7, 2026",
  intro,
  sections,
  closing: [],
};

// Section 111 footer details
const s111 = sections.find((s) => s.id === "111");
if (s111) {
  s111.paragraphs = [
    "Effective Date: September 7, 2026",
    "Last Updated: September 7, 2026",
    "Finekarts Inc.",
    "International Commodity Trading & Distribution",
    "Privacy Contact: Info@finekarts.com",
    "Website: https://www.finekarts.com",
  ];
  s111.bullets = [];
}

// Section 100 contact
const s100 = sections.find((s) => s.id === "100");
if (s100) {
  s100.paragraphs = [
    "Privacy-related questions, requests, complaints, or concerns may be directed to:",
    "Finekarts Inc.",
    "Privacy Officer: Finekarts Inc.",
    "Address: 4275 Village Center Court, Mississauga, Ontario L4Z 1V3, Canada",
    "Email: Info@finekarts.com",
    "Telephone: +1 (416) 985-8772",
    "Website: https://www.finekarts.com",
    "For privacy requests, please clearly identify the nature of your request and provide sufficient information to allow Finekarts to respond.",
  ];
  s100.bullets = [];
}

fs.writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`Wrote ${sections.length} sections to ${outPath}`);

// Quick validation
const emptyBullets = sections.filter(
  (s) =>
    s.bullets.length === 0 &&
    s.subsections.length === 0 &&
    s.paragraphs.some((p) => /^\d+\.$/.test(p)),
);
if (emptyBullets.length) {
  console.warn("Sections with orphan numbering in paragraphs:", emptyBullets.map((s) => s.id));
}
