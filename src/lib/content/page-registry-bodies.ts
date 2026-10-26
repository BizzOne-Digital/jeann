import {
  ABOUT_CONTACT,
  ABOUT_HIGHLIGHTS,
  ABOUT_INTRO,
  ABOUT_SUPPLY_CHAIN,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY_PARTNER,
} from "@/lib/content/about-content";
import { ABOUT_SECTION_IMAGE_META } from "@/lib/content/about-images";
import {
  DISPUTE_CTA,
  DISPUTE_DISCLAIMER,
  DISPUTE_DOCUMENTATION,
  DISPUTE_FAIRNESS,
  DISPUTE_HERO,
  DISPUTE_PARTNERS,
  DISPUTE_PAYMENTS,
  DISPUTE_PROCESS_STEPS,
  DISPUTE_QUALITY_SAFETY,
  DISPUTE_RESPONSIBILITIES,
} from "@/lib/content/dispute-resolution-content";
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
import { INSIGHTS_HERO } from "@/lib/content/operational-insights-content";
import { insightsSectionDefaults } from "@/lib/marketing/insights-cms";
import { LOGISTICS_STORY } from "@/lib/content/logistics-story";
import { VERIFICATION_STORY } from "@/lib/content/marketing-pages";
import {
  COMMERCIAL_INCOTERMS_PRIMARY_NOTE,
  CONTRACT_TO_CARGO_STEPS,
  DELIVERY_RELIABILITY,
  ETA_MONITORING,
  FOB_CIF_TERMS,
  GLOBAL_SHIPPING_COVERAGE,
  INCOTERMS_DISCLAIMER,
  LOGISTICS_CLOSING,
  LOGISTICS_CTA,
  LOGISTICS_HERO,
  PORT_TO_PORT_CHAIN,
  REAL_TIME_TRACKING,
  SHIPMENT_COORDINATION,
  SHIPPING_DOCUMENTATION,
  SHIPPING_MODES,
} from "@/lib/content/logistics-content";
import {
  PACKAGING_CONTAINMENT_COMPARISON,
  PACKAGING_DRY_SOFT,
  PACKAGING_HARD,
  PACKAGING_LIQUID,
  PACKAGING_MARITIME,
  PACKAGING_PAGE_HERO,
  PACKAGING_SUMMARY_MATRIX,
} from "@/lib/content/packaging-page-content";
import { INSPECTIONS_SECTION_IMAGES } from "@/lib/content/inspections-images";
import {
  formatInspectionCards,
  formatPipeRows,
  INSPECTION_FIRM_VIDEOS_DEFAULTS,
} from "@/lib/marketing/inspection-cms";
import {
  PARTNERS_PROGRAMMES_LEAD,
  PRODUCER_PARTNERS_CTA,
  PARTNERS_INTRO_NOTE_DEFAULT,
  PRODUCER_PARTNERS_INTRO,
  PRODUCER_PARTNERS_PILLARS,
  PRODUCER_PARTNERS_PRODUCT_LINES,
} from "@/lib/content/producer-partners-content";
import { PACKAGING_SECTION_DEFAULTS } from "@/lib/marketing/packaging-cms";
import {
  PRODUCTS_CATALOG_EXTRA_DEFAULTS,
  PRODUCTS_CTA_IMAGE_DEFAULT,
  PRODUCTS_FOOD_SAFETY_DEFAULTS,
  PRODUCTS_SPOTLIGHT_DEFAULTS,
} from "@/lib/marketing/products-cms";
import { RESOURCES_SECTION_DEFAULTS } from "@/lib/marketing/resources-cms";
import { RESOURCES_PILLARS } from "@/lib/content/resources-content";
import {
  VERIFICATION_CTA,
  VERIFICATION_FRAMEWORK_STEPS,
  VERIFICATION_HERO,
  VERIFICATION_NOT_GUARANTEE,
  VERIFICATION_REPORT_SECTIONS,
  VERIFICATION_SERVICES,
  GLOBAL_VERIFICATION_NETWORK,
  REAL_TIME_INTELLIGENCE,
} from "@/lib/content/verification-content";
import type { PageRegistryEntry, PageSectionDef } from "@/lib/content/page-registry-section";
import { buildPageSection, joinLines, joinParagraphs } from "@/lib/content/page-registry-section";

