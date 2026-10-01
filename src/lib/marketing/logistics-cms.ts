import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsSection,
} from "@/lib/content/cms-field";
import {
  COMMERCIAL_INCOTERMS_PRIMARY_NOTE,
  CONTRACT_TO_CARGO_STEPS,
  DELIVERY_RELIABILITY,
  ETA_MONITORING,
  FOB_CIF_TERMS,
  GLOBAL_SHIPPING_COVERAGE,
  ICC_INCOTERMS_2020_URL,
  INCOTERMS_DISCLAIMER,
  LOGISTICS_CLOSING,
  LOGISTICS_CTA,
  PORT_TO_PORT_CHAIN,
  REAL_TIME_TRACKING,
  SHIPMENT_COORDINATION,
  SHIPPING_DOCUMENTATION,
  SHIPPING_MODES,
} from "@/lib/content/logistics-content";
import { LOGISTICS_STORY } from "@/lib/content/marketing-pages";

export const LOGISTICS_CMS_SECTION_IDS = [
  "story",
  "global-coverage",
  "incoterms-primary",
  "tracking",
  "eta",
  "port-chain",
  "shipping-modes-intro",
  "shipping-modes",
  "documentation",
  "coordination",
  "reliability",
  "contract-band",
  "contract-cargo",
  "closing",
  "cta",
] as const;

function parseShippingModes(lines: string[]) {
  return lines.map((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return { title: line, text: "" };
    return { title: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim() };
  });
}

function parseContractSteps(lines: string[]) {
  return lines.map((line) => {
    const match = line.match(/^(\d+)\.\s*(.+?)\s*—\s*(.+)$/);
    if (!match) return { step: 0, title: line, text: "" };
    return { step: Number(match[1]), title: match[2], text: match[3] };
  });
}

export type BuiltLogisticsContent = ReturnType<typeof buildLogisticsContent>;

