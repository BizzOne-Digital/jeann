import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsSection,
} from "@/lib/content/cms-field";
import {
  PACKAGING_CONTAINMENT_COMPARISON,
  PACKAGING_DRY_SOFT,
  PACKAGING_HARD,
  PACKAGING_LIQUID,
  PACKAGING_MARITIME,
  PACKAGING_PAGE_CTA,
  PACKAGING_PAGE_HERO,
  PACKAGING_SUMMARY_MATRIX,
  type PackagingSubsection,
} from "@/lib/content/packaging-page-content";
import { PACKAGING_PAGE_IMAGES } from "@/lib/content/packaging-page-images";

/**
 * `/packaging` CMS wiring. Defaults here are also the frontend fallbacks.
 *
 * Card format (textarea, one line each):
 *   first line            = card title
 *   Description: ...      Capacity: ...   Mechanism: ...   Structure: ...
 *   Use: ...              Key considerations: ...            Primary goods: ...
 *   - text                = bullet (key features list)
 *   * text                = bullet (extra bullets, shown after key considerations)
 * Table rows: columns separated by " | ", one row per line.
 */

type CardSource = Partial<Omit<PackagingSubsection, "id" | "letter" | "primaryGoods">> & {
  title: string;
  primaryGoods?: string;
  keyFeatures?: readonly string[];
  bullets?: readonly string[];
};

const LABELS: Array<[keyof PackagingSubsection, string]> = [
  ["description", "Description"],
  ["capacity", "Capacity"],
  ["mechanism", "Mechanism"],
  ["structure", "Structure"],
  ["use", "Use"],
  ["keyConsiderations", "Key considerations"],
  ["primaryGoods", "Primary goods"],
];

export function encodePackagingCard(sub: CardSource): string {
  const out = [sub.title];
  for (const [key, label] of LABELS) {
    const v = sub[key as keyof CardSource];
    if (typeof v === "string" && v) out.push(`${label}: ${v}`);
  }
  for (const f of sub.keyFeatures ?? []) out.push(`- ${f}`);
  for (const b of sub.bullets ?? []) out.push(`* ${b}`);
  return out.join("\n");
}

function parsePackagingCard(raw: string | undefined, fallback: CardSource): PackagingSubsection {
  const text = raw?.trim();
  const source = text || encodePackagingCard(fallback);
  const lines = source.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const [title, ...rest] = lines;
  const item: PackagingSubsection = { id: "", letter: "", title, primaryGoods: "" };
  const keyFeatures: string[] = [];
  const bullets: string[] = [];
  for (const line of rest) {
    if (line.startsWith("- ")) {
      keyFeatures.push(line.slice(2).trim());
      continue;
    }
    if (line.startsWith("* ")) {
      bullets.push(line.slice(2).trim());
      continue;
    }
    for (const [key, label] of LABELS) {
      const prefix = `${label}:`;
      if (line.toLowerCase().startsWith(prefix.toLowerCase())) {
        (item as Record<string, unknown>)[key] = line.slice(prefix.length).trim();
        break;
      }
    }
  }
  if (keyFeatures.length) item.keyFeatures = keyFeatures;
  if (bullets.length) item.bullets = bullets;
  if (!item.primaryGoods && item.use) item.primaryGoods = item.use;
  return item;
}

type ImageRef = { src: string; alt: string };

type CardGroup = { prefix: string; cards: CardSource[]; images: ImageRef[] };

const D = PACKAGING_PAGE_IMAGES;
const M = PACKAGING_MARITIME;

const GROUPS: Record<string, CardGroup[]> = {
  "dry-soft": [
    {
      prefix: "card",
      cards: PACKAGING_DRY_SOFT.subsections,
      images: [D.dryFibc, D.dryPpBags, D.dryJute, D.dryLiner],
    },
  ],
  liquid: [
    {
      prefix: "card",
      cards: PACKAGING_LIQUID.subsections,
      images: [D.liquidFlexi, D.liquidIso, D.liquidDrums],
    },
  ],
  hard: [
    {
      prefix: "card",
      cards: PACKAGING_HARD.subsections,
      images: [D.hardBundles, D.hardFibc, D.hardBreakbulk],
    },
  ],
  maritime: [
    {
      prefix: "dryVessel",
      cards: M.dryVessel.subsections,
      images: [D.vesselDryHold, D.vesselContainerLiner],
    },
    {
      prefix: "liquidVessel",
      cards: M.liquidVessel.subsections,
      images: [D.vesselLiquidTanks, D.vesselFlexiAtSea],
    },
    { prefix: "gasVessel", cards: M.gasVessel.subsections, images: [] },
  ],
};