const section = buildPageSection;

function disputeBodySections(): PageSectionDef[] {
  return [
    section("fairness", "Commercial resolution", {
      eyebrow: DISPUTE_FAIRNESS.eyebrow,
      title: DISPUTE_FAIRNESS.title,
      lead: DISPUTE_FAIRNESS.lead,
      paragraphs: joinParagraphs(DISPUTE_FAIRNESS.paragraphs),
    }),
    section("process-step-1", "Process step 1", {
      title: DISPUTE_PROCESS_STEPS[0].title,
      body: DISPUTE_PROCESS_STEPS[0].body,
    }),
    section("process-step-2", "Process step 2", {
      title: DISPUTE_PROCESS_STEPS[1].title,
      body: DISPUTE_PROCESS_STEPS[1].body,
    }),
    section("process-step-3", "Process step 3", {
      title: DISPUTE_PROCESS_STEPS[2].title,
      body: DISPUTE_PROCESS_STEPS[2].body,
    }),
    section("responsibilities", "Seller & buyer roles", {
      eyebrow: DISPUTE_RESPONSIBILITIES.eyebrow,
      title: DISPUTE_RESPONSIBILITIES.title,
      lead: DISPUTE_RESPONSIBILITIES.lead,
      sellerPoints: joinLines(DISPUTE_RESPONSIBILITIES.sellerPoints),
      buyerPoints: joinLines(DISPUTE_RESPONSIBILITIES.buyerPoints),
      riskTransferNote: DISPUTE_RESPONSIBILITIES.riskTransferNote,
    }),
    section("quality-safety", "Quality & safety", {
      eyebrow: DISPUTE_QUALITY_SAFETY.eyebrow,
      title: DISPUTE_QUALITY_SAFETY.title,
      lead: DISPUTE_QUALITY_SAFETY.lead,
      bullets: joinLines(DISPUTE_QUALITY_SAFETY.bullets),
    }),
    section("documentation", "Documentation", {
      eyebrow: DISPUTE_DOCUMENTATION.eyebrow,
      title: DISPUTE_DOCUMENTATION.title,
      lead: DISPUTE_DOCUMENTATION.lead,
      body: DISPUTE_DOCUMENTATION.body,
    }),
    section("partners", "Specialist network", {
      eyebrow: DISPUTE_PARTNERS.eyebrow,
      title: DISPUTE_PARTNERS.title,
      lead: DISPUTE_PARTNERS.lead,
      body: DISPUTE_PARTNERS.body,
    }),
    section("payments", "Payments", {
      eyebrow: DISPUTE_PAYMENTS.eyebrow,
      title: DISPUTE_PAYMENTS.title,
      lead: DISPUTE_PAYMENTS.lead,
      paragraphs: joinParagraphs(DISPUTE_PAYMENTS.paragraphs),
      resourcesHref: DISPUTE_PAYMENTS.resourcesHref,
    }),
    section("cta", "Closing CTA", {
      title: DISPUTE_CTA.title,
      lead: DISPUTE_CTA.lead,
      primaryCtaLabel: DISPUTE_CTA.primary.label,
      primaryCtaHref: DISPUTE_CTA.primary.href,
      secondaryCtaLabel: DISPUTE_CTA.secondary.label,
      secondaryCtaHref: DISPUTE_CTA.secondary.href,
    }),
    section("disclaimer", "Disclaimer", {
      body: DISPUTE_DISCLAIMER,
    }),
  ];
}