export function buildLogisticsContent(cms: CmsSectionMap) {
  const storyF = cmsSection(cms, "story");
  const story = LOGISTICS_STORY;
  const globalF = cmsSection(cms, "global-coverage");
  const incotermsF = cmsSection(cms, "incoterms-primary");
  const trackingF = cmsSection(cms, "tracking");
  const etaF = cmsSection(cms, "eta");
  const portF = cmsSection(cms, "port-chain");
  const modesIntroF = cmsSection(cms, "shipping-modes-intro");
  const modesF = cmsSection(cms, "shipping-modes");
  const docsF = cmsSection(cms, "documentation");
  const coordF = cmsSection(cms, "coordination");
  const reliabilityF = cmsSection(cms, "reliability");
  const contractBandF = cmsSection(cms, "contract-band");
  const contractCargoF = cmsSection(cms, "contract-cargo");
  const closingF = cmsSection(cms, "closing");
  const ctaF = cmsSection(cms, "cta");

  const fob = FOB_CIF_TERMS[0];
  const cif = FOB_CIF_TERMS[1];
  const ddp = FOB_CIF_TERMS[2];

  return {
    story: {
      eyebrow: cmsField(storyF, "eyebrow", story.eyebrow),
      title: cmsField(storyF, "title", story.title),
      lead: cmsField(storyF, "lead", story.lead),
      youtubeUrl: cmsField(storyF, "youtubeUrl", story.youtubeUrl),
      imageSrc: cmsField(storyF, "imageSrc", story.imageSrc),
      imageAlt: cmsField(storyF, "imageAlt", story.imageAlt),
      boxes: [
        {
          title: cmsField(storyF, "box1Title", story.boxes[0].title),
          body: cmsField(storyF, "box1Body", story.boxes[0].body),
        },
        {
          title: cmsField(storyF, "box2Title", story.boxes[1].title),
          body: cmsField(storyF, "box2Body", story.boxes[1].body),
        },
        {
          title: cmsField(storyF, "box3Title", story.boxes[2].title),
          body: cmsField(storyF, "box3Body", story.boxes[2].body),
        },
      ],
    },
    globalCoverage: {
      title: cmsField(globalF, "title", GLOBAL_SHIPPING_COVERAGE.title),
      lead: cmsField(globalF, "lead", GLOBAL_SHIPPING_COVERAGE.lead),
      incoterms: cmsLines(globalF, "incoterms", GLOBAL_SHIPPING_COVERAGE.incoterms),
      note: cmsField(globalF, "note", GLOBAL_SHIPPING_COVERAGE.note),
    },
    incotermsLinkLabel: "FOB, CIF & DDP — ICC Incoterms® 2020",
    incotermsUrl: ICC_INCOTERMS_2020_URL,
    fobCifTerms: [
      {
        code: "FOB",
        title: cmsField(incotermsF, "fobTitle", fob.title),
        summary: cmsField(incotermsF, "fobSummary", fob.summary),
      },
      {
        code: "CIF",
        title: cmsField(incotermsF, "cifTitle", cif.title),
        summary: cmsField(incotermsF, "cifSummary", cif.summary),
      },
      {
        code: "DDP",
        title: cmsField(incotermsF, "ddpTitle", ddp.title),
        summary: cmsField(incotermsF, "ddpSummary", ddp.summary),
      },
    ],
    incotermsPrimaryNote: cmsField(
      incotermsF,
      "note",
      COMMERCIAL_INCOTERMS_PRIMARY_NOTE,
    ),
    tracking: {
      title: cmsField(trackingF, "title", REAL_TIME_TRACKING.title),
      lead: cmsField(trackingF, "lead", REAL_TIME_TRACKING.lead),
      items: cmsLines(trackingF, "items", REAL_TIME_TRACKING.items),
      note: cmsField(trackingF, "note", REAL_TIME_TRACKING.note),
    },
    eta: {
      title: cmsField(etaF, "title", ETA_MONITORING.title),
      lead: cmsField(etaF, "lead", ETA_MONITORING.lead),
      flow: cmsField(etaF, "flow", ETA_MONITORING.flow),
      note: cmsField(etaF, "note", ETA_MONITORING.note),
      goal: cmsField(etaF, "goal", ETA_MONITORING.goal),
    },
    portChain: {
      title: cmsField(portF, "title", PORT_TO_PORT_CHAIN.title),
      lead: cmsField(portF, "lead", PORT_TO_PORT_CHAIN.lead),
      steps: cmsLines(portF, "steps", PORT_TO_PORT_CHAIN.steps),
      note: cmsField(portF, "note", PORT_TO_PORT_CHAIN.note),
    },
    shippingModesIntro: {
      title: cmsField(modesIntroF, "title", "Bulk & container shipping"),
      description: cmsField(
        modesIntroF,
        "description",
        "On programmes we sell, carriage may use the following modes — coordinated with carriers and forwarders, not sold as standalone Finekarts logistics products:",
      ),
    },
    shippingModes: parseShippingModes(
      cmsLines(
        modesF,
        "modes",
        SHIPPING_MODES.map((m) => `${m.title}: ${m.text}`),
      ),
    ),
    documentation: {
      title: cmsField(docsF, "title", SHIPPING_DOCUMENTATION.title),
      lead: cmsField(docsF, "lead", SHIPPING_DOCUMENTATION.lead),
      intro: cmsField(docsF, "intro", SHIPPING_DOCUMENTATION.intro),
      items: cmsLines(docsF, "items", SHIPPING_DOCUMENTATION.items),
      note: cmsField(docsF, "note", SHIPPING_DOCUMENTATION.note),
    },
    coordination: {
      title: cmsField(coordF, "title", SHIPMENT_COORDINATION.title),
      lead: cmsField(coordF, "lead", SHIPMENT_COORDINATION.lead),
      parties: cmsField(coordF, "parties", SHIPMENT_COORDINATION.parties),
      note: cmsField(coordF, "note", SHIPMENT_COORDINATION.note),
    },
    reliability: {
      title: cmsField(reliabilityF, "title", DELIVERY_RELIABILITY.title),
      lead: cmsField(reliabilityF, "lead", DELIVERY_RELIABILITY.lead),
      items: cmsLines(reliabilityF, "items", DELIVERY_RELIABILITY.items),
      commitment: cmsField(reliabilityF, "commitment", DELIVERY_RELIABILITY.commitment),
      disclaimer: cmsField(reliabilityF, "disclaimer", DELIVERY_RELIABILITY.disclaimer),
    },
    contractBand: {
      title: cmsField(contractBandF, "title", "From contract to cargo"),
      lead: cmsField(
        contractBandF,
        "lead",
        "Finekarts integrates commodity sourcing, inspection, documentation and international shipping into one coordinated trading process.",
      ),
    },
    contractCargoSteps: parseContractSteps(
      cmsLines(
        contractCargoF,
        "steps",
        CONTRACT_TO_CARGO_STEPS.map((s) => `${s.step}. ${s.title} — ${s.text}`),
      ),
    ),
    closing: {
      title: cmsField(closingF, "title", LOGISTICS_CLOSING.title),
      lead: cmsField(closingF, "lead", LOGISTICS_CLOSING.lead),
      body: cmsField(closingF, "body", LOGISTICS_CLOSING.body),
      tagline: cmsField(closingF, "tagline", LOGISTICS_CLOSING.tagline),
      badges: cmsLines(closingF, "badges", LOGISTICS_CLOSING.badges),
    },
    incotermsDisclaimer: cmsField(incotermsF, "disclaimer", INCOTERMS_DISCLAIMER),
    cta: {
      title: cmsField(ctaF, "title", LOGISTICS_CTA.title),
      lead: cmsField(ctaF, "lead", LOGISTICS_CTA.lead),
      fields: cmsLines(ctaF, "fields", LOGISTICS_CTA.fields),
    },
  };
}