function cardFieldDefaults(sectionId: string) {
  const out: Record<string, string> = {};
  for (const g of GROUPS[sectionId]) {
    g.cards.forEach((card, i) => {
      out[`${g.prefix}${i + 1}Body`] = encodePackagingCard(card);
      if (g.images[i]) out[`${g.prefix}${i + 1}Image`] = g.images[i].src;
    });
  }
  return out;
}

const ROW_HEADERS = {
  summary: [
    "Commodity type",
    "Standard bulk packaging",
    "Typical unit weight / volume",
    "Primary protection requirement",
  ],
  containment: [
    "Containment type",
    "Primary vessel / transport",
    "Unit capacity range",
    "Primary commodity applications",
  ],
};

export const PACKAGING_SECTION_DEFAULTS: Record<string, Record<string, string>> = {
  overview: {
    eyebrow: "Overview",
    description: PACKAGING_PAGE_HERO.description,
    categoriesLead: PACKAGING_PAGE_HERO.categoriesLead,
    imageSrc: D.intro.src,
  },
  "dry-soft": {
    title: PACKAGING_DRY_SOFT.title,
    example: PACKAGING_DRY_SOFT.example,
    lead: PACKAGING_DRY_SOFT.lead,
    ...cardFieldDefaults("dry-soft"),
  },
  liquid: {
    title: PACKAGING_LIQUID.title,
    example: PACKAGING_LIQUID.example,
    lead: PACKAGING_LIQUID.lead,
    ...cardFieldDefaults("liquid"),
  },
  hard: {
    title: PACKAGING_HARD.title,
    example: PACKAGING_HARD.example,
    lead: PACKAGING_HARD.lead,
    ...cardFieldDefaults("hard"),
  },
  maritime: {
    title: M.title,
    lead: M.lead,
    dryVesselTitle: M.dryVessel.title,
    liquidVesselTitle: M.liquidVessel.title,
    gasVesselTitle: M.gasVessel.title,
    gasVesselLead: M.gasVessel.lead,
    gasVesselImage: D.vesselRail.src,
    ...cardFieldDefaults("maritime"),
  },
  "summary-matrix": {
    title: PACKAGING_SUMMARY_MATRIX.title,
    headers: ROW_HEADERS.summary.join(" | "),
    rows: PACKAGING_SUMMARY_MATRIX.rows
      .map((r) => `${r.commodity} | ${r.packaging} | ${r.unit} | ${r.protection}`)
      .join("\n"),
  },
  "containment-comparison": {
    title: PACKAGING_CONTAINMENT_COMPARISON.title,
    headers: ROW_HEADERS.containment.join(" | "),
    rows: PACKAGING_CONTAINMENT_COMPARISON.rows
      .map((r) => `${r.type} | ${r.vessel} | ${r.capacity} | ${r.applications}`)
      .join("\n"),
  },
  cta: {
    title: PACKAGING_PAGE_CTA.title,
    lead: PACKAGING_PAGE_CTA.lead,
    shareTitle: PACKAGING_PAGE_CTA.shareTitle,
    shareItems: PACKAGING_PAGE_CTA.shareItems.join("\n"),
    primaryCtaLabel: PACKAGING_PAGE_CTA.primaryLabel,
    primaryCtaHref: PACKAGING_PAGE_CTA.primaryHref,
    secondaryCtaLabel: PACKAGING_PAGE_CTA.secondaryLabel,
    secondaryCtaHref: PACKAGING_PAGE_CTA.secondaryHref,
  },
};

export const PACKAGING_CMS_SECTION_IDS = [
  "overview",
  "dry-soft",
  "liquid",
  "hard",
  "maritime",
  "summary-matrix",
  "containment-comparison",
  "cta",
] as const;