function packagingBodySections(): PageSectionDef[] {
  const d = PACKAGING_SECTION_DEFAULTS;
  return [
    section("overview", "Overview", d.overview),
    section("dry-soft", PACKAGING_DRY_SOFT.title, d["dry-soft"]),
    section("liquid", PACKAGING_LIQUID.title, d.liquid),
    section("hard", PACKAGING_HARD.title, d.hard),
    section("maritime", PACKAGING_MARITIME.title, d.maritime),
    section("summary-matrix", PACKAGING_SUMMARY_MATRIX.title, d["summary-matrix"]),
    section("containment-comparison", PACKAGING_CONTAINMENT_COMPARISON.title, d["containment-comparison"]),
    section("cta", "Packaging CTA", d.cta),
  ];
}

function logisticsBodySections(): PageSectionDef[] {
  const story = LOGISTICS_STORY;
  return [
    section("story", "Story band", {
      eyebrow: story.eyebrow,
      title: story.title,
      lead: story.lead,
      youtubeUrl: story.youtubeUrl,
      imageSrc: story.imageSrc,
      imageAlt: story.imageAlt,
      box1Title: story.boxes[0].title,
      box1Body: story.boxes[0].body,
      box2Title: story.boxes[1].title,
      box2Body: story.boxes[1].body,
      box3Title: story.boxes[2].title,
      box3Body: story.boxes[2].body,
    }),
    section("shipping-modes-intro", "Shipping modes intro", {
      title: "Bulk & container shipping",
      description:
        "On programmes we sell, carriage may use the following modes — coordinated with carriers and forwarders, not sold as standalone Finekarts logistics products:",
    }),
    section("contract-band", "Contract to cargo band", {
      title: "From contract to cargo",
      lead:
        "From signed PSA through inspection milestones, export documentation, and carrier booking — Finekarts sells the commodity and coordinates independent specialists at each step.",
    }),
    section("global-coverage", "Global coverage", {
      title: GLOBAL_SHIPPING_COVERAGE.title,
      lead: GLOBAL_SHIPPING_COVERAGE.lead,
      incoterms: joinLines(GLOBAL_SHIPPING_COVERAGE.incoterms),
      note: GLOBAL_SHIPPING_COVERAGE.note,
    }),
    section("incoterms-primary", "FOB / CIF / DDP", {
      note: COMMERCIAL_INCOTERMS_PRIMARY_NOTE,
      fobTitle: FOB_CIF_TERMS[0].title,
      fobSummary: FOB_CIF_TERMS[0].summary,
      cifTitle: FOB_CIF_TERMS[1].title,
      cifSummary: FOB_CIF_TERMS[1].summary,
      ddpTitle: FOB_CIF_TERMS[2].title,
      ddpSummary: FOB_CIF_TERMS[2].summary,
      disclaimer: INCOTERMS_DISCLAIMER,
    }),
    section("tracking", "Shipment tracking", {
      title: REAL_TIME_TRACKING.title,
      lead: REAL_TIME_TRACKING.lead,
      items: joinLines(REAL_TIME_TRACKING.items),
      note: REAL_TIME_TRACKING.note,
    }),
    section("eta", "ETA monitoring", {
      title: ETA_MONITORING.title,
      lead: ETA_MONITORING.lead,
      flow: ETA_MONITORING.flow,
      note: ETA_MONITORING.note,
      goal: ETA_MONITORING.goal,
    }),
    section("port-chain", "Port-to-port chain", {
      title: PORT_TO_PORT_CHAIN.title,
      lead: PORT_TO_PORT_CHAIN.lead,
      steps: joinLines(PORT_TO_PORT_CHAIN.steps),
      note: PORT_TO_PORT_CHAIN.note,
    }),
    section("shipping-modes", "Shipping modes", {
      modes: joinLines(SHIPPING_MODES.map((m) => `${m.title}: ${m.text}`)),
    }),
    section("documentation", "Shipping documentation", {
      title: SHIPPING_DOCUMENTATION.title,
      lead: SHIPPING_DOCUMENTATION.lead,
      intro: SHIPPING_DOCUMENTATION.intro,
      items: joinLines(SHIPPING_DOCUMENTATION.items),
      note: SHIPPING_DOCUMENTATION.note,
    }),
    section("coordination", "Shipment coordination", {
      title: SHIPMENT_COORDINATION.title,
      lead: SHIPMENT_COORDINATION.lead,
      parties: SHIPMENT_COORDINATION.parties,
      note: SHIPMENT_COORDINATION.note,
    }),
    section("reliability", "Delivery reliability", {
      title: DELIVERY_RELIABILITY.title,
      lead: DELIVERY_RELIABILITY.lead,
      items: joinLines(DELIVERY_RELIABILITY.items),
      commitment: DELIVERY_RELIABILITY.commitment,
      disclaimer: DELIVERY_RELIABILITY.disclaimer,
    }),
    section("contract-cargo", "Contract to cargo", {
      steps: joinLines(
        CONTRACT_TO_CARGO_STEPS.map((s) => `${s.step}. ${s.title} — ${s.text}`),
      ),
    }),
    section("closing", "Closing band", {
      title: LOGISTICS_CLOSING.title,
      lead: LOGISTICS_CLOSING.lead,
      body: LOGISTICS_CLOSING.body,
      tagline: LOGISTICS_CLOSING.tagline,
      badges: joinLines(LOGISTICS_CLOSING.badges),
    }),
    section("cta", "Logistics CTA", {
      title: LOGISTICS_CTA.title,
      lead: LOGISTICS_CTA.lead,
      fields: joinLines(LOGISTICS_CTA.fields),
    }),
  ];
}

