import { cmsField, cmsLines, cmsSection, type CmsSectionMap } from "@/lib/content/cms-field";
import { INSPECTIONS_SECTION_IMAGES } from "@/lib/content/inspections-images";
import {
  INSPECTIONS_COMMODITY_COMPARISON,
  INSPECTIONS_COMMODITY_VALIDATION,
  INSPECTIONS_CTA,
  INSPECTIONS_HERO,
  INSPECTIONS_METHOD_TYPES,
  INSPECTIONS_SCOPE_TYPES,
  INSPECTIONS_TIMING_TYPES,
  INSPECTIONS_VERIFICATION_SUMMARY,
} from "@/lib/content/inspections-operational-content";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

/** Admin section ids for /inspections (hero is handled by CmsPageHero). */
export const INSPECTION_CMS_SECTION_IDS = [
  "overview",
  "timing",
  "methodology",
  "scope",
  "verification-summary",
  "commodity-validation",
  "commodity-comparison",
  "firm-videos",
  "cta",
] as const;

export const INSPECTION_FIRM_VIDEOS_DEFAULTS = {
  eyebrow: "Firms we may appoint",
  title: "Overview videos from recognized inspection organizations",
  lead: "Finekarts coordinates these brands when contracts require independent evidence — certificates are issued under their mandate, not by Finekarts.",
} as const;

/*
 * Card text format (admin textarea): cards are separated by a blank line.
 *   Line 1            card title
 *   Purpose: ...      (timing / methodology)
 *   Focus: ...
 *   Benefit: ...
 *   Any other plain line = lead sentence (scope / validation areas)
 *   • bullet line     = bullet / technique
 */
export type InspectionCard = {
  title: string;
  purpose: string;
  focus: string;
  benefit: string;
  lead: string;
  bullets: string[];
};

type CardInput = {
  title: string;
  purpose?: string;
  focus?: string;
  benefit?: string;
  lead?: string;
  techniques?: readonly string[];
  bullets?: readonly string[];
};

