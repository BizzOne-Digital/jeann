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
  INSPECTIONS_COMMODITY_VALIDATION,
  INSPECTIONS_CTA,
  INSPECTIONS_HERO,
  INSPECTIONS_TIMING_TYPES,
} from "@/lib/content/inspections-operational-content";
import {
  INSIGHTS_CONTAINMENT_MATRIX,
  INSIGHTS_CTA,
  INSIGHTS_HERO,
  INSIGHTS_SOP,
  INSIGHTS_ARCHITECTURE,
  INSIGHTS_PROTOCOL,
  INSIGHTS_VALIDATION,
} from "@/lib/content/operational-insights-content";
import { LOGISTICS_STORY, VERIFICATION_STORY } from "@/lib/content/marketing-pages";
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
  PACKAGING_PAGE_CTA,
  PACKAGING_PAGE_HERO,
  PACKAGING_SUMMARY_MATRIX,
} from "@/lib/content/packaging-page-content";
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
  return [
    section("overview", "Overview", {
      description: PACKAGING_PAGE_HERO.description,
      categoriesLead: PACKAGING_PAGE_HERO.categoriesLead,
    }),
    section("summary-matrix", PACKAGING_SUMMARY_MATRIX.title, {
      title: PACKAGING_SUMMARY_MATRIX.title,
    }),
    section("cta", "Packaging CTA", {
      title: PACKAGING_PAGE_CTA.title,
      lead: PACKAGING_PAGE_CTA.lead,
    }),
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
  return [
    section("timing", INSPECTIONS_TIMING_TYPES.title, {
      title: INSPECTIONS_TIMING_TYPES.title,
    }),
    section("commodity-validation", INSPECTIONS_COMMODITY_VALIDATION.title, {
      title: INSPECTIONS_COMMODITY_VALIDATION.title,
      lead: INSPECTIONS_COMMODITY_VALIDATION.lead,
    }),
    section("cta", "Inspection CTA", {
      title: INSPECTIONS_CTA.title,
      lead: INSPECTIONS_CTA.lead,
      primaryHref: INSPECTIONS_CTA.primaryHref,
      secondaryHref: INSPECTIONS_CTA.secondaryHref,
    }),
  ];
}

function insightsBodySections(): PageSectionDef[] {
  return [
    section("intro", "Framework intro", {
      lead: INSIGHTS_HERO.guideLead,
    }),
    section("architecture", INSIGHTS_ARCHITECTURE.title, {
      title: INSIGHTS_ARCHITECTURE.title,
      lead: INSIGHTS_ARCHITECTURE.lead,
    }),
    section("protocol", INSIGHTS_PROTOCOL.title, {
      title: INSIGHTS_PROTOCOL.title,
      lead: INSIGHTS_PROTOCOL.lead,
    }),
    section("validation", INSIGHTS_VALIDATION.title, {
      title: INSIGHTS_VALIDATION.title,
      lead: INSIGHTS_VALIDATION.lead,
      pillars: joinLines([...INSIGHTS_VALIDATION.pillars]),
    }),
    section("matrix", INSIGHTS_CONTAINMENT_MATRIX.title, {
      title: INSIGHTS_CONTAINMENT_MATRIX.title,
      lead: INSIGHTS_CONTAINMENT_MATRIX.lead,
    }),
    section("sop", INSIGHTS_SOP.title, {
      title: INSIGHTS_SOP.title,
      lead: INSIGHTS_SOP.lead,
    }),
    section("cta", "Insights CTA", {
      title: INSIGHTS_CTA.title,
      lead: INSIGHTS_CTA.lead,
      primaryHref: INSIGHTS_CTA.primaryHref,
      secondaryHref: INSIGHTS_CTA.secondaryHref,
    }),
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
  return RESOURCES_PILLARS.map((pillar, i) =>
    section(`pillar-${i + 1}`, `Hub pillar: ${pillar.title}`, {
      title: pillar.title,
      summary: pillar.summary,
    }),
  );
}

function productsBodySections(): PageSectionDef[] {
  return [
    section("catalog", "Catalog section", {
      eyebrow: "Catalog",
      title: "Catalog by category",
      description:
        "Search and filter listed commodities. Specifications and availability are confirmed with the trade desk.",
    }),
    section("categories", "Categories band", {
      title: "Categories",
      description: "Select a category to view product overviews available for qualified buyers.",
    }),
    section("cta", "Products CTA", {
      title: "Ready to place a bulk order?",
      body:
        "Sign in to the buyer portal and submit your purchase request with quantity, destination, and specifications.",
      primaryCtaLabel: "Click here to ORDER →",
      primaryCtaHref: "/login",
      secondaryCtaLabel: "Contact the desk",
      secondaryCtaHref: "/contact",
    }),
  ];
}

const BODY_BY_SLUG: Record<string, () => PageSectionDef[]> = {
  "dispute-resolution": disputeBodySections,
  packaging: packagingBodySections,
  logistics: logisticsBodySections,
  inspections: inspectionBodySections,
  insights: insightsBodySections,
  verification: verificationBodySections,
  resources: resourcesBodySections,
  products: productsBodySections,
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