function inspectionBodySections(): PageSectionDef[] {
  const images = INSPECTIONS_SECTION_IMAGES;
  return [
    section("overview", "Overview (intro + image)", {
      eyebrow: "Overview",
      body: INSPECTIONS_HERO.description,
      image: images.intro.src,
    }),
    section("timing", INSPECTIONS_TIMING_TYPES.title, {
      title: INSPECTIONS_TIMING_TYPES.title,
      items: formatInspectionCards(INSPECTIONS_TIMING_TYPES.items),
    }),
    section("methodology", INSPECTIONS_METHOD_TYPES.title, {
      title: INSPECTIONS_METHOD_TYPES.title,
      items: formatInspectionCards(INSPECTIONS_METHOD_TYPES.items),
      image1: images.visual.src,
      image2: images.ndt.src,
      image3: images.destructive.src,
      image4: images.dimensional.src,
    }),
    section("scope", INSPECTIONS_SCOPE_TYPES.title, {
      title: INSPECTIONS_SCOPE_TYPES.title,
      items: formatInspectionCards(INSPECTIONS_SCOPE_TYPES.items),
      image: images.regulatory.src,
    }),
    section("verification-summary", INSPECTIONS_VERIFICATION_SUMMARY.title, {
      title: INSPECTIONS_VERIFICATION_SUMMARY.title,
      rowItems: formatPipeRows(
        INSPECTIONS_VERIFICATION_SUMMARY.rows.map((r) => [r.type, r.focus, r.goal]),
      ),
    }),
    section("commodity-validation", INSPECTIONS_COMMODITY_VALIDATION.title, {
      title: INSPECTIONS_COMMODITY_VALIDATION.title,
      lead: INSPECTIONS_COMMODITY_VALIDATION.lead,
      distinctionVerification: INSPECTIONS_COMMODITY_VALIDATION.distinction.verification,
      distinctionValidation: INSPECTIONS_COMMODITY_VALIDATION.distinction.validation,
      intro: INSPECTIONS_COMMODITY_VALIDATION.intro,
      areaItems: formatInspectionCards(INSPECTIONS_COMMODITY_VALIDATION.areas),
      image1: images.commodityBand.src,
      image2: images.commodityFeature.src,
    }),
    section("commodity-comparison", INSPECTIONS_COMMODITY_COMPARISON.title, {
      title: INSPECTIONS_COMMODITY_COMPARISON.title,
      rowItems: formatPipeRows(
        INSPECTIONS_COMMODITY_COMPARISON.rows.map((r) => [r.aspect, r.focus, r.question, r.examples]),
      ),
    }),
    section("firm-videos", "Inspection firm videos", {
      eyebrow: INSPECTION_FIRM_VIDEOS_DEFAULTS.eyebrow,
      title: INSPECTION_FIRM_VIDEOS_DEFAULTS.title,
      lead: INSPECTION_FIRM_VIDEOS_DEFAULTS.lead,
    }),
    section("cta", "Inspection CTA", {
      eyebrow: "Next step",
      title: INSPECTIONS_CTA.title,
      lead: INSPECTIONS_CTA.lead,
      primaryLabel: INSPECTIONS_CTA.primaryLabel,
      primaryHref: INSPECTIONS_CTA.primaryHref,
      secondaryLabel: INSPECTIONS_CTA.secondaryLabel,
      secondaryHref: INSPECTIONS_CTA.secondaryHref,
      shareTitle: INSPECTIONS_CTA.shareTitle,
      shareItems: joinLines([...INSPECTIONS_CTA.shareItems]),
    }),
  ];
}

