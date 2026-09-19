import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsSection,
} from "@/lib/content/cms-field";
import {
  COMMODITY_INSPECTION_CATEGORIES,
  DOCUMENTARY_TRADE,
  INSPECTION_CTA,
  INSPECTION_NETWORK,
  INSPECTION_PROCESS_STEPS,
  INSPECTION_SERVICES,
  ORIGIN_DESTINATION,
  WHY_INDEPENDENT_INSPECTION,
} from "@/lib/content/inspections-content";

export const INSPECTION_CMS_SECTION_IDS = [
  "service-1",
  "service-2",
  "service-3",
  "service-4",
  "service-5",
  "service-6",
  ...COMMODITY_INSPECTION_CATEGORIES.map((_, i) => `commodity-${i + 1}`),
  "network",
  "origin-destination",
  "documentary-trade",
  "process",
  "why-independent",
  "cta",
] as const;

function parseWhyCards(lines: string[]) {
  return lines.map((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return { title: line, text: "" };
    return { title: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim() };
  });
}

function parseProcessSteps(lines: string[]) {
  return lines.map((line) => {
    const match = line.match(/^(\d+)\.\s*(.+?)\s*—\s*(.+)$/);
    if (!match) return { step: 0, title: line, text: "" };
    return { step: Number(match[1]), title: match[2], text: match[3] };
  });
}

export function resolveInspectionServices(cms?: CmsSectionMap) {
  return INSPECTION_SERVICES.map((svc) => {
    const f = cmsSection(cms, `service-${svc.n}`);
    return {
      ...svc,
      title: cmsField(f, "title", svc.title),
      summary: cmsField(f, "summary", svc.summary),
      intro: cmsField(f, "intro", svc.intro ?? ""),
      items: cmsLines(f, "items", svc.items ?? []),
      body: cmsField(f, "body", svc.body ?? ""),
      note: cmsField(f, "note", svc.note ?? ""),
    };
  });
}

export function resolveInspectionCommodities(cms?: CmsSectionMap) {
  return COMMODITY_INSPECTION_CATEGORIES.map((cat, i) => {
    const f = cmsSection(cms, `commodity-${i + 1}`);
    return {
      title: cmsField(f, "title", cat.title),
      href: cmsField(f, "href", cat.href),
      text: cmsField(f, "text", cat.text),
      image: cmsField(f, "image", cat.image),
      imageAlt: cmsField(f, "imageAlt", cat.imageAlt),
    };
  });
}

export function buildInspectionCtaFields(cms?: CmsSectionMap) {
  const f = cmsSection(cms, "cta");
  return {
    title: cmsField(f, "title", INSPECTION_CTA.title),
    lead: cmsField(f, "lead", INSPECTION_CTA.lead),
    tagline: cmsField(f, "tagline", INSPECTION_CTA.tagline),
    fields: cmsLines(f, "fields", INSPECTION_CTA.fields),
  };
}

export function buildInspectionHubContent(cms?: CmsSectionMap) {
  const networkF = cmsSection(cms, "network");
  const odF = cmsSection(cms, "origin-destination");
  const docF = cmsSection(cms, "documentary-trade");
  const processF = cmsSection(cms, "process");
  const whyF = cmsSection(cms, "why-independent");

  return {
    services: resolveInspectionServices(cms),
    commodities: resolveInspectionCommodities(cms),
    network: {
      lead: cmsField(networkF, "lead", INSPECTION_NETWORK.lead),
      organizations: cmsLines(networkF, "organizations", INSPECTION_NETWORK.organizations),
      selectionNote: cmsField(networkF, "selectionNote", INSPECTION_NETWORK.selectionNote),
      disclaimer: cmsField(networkF, "disclaimer", INSPECTION_NETWORK.disclaimer),
    },
    originDestination: {
      origin: {
        title: cmsField(odF, "originTitle", ORIGIN_DESTINATION.origin.title),
        intro: cmsField(odF, "originIntro", ORIGIN_DESTINATION.origin.intro),
        places: cmsLines(odF, "originPlaces", ORIGIN_DESTINATION.origin.places),
        note: cmsField(odF, "originNote", ORIGIN_DESTINATION.origin.note),
      },
      destination: {
        title: cmsField(odF, "destinationTitle", ORIGIN_DESTINATION.destination.title),
        intro: cmsField(odF, "destinationIntro", ORIGIN_DESTINATION.destination.intro),
        places: cmsLines(odF, "destinationPlaces", ORIGIN_DESTINATION.destination.places),
        note: cmsField(odF, "destinationNote", ORIGIN_DESTINATION.destination.note),
      },
    },
    documentaryTrade: {
      title: cmsField(docF, "title", DOCUMENTARY_TRADE.title),
      lead: cmsField(docF, "lead", DOCUMENTARY_TRADE.lead),
      contractItems: cmsLines(docF, "contractItems", DOCUMENTARY_TRADE.contractItems),
      note: cmsField(docF, "note", DOCUMENTARY_TRADE.note),
    },
    processSteps: parseProcessSteps(
      cmsLines(
        processF,
        "steps",
        INSPECTION_PROCESS_STEPS.map((s) => `${s.step}. ${s.title} — ${s.text}`),
      ),
    ),
    whyIndependent: parseWhyCards(
      cmsLines(
        whyF,
        "cards",
        WHY_INDEPENDENT_INSPECTION.map((c) => `${c.title}: ${c.text}`),
      ),
    ),
  };
}
