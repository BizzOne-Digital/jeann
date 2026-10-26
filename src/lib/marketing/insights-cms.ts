import { cmsField, cmsLines, cmsSection, type CmsSectionMap } from "@/lib/content/cms-field";
import { INSIGHTS_SECTION_IMAGES } from "@/lib/content/insights-operational-images";
import {
  INSIGHTS_ARCHITECTURE,
  INSIGHTS_CONTAINMENT_MATRIX,
  INSIGHTS_CTA,
  INSIGHTS_HERO,
  INSIGHTS_LIFECYCLE,
  INSIGHTS_PROTOCOL,
  INSIGHTS_SOP,
  INSIGHTS_VALIDATION,
  INSIGHTS_VERIFICATION_VS_VALIDATION,
} from "@/lib/content/operational-insights-content";
import {
  INSIGHTS_PAGE_SPOTLIGHTS,
  PRODUCT_QUALITY_COMPLIANCE,
  type ProductSpotlight,
} from "@/lib/content/product-quality-spotlights";
import {
  formatInspectionCards,
  formatPipeRows,
  inspectionImage,
  parseCards,
  parsePipeRows,
  toCards,
} from "@/lib/marketing/inspection-cms";

/** Admin section ids for /insights (hero is handled by CmsPageHero). */
export const INSIGHTS_CMS_SECTION_IDS = [
  "quality-band",
  "intro",
  "architecture",
  "protocol",
  "validation",
  "validation-domains",
  "matrix",
  "sop",
  "cta",
] as const;

export const INSIGHTS_MATRIX_SCROLL_HINT =
  "Swipe or scroll horizontally on smaller screens to view all columns.";
export const INSIGHTS_PORTAL_LINK = {
  label: "Buyer portal — submit after sign-in",
  href: "/login",
} as const;

/** Spotlight cards: one per line, "Name | /link | Description". */
export function formatSpotlightRows(items: readonly ProductSpotlight[]): string[][] {
  return items.map((s) => [s.name, s.href, s.blurb]);
}

/** Registry defaults for /insights body sections (same constants the page renders). */
export function insightsSectionDefaults() {
  const img = INSIGHTS_SECTION_IMAGES;
  const vv = INSIGHTS_VERIFICATION_VS_VALIDATION;
  return {
    qualityBand: {
      eyebrow: PRODUCT_QUALITY_COMPLIANCE.eyebrow,
      title: PRODUCT_QUALITY_COMPLIANCE.title,
      lead: PRODUCT_QUALITY_COMPLIANCE.lead,
      bulletItems: PRODUCT_QUALITY_COMPLIANCE.bullets.join("\n"),
      cardItems: formatPipeRows(formatSpotlightRows(INSIGHTS_PAGE_SPOTLIGHTS)),
    },
    intro: {
      eyebrow: "Framework overview",
      lead: INSIGHTS_HERO.guideLead,
      image: img.introLab.src,
    },
    architecture: {
      title: INSIGHTS_ARCHITECTURE.title,
      lead: INSIGHTS_ARCHITECTURE.lead,
      lifecycleItems: formatInspectionCards(
        INSIGHTS_LIFECYCLE.map((s) => ({ title: s.phase, lead: s.subtitle, bullets: s.bullets })),
      ),
      compareTitle: vv.title,
      verificationLabel: vv.verification.label,
      verificationQuestion: vv.verification.question,
      verificationBody: vv.verification.body,
      validationLabel: vv.validation.label,
      validationQuestion: vv.validation.question,
      validationBody: vv.validation.body,
      image: img.architecture.src,
    },
    protocol: {
      title: INSIGHTS_PROTOCOL.title,
      lead: INSIGHTS_PROTOCOL.lead,
      pipelineItems: formatPipeRows(INSIGHTS_PROTOCOL.pipeline.map((p) => [p.label, p.note])),
      tierItems: formatPipeRows(INSIGHTS_PROTOCOL.tiers.map((t) => [t.title, t.body])),
      image1: img.protocolLabPrimary.src,
      image2: img.protocolLabSecondary.src,
    },
    validation: {
      title: INSIGHTS_VALIDATION.title,
      lead: INSIGHTS_VALIDATION.lead,
      pillarItems: INSIGHTS_VALIDATION.pillars.join("\n"),
    },
    domains: {
      domainItems: formatInspectionCards(INSIGHTS_VALIDATION.domains),
      image1: img.labValidation.src,
      image2: img.supplyChainValidation.src,
      image3: img.financeValidation.src,
      image4: img.ctrmValidation.src,
    },
    matrix: {
      title: INSIGHTS_CONTAINMENT_MATRIX.title,
      lead: INSIGHTS_CONTAINMENT_MATRIX.lead,
      rowItems: formatPipeRows(
        INSIGHTS_CONTAINMENT_MATRIX.rows.map((r) => [
          r.classification,
          r.specs,
          r.packaging,
          r.unit,
          r.hazards,
        ]),
      ),
      scrollHint: INSIGHTS_MATRIX_SCROLL_HINT,
    },
    sop: {
      title: INSIGHTS_SOP.title,
      lead: INSIGHTS_SOP.lead,
      phaseItems: formatInspectionCards(
        INSIGHTS_SOP.phases.map((p) => ({ title: p.title, bullets: p.items })),
      ),
    },
    cta: {
      title: INSIGHTS_CTA.title,
      lead: INSIGHTS_CTA.lead,
      primaryLabel: INSIGHTS_CTA.primaryLabel,
      primaryHref: INSIGHTS_CTA.primaryHref,
      secondaryLabel: INSIGHTS_CTA.secondaryLabel,
      secondaryHref: INSIGHTS_CTA.secondaryHref,
      shareTitle: INSIGHTS_CTA.shareTitle,
      shareItems: INSIGHTS_CTA.shareItems.join("\n"),
      portalLabel: INSIGHTS_PORTAL_LINK.label,
      portalHref: INSIGHTS_PORTAL_LINK.href,
    },
  };
}