function aboutBodySections(): PageSectionDef[] {
  const teamStrategy = ABOUT_SECTION_IMAGE_META.teamStrategy;
  const teamCollaboration = ABOUT_SECTION_IMAGE_META.teamCollaboration;
  const contactBand = ABOUT_SECTION_IMAGE_META.contactBand;

  return [
    section("intro", "Who we are", {
      eyebrow: ABOUT_INTRO.eyebrow,
      title: ABOUT_INTRO.title,
      paragraphs: joinParagraphs([...ABOUT_INTRO.paragraphs]),
      ctaLabel: "Learn more about products",
      imageSrc: teamStrategy.src,
      imageAlt: teamStrategy.alt,
    }),
    section("highlights", "Highlights (icon row)", {
      items: joinLines(
        ABOUT_HIGHLIGHTS.map((h) => `${h.title}: ${h.detail}`),
      ),
    }),
    section("what-we-do", ABOUT_WHAT_WE_DO.title, {
      eyebrow: ABOUT_WHAT_WE_DO.eyebrow,
      title: ABOUT_WHAT_WE_DO.title,
      lead: ABOUT_WHAT_WE_DO.lead,
      content: joinLines(
        ABOUT_WHAT_WE_DO.divisions.map(
          (d) =>
            `${d.n}. ${d.title}
${d.intro}
${joinLines(d.bullets.map((b) => `• ${b}`))}`,
        ),
      ),
    }),
    section("supply-chain", ABOUT_SUPPLY_CHAIN.title, {
      eyebrow: ABOUT_SUPPLY_CHAIN.eyebrow,
      title: ABOUT_SUPPLY_CHAIN.title,
      lead: ABOUT_SUPPLY_CHAIN.lead,
      bullets: joinLines(
        ABOUT_SUPPLY_CHAIN.bullets.map((b) => `${b.title}: ${b.body}`),
      ),
      ctaLabel: "Explore trade resources",
      imageSrc: teamCollaboration.src,
      imageAlt: teamCollaboration.alt,
    }),
    section("why-partner", ABOUT_WHY_PARTNER.title, {
      eyebrow: ABOUT_WHY_PARTNER.eyebrow,
      title: ABOUT_WHY_PARTNER.title,
      items: joinLines(ABOUT_WHY_PARTNER.items.map((i) => `${i.title}: ${i.body}`)),
    }),
    section("contact-band", ABOUT_CONTACT.title, {
      eyebrow: ABOUT_CONTACT.eyebrow,
      title: ABOUT_CONTACT.title,
      items: joinLines([...ABOUT_CONTACT.lines]),
      ctaTitle: ABOUT_CONTACT.ctaTitle,
      ctaBody: ABOUT_CONTACT.ctaBody,
      primaryCtaLabel: "Submit a purchase request",
      secondaryCtaLabel: "Request a consultation",
      imageSrc: contactBand.src,
    }),
  ];
}

function insightsBodySections(): PageSectionDef[] {
  const d = insightsSectionDefaults();
  return [
    section("quality-band", "Quality & regulatory band (top)", d.qualityBand),
    section("intro", "Framework overview", d.intro),
    section("architecture", "Quality & process architecture", d.architecture),
    section("protocol", "Multi-layered inspection protocol", d.protocol),
    section("validation", "Validation domains band", d.validation),
    section("validation-domains", "Validation domains (I-V)", d.domains),
    section("matrix", "Containment master matrix", d.matrix),
    section("sop", "SOP checklist", d.sop),
    section("cta", "Insights CTA", d.cta),
  ];
}

