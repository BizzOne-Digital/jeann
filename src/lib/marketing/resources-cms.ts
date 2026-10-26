import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsParagraphs,
  cmsSection,
} from "@/lib/content/cms-field";
import {
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS,
  COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE,
} from "@/lib/content/commodity-trade-document-checklist";
import {
  BANKING_CLAUSES,
  BANKING_CLAUSE_INTRO,
  BANKING_CLAUSE_SECTION_TITLE,
  BUYER_DATA_SECURITY_NOTE,
  ESCROW_LOCATION_NOTE,
  LC_ACCEPTED_BANKS_NOTE,
  LC_INSTRUMENTS_HIGHLIGHT,
  PAYMENT_TERMS_INTRO,
  PAYMENT_TERM_STRUCTURES,
  PREFERRED_PAYMENT_STRUCTURE,
  REVOLVING_LC_PROGRAMME_NOTE,
  SWIFT_INSTRUMENT_NOTE,
  TRANSACTION_PROGRAMME_TYPES,
} from "@/lib/content/payment-terms";
import {
  PRODUCT_QUALITY_COMPLIANCE,
  RESOURCES_PAGE_SPOTLIGHTS,
} from "@/lib/content/product-quality-spotlights";
import {
  RESOURCES_BANKING_PANEL_CALLOUTS,
  RESOURCES_DOCUMENT_GROUPS,
  RESOURCES_PILLARS,
  RESOURCES_RELATED_LINKS,
  RESOURCES_TRADE_PRIORITY_LINKS,
} from "@/lib/content/resources-content";
import { RESOURCES_PAGE_IMAGES } from "@/lib/content/resources-page-images";
import { RESOURCES_PAGE_INTRO } from "@/lib/content/resources-page-content";

/**
 * `/resources` CMS wiring. Every section default below is also the frontend fallback.
 *
 * List formats (one item per line, columns separated by " | "):
 * - bullets: one bullet per line
 * - cards / links: "Title | href | text" (see each field)
 * - documents: "Group | Document | Note"
 * - checklist: blocks separated by a blank line; first line = heading, other lines = items
 */

const NOT_ADVICE = " Not legal or banking advice.";

const downloadsParagraphs = [
  "**Official buyer form:** download the **Buyer Corporate Information Sheet (CIS)** PDF — that is the real qualification form Finekarts uses.",
  "**Educational checklist below:** a plain-language index of documents that often appear in bulk commodity trade. It is a *dummy / reference* only — not a complete or binding list for any specific deal.",
  "Confirm final document sets with counsel, your bank, and the signed PSA.",
];

export const RESOURCES_INTRO_BODY_DEFAULT =
  "Prioritize CIF trade insurance, PSA banking clauses, and payment structures before downloads. Document sets vary by product, corridor, bank, and contract — lists below are starting points, not guarantees.";