function table(sec: Record<string, string>, id: string) {
  const def = PACKAGING_SECTION_DEFAULTS[id];
  const parse = (l: string) => l.split("|").map((c) => c.trim());
  const headers = parse(cmsField(sec, "headers", def.headers));
  const rows = cmsLines(sec, "rows", def.rows.split("\n"))
    .map(parse)
    .filter((c) => c.length >= 4);
  return {
    title: cmsField(sec, "title", def.title),
    headers: headers.length >= 4 ? headers : parse(def.headers),
    rows: rows.length ? rows : def.rows.split("\n").map(parse),
  };
}

export type PackagingCardView = { item: PackagingSubsection; image: ImageRef };

function cardsFor(sec: Record<string, string>, sectionId: string, groupIndex = 0): PackagingCardView[] {
  const g = GROUPS[sectionId][groupIndex];
  return g.cards.map((fallback, i) => ({
    item: parsePackagingCard(sec[`${g.prefix}${i + 1}Body`], fallback),
    image: {
      src: cmsField(sec, `${g.prefix}${i + 1}Image`, g.images[i]?.src ?? ""),
      alt: g.images[i]?.alt ?? "",
    },
  }));
}

export type PackagingCms = ReturnType<typeof resolvePackagingCms>;

export function resolvePackagingCms(sections: CmsSectionMap | undefined) {
  const s = (id: string) => cmsSection(sections, id);
  const def = PACKAGING_SECTION_DEFAULTS;
  const overview = s("overview");
  const mar = s("maritime");
  const cta = s("cta");

  const head = (id: string) => {
    const sec = s(id);
    return {
      title: cmsField(sec, "title", def[id].title),
      example: cmsField(sec, "example", def[id].example),
      lead: cmsField(sec, "lead", def[id].lead),
    };
  };

  return {
    overview: {
      eyebrow: cmsField(overview, "eyebrow", def.overview.eyebrow),
      description: cmsField(overview, "description", def.overview.description),
      categoriesLead: cmsField(overview, "categoriesLead", def.overview.categoriesLead),
      image: {
        src: cmsField(overview, "imageSrc", def.overview.imageSrc),
        alt: D.intro.alt,
      },
    },
    dry: { ...head("dry-soft"), cards: cardsFor(s("dry-soft"), "dry-soft") },
    liquid: { ...head("liquid"), cards: cardsFor(s("liquid"), "liquid") },
    hard: { ...head("hard"), cards: cardsFor(s("hard"), "hard") },
    maritime: {
      title: cmsField(mar, "title", def.maritime.title),
      lead: cmsField(mar, "lead", def.maritime.lead),
      dryTitle: cmsField(mar, "dryVesselTitle", def.maritime.dryVesselTitle),
      liquidTitle: cmsField(mar, "liquidVesselTitle", def.maritime.liquidVesselTitle),
      gasTitle: cmsField(mar, "gasVesselTitle", def.maritime.gasVesselTitle),
      gasLead: cmsField(mar, "gasVesselLead", def.maritime.gasVesselLead),
      gasImage: {
        src: cmsField(mar, "gasVesselImage", def.maritime.gasVesselImage),
        alt: D.vesselRail.alt,
      },
      dryCards: cardsFor(mar, "maritime", 0),
      liquidCards: cardsFor(mar, "maritime", 1),
      gasCards: cardsFor(mar, "maritime", 2),
    },
    summary: table(s("summary-matrix"), "summary-matrix"),
    containment: table(s("containment-comparison"), "containment-comparison"),
    cta: {
      title: cmsField(cta, "title", def.cta.title),
      lead: cmsField(cta, "lead", def.cta.lead),
      shareTitle: cmsField(cta, "shareTitle", def.cta.shareTitle),
      shareItems: cmsLines(cta, "shareItems", def.cta.shareItems.split("\n")),
      primaryLabel: cmsField(cta, "primaryCtaLabel", def.cta.primaryCtaLabel),
      primaryHref: cmsField(cta, "primaryCtaHref", def.cta.primaryCtaHref),
      secondaryLabel: cmsField(cta, "secondaryCtaLabel", def.cta.secondaryCtaLabel),
      secondaryHref: cmsField(cta, "secondaryCtaHref", def.cta.secondaryCtaHref),
    },
  };
}