function verificationBodySections(): PageSectionDef[] {
  const story = VERIFICATION_STORY;
  const serviceSections = VERIFICATION_SERVICES.map((svc) =>
    section(`service-${svc.n}`, `Service ${svc.n}: ${svc.title}`, {
      title: svc.title,
      summary: svc.summary,
      intro: svc.intro ?? "",
      items: joinLines(svc.items ?? []),
      body: svc.body ?? "",
      note: svc.note ?? "",
      sections: svc.sections
        ? joinLines(svc.sections.map((s) => `${s.title}: ${s.text}`))
        : "",
    }),
  );

  return [
    section("story", "Story band", {
      eyebrow: story.eyebrow,
      title: story.title,
      lead: story.lead,
      youtubeUrl: story.youtubeUrl,
      imageSrc: story.imageSrc,
      imageAlt: story.imageAlt,
      box1Title: story.boxes[0].title,
      box1Body: story.boxes[0].body,
      box2Title: story.boxes[1].title,
      box2Body: story.boxes[1].body,
      box3Title: story.boxes[2].title,
      box3Body: story.boxes[2].body,
    }),
    section("closing-trust", "Closing trust paragraph", {
      body:
        "In global commodity markets, trust should be supported by evidence. Finekarts helps businesses move beyond documents and representations by combining corporate verification, regulatory information, commercial intelligence, credit assessment, supply-chain analysis and independent inspection where appropriate.",
    }),
    ...serviceSections,
    section("global-network", "Global network", {
      title: GLOBAL_VERIFICATION_NETWORK.title,
      lead: GLOBAL_VERIFICATION_NETWORK.lead,
      regions: joinLines(GLOBAL_VERIFICATION_NETWORK.regions),
      note: GLOBAL_VERIFICATION_NETWORK.note,
    }),
    section("real-time-intel", "Real-time intelligence", {
      title: REAL_TIME_INTELLIGENCE.title,
      lead: REAL_TIME_INTELLIGENCE.lead,
      note: REAL_TIME_INTELLIGENCE.note,
      disclaimer: REAL_TIME_INTELLIGENCE.disclaimer,
    }),
    section("framework", "Verification framework", {
      steps: joinLines(
        VERIFICATION_FRAMEWORK_STEPS.map((s) => `${s.step}. ${s.title} — ${s.text}`),
      ),
    }),
    section("report-sections", "Report sections", {
      sections: joinLines(
        VERIFICATION_REPORT_SECTIONS.map((s) => `${s.title}: ${s.text}`),
      ),
    }),
    section("not-guarantee", "Not a guarantee", {
      title: VERIFICATION_NOT_GUARANTEE.title,
      lead: VERIFICATION_NOT_GUARANTEE.lead,
      items: joinLines(VERIFICATION_NOT_GUARANTEE.items),
      note: VERIFICATION_NOT_GUARANTEE.note,
    }),
    section("cta", "Verification CTA", {
      title: VERIFICATION_CTA.title,
      lead: VERIFICATION_CTA.lead,
      tagline: VERIFICATION_CTA.tagline,
      fields: joinLines(VERIFICATION_CTA.fields),
    }),
  ];
}

function resourcesBodySections(): PageSectionDef[] {
  const d = RESOURCES_SECTION_DEFAULTS;
  return [
    section("intro", "Introduction band", d.intro),
    section("spotlight", "Quality & regulatory spotlight", d.spotlight),
    section("priority", "Start here links", d.priority),
    section("library", "Resource library heading", d.library),
    ...RESOURCES_PILLARS.map((pillar, i) =>
      section(`pillar-${i + 1}`, `Library card: ${pillar.title}`, {
        title: pillar.title,
        summary: pillar.summary,
      }),
    ),
    section("banking", "Tab: Banking & SPA", d.banking),
    section("payments", "Tab: Payment structures", d.payments),
    section("documents", "Tab: Trade documents", d.documents),
    section("downloads", "Tab: Downloads", d.downloads),
  ];
}