export const RESOURCES_SECTION_DEFAULTS: Record<string, Record<string, string>> = {
  intro: {
    eyebrow: RESOURCES_PAGE_INTRO.eyebrow,
    title: RESOURCES_PAGE_INTRO.title,
    lead: RESOURCES_PAGE_INTRO.lead,
    bullets: RESOURCES_PAGE_INTRO.bullets.join("\n"),
  },
  spotlight: {
    eyebrow: PRODUCT_QUALITY_COMPLIANCE.eyebrow,
    title: PRODUCT_QUALITY_COMPLIANCE.title,
    lead: PRODUCT_QUALITY_COMPLIANCE.lead,
    bullets: PRODUCT_QUALITY_COMPLIANCE.bullets.join("\n"),
    cards: RESOURCES_PAGE_SPOTLIGHTS.map((c) => `${c.name} | ${c.href} | ${c.blurb}`).join("\n"),
  },
  priority: {
    eyebrow: "Start here",
    title: "CIF, trade insurance, payments, and dispute resolution",
    links: RESOURCES_TRADE_PRIORITY_LINKS.map((l) => `${l.label} | ${l.href} | ${l.note}`).join("\n"),
  },
  library: {
    eyebrow: "Resource library",
    title: "Banking, payments, and trade documents — downloads are supplementary",
  },
  banking: {
    eyebrow: "SPA reference",
    title: "Recommended banking clause for commodity SPA",
    imageSrc: RESOURCES_PAGE_IMAGES.bankingPanelBackground.src,
    imageAlt: RESOURCES_PAGE_IMAGES.banking.alt,
    callouts: RESOURCES_BANKING_PANEL_CALLOUTS.map(
      (c) => `${c.title} | ${c.body} | ${c.href ?? ""}`,
    ).join("\n"),
    clausesTitle: BANKING_CLAUSE_SECTION_TITLE,
    clausesIntro: `${BANKING_CLAUSE_INTRO}${NOT_ADVICE}`,
    clauses: BANKING_CLAUSES.map((c) => `${c.title} | ${c.body}`).join("\n"),
    preferredLabel: "Preferred approach",
    preferredBody: PREFERRED_PAYMENT_STRUCTURE,
  },
  payments: {
    eyebrow: "Payment structures",
    title: "Best structure for 12-month commodity contracts",
    imageSrc: RESOURCES_PAGE_IMAGES.payments.src,
    imageAlt: RESOURCES_PAGE_IMAGES.payments.alt,
    bannerText:
      "Programme payment design should match delivery cadence, inspection timing, and how your bank ranks instruments.",
    intro: `${PAYMENT_TERMS_INTRO}${NOT_ADVICE}`,
    banksNote: LC_ACCEPTED_BANKS_NOTE,
    highlight: LC_INSTRUMENTS_HIGHLIGHT,
    programmesLabel: "Programme types",
    programmes: TRANSACTION_PROGRAMME_TYPES.map(
      (p) => `${p.deliveries} | ${p.title} | ${p.summary} | ${p.typicalPayment}`,
    ).join("\n"),
    revolvingNote: REVOLVING_LC_PROGRAMME_NOTE,
    escrowNote: ESCROW_LOCATION_NOTE,
    securityLabel: "Data security",
    securityNote: BUYER_DATA_SECURITY_NOTE,
    structures: PAYMENT_TERM_STRUCTURES.map(
      (r) =>
        `${r.structure} | ${r.primaryFunction} | ${r.iccCode} | ${r.buyerProtection} | ${r.sellerProtection} | ${r.recommended ? "top" : ""}`,
    ).join("\n"),
    topRankedLabel: "Top ranked",
    swiftLabel: "SWIFT vs banking instruments",
    swiftNote: SWIFT_INSTRUMENT_NOTE,
  },
  documents: {
    eyebrow: "Document overview",
    title: "What buyers typically review",
    groups: RESOURCES_DOCUMENT_GROUPS.flatMap((g) =>
      g.items.map((i) => `${g.title} | ${i.name} | ${i.note}`),
    ).join("\n"),
    introBody: RESOURCES_INTRO_BODY_DEFAULT,
    imageSrc: RESOURCES_PAGE_IMAGES.documents.src,
    imageAlt: RESOURCES_PAGE_IMAGES.documents.alt,
    relatedLinks: RESOURCES_RELATED_LINKS.map((l) => `${l.label} | ${l.href}`).join("\n"),
  },
  downloads: {
    eyebrow: "Downloads",
    title: "Commodity trade document checklist",
    imageSrc: RESOURCES_PAGE_IMAGES.downloads.src,
    imageAlt: RESOURCES_PAGE_IMAGES.downloads.alt,
    bannerText: "Use downloads as a study aid — the buyer CIS and signed PSA remain authoritative.",
    paragraphs: downloadsParagraphs.join("\n\n"),
    checklistEyebrow: "Reference checklist",
    checklistTitle: COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE,
    checklistSections: COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS.map(
      (s) => [s.title, ...s.items].join("\n"),
    ).join("\n\n"),
    checklistNoteLabel: "Important note",
    checklistNote: COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE,
    legalTitle: "Legal & trade documents (PDF)",
  },
};

export const RESOURCES_CMS_SECTION_IDS = [
  "intro",
  "spotlight",
  "priority",
  "library",
  "pillar-1",
  "pillar-2",
  "pillar-3",
  "pillar-4",
  "banking",
  "payments",
  "documents",
  "downloads",
] as const;

function parseCols(lines: string[], min: number) {
  return lines
    .map((l) => l.split("|").map((c) => c.trim()))
    .filter((cols) => cols.length >= min && cols.slice(0, min).every((c, i) => c || i >= min));
}

function f(sec: Record<string, string>, id: string, key: string) {
  return cmsField(sec, key, RESOURCES_SECTION_DEFAULTS[id][key] ?? "");
}

function lines(sec: Record<string, string>, id: string, key: string) {
  const def = RESOURCES_SECTION_DEFAULTS[id][key] ?? "";
  return cmsLines(sec, key, def.split("\n"));
}

/** Parsed rows; falls back to the default rows when edited text has no valid lines. */
function rows(sec: Record<string, string>, id: string, key: string, min: number) {
  const parsed = parseCols(lines(sec, id, key), min);
  if (parsed.length) return parsed;
  return parseCols((RESOURCES_SECTION_DEFAULTS[id][key] ?? "").split("\n"), min);
}

function num(v: string, fallback: number) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(5, Math.max(0, n)) : fallback;
}

export type ResourcesCms = ReturnType<typeof resolveResourcesCms>;