export function buildInsightsContent(cms: CmsSectionMap) {
  const bandF = cmsSection(cms, "quality-band");
  const introF = cmsSection(cms, "intro");
  const archF = cmsSection(cms, "architecture");
  const protoF = cmsSection(cms, "protocol");
  const valF = cmsSection(cms, "validation");
  const domF = cmsSection(cms, "validation-domains");
  const matrixF = cmsSection(cms, "matrix");
  const sopF = cmsSection(cms, "sop");
  const ctaF = cmsSection(cms, "cta");
  const img = INSIGHTS_SECTION_IMAGES;
  const vv = INSIGHTS_VERIFICATION_VS_VALIDATION;

  const spotlightRows = parsePipeRows(
    bandF,
    "cardItems",
    3,
    formatSpotlightRows(INSIGHTS_PAGE_SPOTLIGHTS),
  );

  const domains = parseCards(
    domF.domainItems,
    toCards(INSIGHTS_VALIDATION.domains),
  );
  const domainImages = [
    inspectionImage(domF, "image1", img.labValidation),
    inspectionImage(domF, "image2", img.supplyChainValidation),
    inspectionImage(domF, "image3", img.financeValidation),
    inspectionImage(domF, "image4", img.ctrmValidation),
  ];

  return {
    qualityBand: {
      eyebrow: cmsField(bandF, "eyebrow", PRODUCT_QUALITY_COMPLIANCE.eyebrow),
      title: cmsField(bandF, "title", PRODUCT_QUALITY_COMPLIANCE.title),
      lead: cmsField(bandF, "lead", PRODUCT_QUALITY_COMPLIANCE.lead),
      bullets: cmsLines(bandF, "bulletItems", [...PRODUCT_QUALITY_COMPLIANCE.bullets]),
      spotlights: spotlightRows.map(([name, href, blurb]) => ({ name, href, blurb })),
    },
    intro: {
      eyebrow: cmsField(introF, "eyebrow", "Framework overview"),
      lead: cmsField(introF, "lead", INSIGHTS_HERO.guideLead),
      image: inspectionImage(introF, "image", img.introLab),
    },
    architecture: {
      title: cmsField(archF, "title", INSIGHTS_ARCHITECTURE.title),
      lead: cmsField(archF, "lead", INSIGHTS_ARCHITECTURE.lead),
      lifecycle: parseCards(archF.lifecycleItems, toCards(
        INSIGHTS_LIFECYCLE.map((s) => ({ title: s.phase, lead: s.subtitle, bullets: s.bullets })),
      )),
      compareTitle: cmsField(archF, "compareTitle", vv.title),
      verificationLabel: cmsField(archF, "verificationLabel", vv.verification.label),
      verificationQuestion: cmsField(archF, "verificationQuestion", vv.verification.question),
      verificationBody: cmsField(archF, "verificationBody", vv.verification.body),
      validationLabel: cmsField(archF, "validationLabel", vv.validation.label),
      validationQuestion: cmsField(archF, "validationQuestion", vv.validation.question),
      validationBody: cmsField(archF, "validationBody", vv.validation.body),
      image: inspectionImage(archF, "image", img.architecture),
    },
    protocol: {
      title: cmsField(protoF, "title", INSIGHTS_PROTOCOL.title),
      lead: cmsField(protoF, "lead", INSIGHTS_PROTOCOL.lead),
      pipeline: parsePipeRows(
        protoF,
        "pipelineItems",
        2,
        INSIGHTS_PROTOCOL.pipeline.map((p) => [p.label, p.note]),
      ),
      tiers: parsePipeRows(
        protoF,
        "tierItems",
        2,
        INSIGHTS_PROTOCOL.tiers.map((t) => [t.title, t.body]),
      ),
      imagePrimary: inspectionImage(protoF, "image1", img.protocolLabPrimary),
      imageSecondary: inspectionImage(protoF, "image2", img.protocolLabSecondary),
    },
    validation: {
      title: cmsField(valF, "title", INSIGHTS_VALIDATION.title),
      lead: cmsField(valF, "lead", INSIGHTS_VALIDATION.lead),
      pillars: cmsLines(valF, "pillarItems", [...INSIGHTS_VALIDATION.pillars]),
    },
    domains: domains.map((d, i) => ({ ...d, image: domainImages[i] })),
    matrix: {
      title: cmsField(matrixF, "title", INSIGHTS_CONTAINMENT_MATRIX.title),
      lead: cmsField(matrixF, "lead", INSIGHTS_CONTAINMENT_MATRIX.lead),
      rows: parsePipeRows(
        matrixF,
        "rowItems",
        5,
        INSIGHTS_CONTAINMENT_MATRIX.rows.map((r) => [
          r.classification,
          r.specs,
          r.packaging,
          r.unit,
          r.hazards,
        ]),
      ),
      scrollHint: cmsField(matrixF, "scrollHint", INSIGHTS_MATRIX_SCROLL_HINT),
    },
    sop: {
      title: cmsField(sopF, "title", INSIGHTS_SOP.title),
      lead: cmsField(sopF, "lead", INSIGHTS_SOP.lead),
      phases: parseCards(
        sopF.phaseItems,
        toCards(INSIGHTS_SOP.phases.map((p) => ({ title: p.title, bullets: p.items }))),
      ),
    },
    cta: {
      title: cmsField(ctaF, "title", INSIGHTS_CTA.title),
      lead: cmsField(ctaF, "lead", INSIGHTS_CTA.lead),
      primaryLabel: cmsField(ctaF, "primaryLabel", INSIGHTS_CTA.primaryLabel),
      primaryHref: cmsField(ctaF, "primaryHref", INSIGHTS_CTA.primaryHref),
      secondaryLabel: cmsField(ctaF, "secondaryLabel", INSIGHTS_CTA.secondaryLabel),
      secondaryHref: cmsField(ctaF, "secondaryHref", INSIGHTS_CTA.secondaryHref),
      shareTitle: cmsField(ctaF, "shareTitle", INSIGHTS_CTA.shareTitle),
      shareItems: cmsLines(ctaF, "shareItems", [...INSIGHTS_CTA.shareItems]),
      portalLabel: cmsField(ctaF, "portalLabel", INSIGHTS_PORTAL_LINK.label),
      portalHref: cmsField(ctaF, "portalHref", INSIGHTS_PORTAL_LINK.href),
    },
  };
}

export type InsightsContent = ReturnType<typeof buildInsightsContent>;