function partnersBodySections(): PageSectionDef[] {
  const intro = PRODUCER_PARTNERS_INTRO;
  return [
    section("intro", "Introduction & pillars", {
      eyebrow: intro.eyebrow,
      title: intro.title,
      lead: intro.lead,
      note: PARTNERS_INTRO_NOTE_DEFAULT,
      pillars: joinLines(PRODUCER_PARTNERS_PILLARS.map((p) => `${p.title}: ${p.body}`)),
    }),
    section("programmes", "Commodity programmes", {
      eyebrow: "Commodity lines",
      title: "Programmes we structure for international buyers",
      lead: PARTNERS_PROGRAMMES_LEAD,
      lines: joinLines(PRODUCER_PARTNERS_PRODUCT_LINES.map((l) => `${l.label} | ${l.href}`)),
    }),
    section("spotlight-single", "Highlight (1 box)", {
      eyebrow: "Partner spotlight",
      title: "Additional programme notes",
      body:
        "Use this area for a single highlighted message — capacity updates, corridor focus, or onboarding steps. Edit this copy in the admin page editor under Partners.",
    }),
    section("spotlight-trio", "Highlights (3 boxes)", {
      box1Title: "Documentation readiness",
      box1Body:
        "Share how your facility supports certificates of origin, analysis, and weight where buyers and banks require them.",
      box2Title: "Loading & logistics",
      box2Body:
        "Describe berths, container stuffing, or inland routes so CIF and FOB programmes can be quoted realistically.",
      box3Title: "Quality systems",
      box3Body:
        "Outline HACCP, traceability, or buyer audit protocols that support recurring export contracts.",
    }),
    section("cta", "Trade desk CTA", {
      title: PRODUCER_PARTNERS_CTA.title,
      lead: PRODUCER_PARTNERS_CTA.lead,
      primaryCtaLabel: PRODUCER_PARTNERS_CTA.primary.label,
      primaryCtaHref: PRODUCER_PARTNERS_CTA.primary.href,
      secondaryCtaLabel: PRODUCER_PARTNERS_CTA.secondary.label,
      secondaryCtaHref: PRODUCER_PARTNERS_CTA.secondary.href,
      tertiaryCtaLabel: PRODUCER_PARTNERS_CTA.inspections.label,
      tertiaryCtaHref: PRODUCER_PARTNERS_CTA.inspections.href,
    }),
  ];
}

function productsBodySections(): PageSectionDef[] {
  return [
    section("food-safety", "Food safety markets strip", { ...PRODUCTS_FOOD_SAFETY_DEFAULTS }),
    section("spotlight", "Quality & regulatory spotlight", { ...PRODUCTS_SPOTLIGHT_DEFAULTS }),
    section("categories", "Categories band", {
      title: "Categories",
      description: "Select a category to view product overviews available for qualified buyers.",
    }),
    section("catalog", "Catalog section", {
      eyebrow: "Catalog",
      title: "Catalog by category",
      ...PRODUCTS_CATALOG_EXTRA_DEFAULTS,
    }),
    section("cta", "Products CTA", {
      title: "Ready to place a bulk order?",
      body:
        "Sign in to the buyer portal and submit your purchase request with quantity, destination, and specifications.",
      primaryCtaLabel: "Click here to ORDER →",
      primaryCtaHref: "/login",
      secondaryCtaLabel: "Contact the desk",
      secondaryCtaHref: "/contact",
      imageSrc: PRODUCTS_CTA_IMAGE_DEFAULT,
    }),
  ];
}

const BODY_BY_SLUG: Record<string, () => PageSectionDef[]> = {
  about: aboutBodySections,
  "dispute-resolution": disputeBodySections,
  packaging: packagingBodySections,
  logistics: logisticsBodySections,
  inspections: inspectionBodySections,
  insights: insightsBodySections,
  verification: verificationBodySections,
  resources: resourcesBodySections,
  products: productsBodySections,
  partners: partnersBodySections,
};