export function resolveResourcesCms(sections: CmsSectionMap | undefined) {
  const s = (id: string) => cmsSection(sections, id);
  const intro = s("intro");
  const spot = s("spotlight");
  const prio = s("priority");
  const lib = s("library");
  const bank = s("banking");
  const pay = s("payments");
  const docs = s("documents");
  const dl = s("downloads");

  const pillars = RESOURCES_PILLARS.map((p, i) => {
    const sec = s(`pillar-${i + 1}`);
    return {
      ...p,
      title: cmsField(sec, "title", p.title),
      summary: cmsField(sec, "summary", p.summary),
    };
  });

  const groupMap = new Map<string, { id: string; title: string; items: { name: string; note: string }[] }>();
  for (const [group, name, note] of rows(docs, "documents", "groups", 3)) {
    if (!groupMap.has(group)) groupMap.set(group, { id: group, title: group, items: [] });
    groupMap.get(group)!.items.push({ name, note });
  }

  return {
    intro: {
      eyebrow: f(intro, "intro", "eyebrow"),
      title: f(intro, "intro", "title"),
      lead: f(intro, "intro", "lead"),
      bullets: lines(intro, "intro", "bullets"),
    },
    spotlight: {
      eyebrow: f(spot, "spotlight", "eyebrow"),
      title: f(spot, "spotlight", "title"),
      lead: f(spot, "spotlight", "lead"),
      bullets: lines(spot, "spotlight", "bullets"),
      cards: rows(spot, "spotlight", "cards", 3).map(([name, href, blurb]) => ({ name, href, blurb })),
    },
    priority: {
      eyebrow: f(prio, "priority", "eyebrow"),
      title: f(prio, "priority", "title"),
      links: rows(prio, "priority", "links", 3).map(([label, href, note]) => ({ label, href, note })),
    },
    library: {
      eyebrow: f(lib, "library", "eyebrow"),
      title: f(lib, "library", "title"),
      pillars,
    },
    banking: {
      eyebrow: f(bank, "banking", "eyebrow"),
      title: f(bank, "banking", "title"),
      imageSrc: f(bank, "banking", "imageSrc"),
      imageAlt: cmsField(bank, "imageAlt", RESOURCES_SECTION_DEFAULTS.banking.imageAlt),
      callouts: rows(bank, "banking", "callouts", 2).map(([title, body, href]) => ({
        title,
        body,
        href: href || null,
      })),
      clausesTitle: f(bank, "banking", "clausesTitle"),
      clausesIntro: f(bank, "banking", "clausesIntro"),
      clauses: rows(bank, "banking", "clauses", 2).map(([title, body]) => ({ title, body })),
      preferredLabel: f(bank, "banking", "preferredLabel"),
      preferredBody: f(bank, "banking", "preferredBody"),
    },
    payments: {
      eyebrow: f(pay, "payments", "eyebrow"),
      title: f(pay, "payments", "title"),
      imageSrc: f(pay, "payments", "imageSrc"),
      imageAlt: f(pay, "payments", "imageAlt"),
      bannerText: f(pay, "payments", "bannerText"),
      intro: f(pay, "payments", "intro"),
      banksNote: f(pay, "payments", "banksNote"),
      highlight: f(pay, "payments", "highlight"),
      programmesLabel: f(pay, "payments", "programmesLabel"),
      programmes: rows(pay, "payments", "programmes", 4).map(([deliveries, title, summary, typicalPayment], i) => ({
        id: `${i}`,
        deliveries,
        title,
        summary,
        typicalPayment,
      })),
      revolvingNote: f(pay, "payments", "revolvingNote"),
      escrowNote: f(pay, "payments", "escrowNote"),
      securityLabel: f(pay, "payments", "securityLabel"),
      securityNote: f(pay, "payments", "securityNote"),
      structures: rows(pay, "payments", "structures", 5).map(
        ([structure, primaryFunction, iccCode, buyer, seller, top], i) => ({
          id: `${i}`,
          structure,
          primaryFunction,
          iccCode,
          buyerProtection: num(buyer, 3),
          sellerProtection: num(seller, 3),
          recommended: top?.toLowerCase() === "top",
        }),
      ),
      topRankedLabel: f(pay, "payments", "topRankedLabel"),
      swiftLabel: f(pay, "payments", "swiftLabel"),
      swiftNote: f(pay, "payments", "swiftNote"),
    },
    documents: {
      eyebrow: f(docs, "documents", "eyebrow"),
      title: f(docs, "documents", "title"),
      groups: [...groupMap.values()],
      introBody: f(docs, "documents", "introBody"),
      imageSrc: f(docs, "documents", "imageSrc"),
      imageAlt: f(docs, "documents", "imageAlt"),
      relatedLinks: rows(docs, "documents", "relatedLinks", 2).map(([label, href]) => ({ label, href })),
    },
    downloads: {
      eyebrow: f(dl, "downloads", "eyebrow"),
      title: f(dl, "downloads", "title"),
      imageSrc: f(dl, "downloads", "imageSrc"),
      imageAlt: f(dl, "downloads", "imageAlt"),
      bannerText: f(dl, "downloads", "bannerText"),
      paragraphs: cmsParagraphs(dl, "paragraphs", downloadsParagraphs),
      checklist: {
        eyebrow: f(dl, "downloads", "checklistEyebrow"),
        title: f(dl, "downloads", "checklistTitle"),
        sections: cmsParagraphs(
          dl,
          "checklistSections",
          RESOURCES_SECTION_DEFAULTS.downloads.checklistSections.split("\n\n"),
        ).map((block) => {
          const [title, ...items] = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          return { title, items };
        }),
        noteLabel: f(dl, "downloads", "checklistNoteLabel"),
        note: f(dl, "downloads", "checklistNote"),
      },
      legalTitle: f(dl, "downloads", "legalTitle"),
    },
  };
}