export function formatInspectionCards(items: ReadonlyArray<CardInput>): string {
  return items
    .map((item) => {
      const lines = [item.title];
      if (item.purpose) lines.push(`Purpose: ${item.purpose}`);
      if (item.focus) lines.push(`Focus: ${item.focus}`);
      if (item.lead) lines.push(item.lead);
      for (const b of item.techniques ?? item.bullets ?? []) lines.push(`• ${b}`);
      if (item.benefit) lines.push(`Benefit: ${item.benefit}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

export function parseCards(raw: string | undefined, fallback: InspectionCard[]): InspectionCard[] {
  const text = raw?.trim();
  if (!text) return fallback;
  const cards = text
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const card: InspectionCard = {
        title: lines[0] ?? "",
        purpose: "",
        focus: "",
        benefit: "",
        lead: "",
        bullets: [],
      };
      for (const line of lines.slice(1)) {
        if (/^purpose:/i.test(line)) card.purpose = line.replace(/^purpose:\s*/i, "");
        else if (/^focus:/i.test(line)) card.focus = line.replace(/^focus:\s*/i, "");
        else if (/^benefit:/i.test(line)) card.benefit = line.replace(/^benefit:\s*/i, "");
        else if (/^[•\-*]\s+/.test(line)) card.bullets.push(line.replace(/^[•\-*]\s+/, ""));
        else card.lead = card.lead ? `${card.lead} ${line}` : line;
      }
      return card;
    })
    .filter((c) => c.title);
  return cards.length ? cards : fallback;
}

export function toCards(items: ReadonlyArray<CardInput>): InspectionCard[] {
  return items.map((i) => ({
    title: i.title,
    purpose: i.purpose ?? "",
    focus: i.focus ?? "",
    benefit: i.benefit ?? "",
    lead: i.lead ?? "",
    bullets: [...(i.techniques ?? i.bullets ?? [])],
  }));
}

/** Table row format: cells separated by " | ", one row per line. */
export function formatPipeRows(rows: ReadonlyArray<ReadonlyArray<string>>): string {
  return rows.map((r) => r.join(" | ")).join("\n");
}

export function parsePipeRows(
  cms: Record<string, string>,
  key: string,
  columns: number,
  fallback: string[][],
): string[][] {
  const lines = cmsLines(cms, key, []);
  if (!lines.length) return fallback;
  const rows = lines.map((l) => l.split("|").map((c) => c.trim()));
  if (rows.some((r) => r.length !== columns || r.some((c) => !c))) return fallback;
  return rows;
}

export function inspectionImage(
  cms: Record<string, string>,
  key: string,
  fallback: { src: string; alt: string },
) {
  const value = cms[key]?.trim();
  return { src: value ? resolveImageSrc(value) : fallback.src, alt: fallback.alt };
}

export function buildInspectionContent(cms: CmsSectionMap) {
  const img = INSPECTIONS_SECTION_IMAGES;
  const overviewF = cmsSection(cms, "overview");
  const timingF = cmsSection(cms, "timing");
  const methodF = cmsSection(cms, "methodology");
  const scopeF = cmsSection(cms, "scope");
  const summaryF = cmsSection(cms, "verification-summary");
  const validationF = cmsSection(cms, "commodity-validation");
  const comparisonF = cmsSection(cms, "commodity-comparison");
  const firmF = cmsSection(cms, "firm-videos");
  const ctaF = cmsSection(cms, "cta");

  const methodCards = parseCards(methodF.items, toCards(INSPECTIONS_METHOD_TYPES.items));
  const areas = parseCards(validationF.areaItems, toCards(INSPECTIONS_COMMODITY_VALIDATION.areas));

  return {
    overview: {
      eyebrow: cmsField(overviewF, "eyebrow", "Overview"),
      body: cmsField(overviewF, "body", INSPECTIONS_HERO.description),
      image: inspectionImage(overviewF, "image", img.intro),
    },
    timing: {
      title: cmsField(timingF, "title", INSPECTIONS_TIMING_TYPES.title),
      cards: parseCards(timingF.items, toCards(INSPECTIONS_TIMING_TYPES.items)),
    },
    methodology: {
      title: cmsField(methodF, "title", INSPECTIONS_METHOD_TYPES.title),
      cards: methodCards,
      images: [
        inspectionImage(methodF, "image1", img.visual),
        inspectionImage(methodF, "image2", img.ndt),
        inspectionImage(methodF, "image3", img.destructive),
        inspectionImage(methodF, "image4", img.dimensional),
      ],
    },
    scope: {
      title: cmsField(scopeF, "title", INSPECTIONS_SCOPE_TYPES.title),
      cards: parseCards(scopeF.items, toCards(INSPECTIONS_SCOPE_TYPES.items)),
      image: inspectionImage(scopeF, "image", img.regulatory),
    },
    summary: {
      title: cmsField(summaryF, "title", INSPECTIONS_VERIFICATION_SUMMARY.title),
      rows: parsePipeRows(
        summaryF,
        "rowItems",
        3,
        INSPECTIONS_VERIFICATION_SUMMARY.rows.map((r) => [r.type, r.focus, r.goal]),
      ),
    },
    validation: {
      title: cmsField(validationF, "title", INSPECTIONS_COMMODITY_VALIDATION.title),
      lead: cmsField(validationF, "lead", INSPECTIONS_COMMODITY_VALIDATION.lead),
      verification: cmsField(
        validationF,
        "distinctionVerification",
        INSPECTIONS_COMMODITY_VALIDATION.distinction.verification,
      ),
      validation: cmsField(
        validationF,
        "distinctionValidation",
        INSPECTIONS_COMMODITY_VALIDATION.distinction.validation,
      ),
      intro: cmsField(validationF, "intro", INSPECTIONS_COMMODITY_VALIDATION.intro),
      areas,
      bandImageSrc: inspectionImage(validationF, "image1", img.commodityBand).src,
      featureImage: inspectionImage(validationF, "image2", img.commodityFeature),
    },
    comparison: {
      title: cmsField(comparisonF, "title", INSPECTIONS_COMMODITY_COMPARISON.title),
      rows: parsePipeRows(
        comparisonF,
        "rowItems",
        4,
        INSPECTIONS_COMMODITY_COMPARISON.rows.map((r) => [r.aspect, r.focus, r.question, r.examples]),
      ),
    },
    firmVideos: {
      eyebrow: cmsField(firmF, "eyebrow", INSPECTION_FIRM_VIDEOS_DEFAULTS.eyebrow),
      title: cmsField(firmF, "title", INSPECTION_FIRM_VIDEOS_DEFAULTS.title),
      lead: cmsField(firmF, "lead", INSPECTION_FIRM_VIDEOS_DEFAULTS.lead),
    },
    cta: {
      eyebrow: cmsField(ctaF, "eyebrow", "Next step"),
      title: cmsField(ctaF, "title", INSPECTIONS_CTA.title),
      lead: cmsField(ctaF, "lead", INSPECTIONS_CTA.lead),
      primaryLabel: cmsField(ctaF, "primaryLabel", INSPECTIONS_CTA.primaryLabel),
      primaryHref: cmsField(ctaF, "primaryHref", INSPECTIONS_CTA.primaryHref),
      secondaryLabel: cmsField(ctaF, "secondaryLabel", INSPECTIONS_CTA.secondaryLabel),
      secondaryHref: cmsField(ctaF, "secondaryHref", INSPECTIONS_CTA.secondaryHref),
      shareTitle: cmsField(ctaF, "shareTitle", INSPECTIONS_CTA.shareTitle),
      shareItems: cmsLines(ctaF, "shareItems", [...INSPECTIONS_CTA.shareItems]),
    },
  };
}

export type InspectionContent = ReturnType<typeof buildInspectionContent>;