const HERO_OVERRIDES: Partial<
  Record<string, Record<string, string>>
> = {
  "dispute-resolution": {
    eyebrow: DISPUTE_HERO.eyebrow,
    title: DISPUTE_HERO.title,
    description: DISPUTE_HERO.description,
    primaryCtaLabel: DISPUTE_HERO.primaryCta.label,
    primaryCtaHref: DISPUTE_HERO.primaryCta.href,
    secondaryCtaLabel: DISPUTE_HERO.secondaryCta.label,
    secondaryCtaHref: DISPUTE_HERO.secondaryCta.href,
  },
  packaging: {
    eyebrow: PACKAGING_PAGE_HERO.eyebrow,
    title: PACKAGING_PAGE_HERO.title,
    description: PACKAGING_PAGE_HERO.description,
    primaryCtaLabel: PACKAGING_PAGE_HERO.primaryCta.label,
    primaryCtaHref: PACKAGING_PAGE_HERO.primaryCta.href,
    secondaryCtaLabel: PACKAGING_PAGE_HERO.secondaryCta.label,
    secondaryCtaHref: PACKAGING_PAGE_HERO.secondaryCta.href,
  },
  logistics: {
    eyebrow: LOGISTICS_HERO.eyebrow,
    title: LOGISTICS_HERO.title,
    description: LOGISTICS_HERO.description,
    primaryCtaLabel: LOGISTICS_HERO.primaryCta.label,
    primaryCtaHref: LOGISTICS_HERO.primaryCta.href,
    secondaryCtaLabel: LOGISTICS_HERO.secondaryCta.label,
    secondaryCtaHref: LOGISTICS_HERO.secondaryCta.href,
  },
  inspections: {
    eyebrow: INSPECTIONS_HERO.eyebrow,
    title: INSPECTIONS_HERO.title,
    description: INSPECTIONS_HERO.description,
    primaryCtaLabel: INSPECTIONS_HERO.primaryCta.label,
    primaryCtaHref: INSPECTIONS_HERO.primaryCta.href,
    secondaryCtaLabel: INSPECTIONS_HERO.secondaryCta.label,
    secondaryCtaHref: INSPECTIONS_HERO.secondaryCta.href,
  },
  insights: {
    eyebrow: INSIGHTS_HERO.eyebrow,
    title: INSIGHTS_HERO.title,
    description: INSIGHTS_HERO.description,
    primaryCtaLabel: INSIGHTS_HERO.primaryCta.label,
    primaryCtaHref: INSIGHTS_HERO.primaryCta.href,
    secondaryCtaLabel: INSIGHTS_HERO.secondaryCta.label,
    secondaryCtaHref: INSIGHTS_HERO.secondaryCta.href,
  },
  verification: {
    eyebrow: VERIFICATION_HERO.eyebrow,
    title: VERIFICATION_HERO.title,
    description: VERIFICATION_HERO.description,
    primaryCtaLabel: VERIFICATION_HERO.primaryCta.label,
    primaryCtaHref: VERIFICATION_HERO.primaryCta.href,
    secondaryCtaLabel: VERIFICATION_HERO.secondaryCta.label,
    secondaryCtaHref: VERIFICATION_HERO.secondaryCta.href,
  },
};

export function mergeMarketingPageBodies(entries: PageRegistryEntry[]): PageRegistryEntry[] {
  return entries.map((entry) => {
    const build = BODY_BY_SLUG[entry.slug];
    if (!build) return entry;

    const heroOverride = HERO_OVERRIDES[entry.slug];
    const sections = entry.sections.map((s: PageSectionDef) => {
      if (s.id !== "hero" || !heroOverride) return s;
      return {
        ...s,
        defaults: { ...s.defaults, ...heroOverride },
      };
    });

    const existingIds = new Set(sections.map((s) => s.id));
    const extra = build().filter((s: PageSectionDef) => !existingIds.has(s.id));

    return { ...entry, sections: [...sections, ...extra] };
  });
}
