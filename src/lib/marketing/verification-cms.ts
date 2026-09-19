import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsSection,
} from "@/lib/content/cms-field";
import { VERIFICATION_STORY } from "@/lib/content/marketing-pages";
import {
  GLOBAL_VERIFICATION_NETWORK,
  REAL_TIME_INTELLIGENCE,
  VERIFICATION_CTA,
  VERIFICATION_FRAMEWORK_STEPS,
  VERIFICATION_NOT_GUARANTEE,
  VERIFICATION_REPORT_SECTIONS,
  VERIFICATION_SERVICES,
  type VerificationService,
} from "@/lib/content/verification-content";

export const VERIFICATION_CMS_SECTION_IDS = [
  "story",
  "closing-trust",
  ...VERIFICATION_SERVICES.map((s) => `service-${s.n}`),
  "global-network",
  "real-time-intel",
  "framework",
  "report-sections",
  "not-guarantee",
  "cta",
] as const;

function parseReportSections(lines: string[]) {
  return lines.map((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return { title: line, text: "" };
    return { title: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim() };
  });
}

function parseFrameworkSteps(lines: string[]) {
  return lines.map((line) => {
    const match = line.match(/^(\d+)\.\s*(.+?)\s*—\s*(.+)$/);
    if (!match) return { step: 0, title: line, text: "" };
    return { step: Number(match[1]), title: match[2], text: match[3] };
  });
}

export function resolveVerificationServices(cms?: CmsSectionMap): VerificationService[] {
  return VERIFICATION_SERVICES.map((svc) => {
    const f = cmsSection(cms, `service-${svc.n}`);
    const sectionsRaw = cmsField(f, "sections", "");
    const sections =
      sectionsRaw && svc.sections
        ? parseReportSections(cmsLines(f, "sections", svc.sections.map((s) => `${s.title}: ${s.text}`)))
        : svc.sections;

    return {
      ...svc,
      title: cmsField(f, "title", svc.title),
      summary: cmsField(f, "summary", svc.summary),
      intro: cmsField(f, "intro", svc.intro ?? ""),
      items: cmsLines(f, "items", svc.items ?? []),
      body: cmsField(f, "body", svc.body ?? ""),
      note: cmsField(f, "note", svc.note ?? ""),
      sections,
    };
  });
}

export function buildVerificationStory(cms?: CmsSectionMap) {
  const f = cmsSection(cms, "story");
  const story = VERIFICATION_STORY;
  return {
    eyebrow: cmsField(f, "eyebrow", story.eyebrow),
    title: cmsField(f, "title", story.title),
    lead: cmsField(f, "lead", story.lead),
    youtubeUrl: cmsField(f, "youtubeUrl", story.youtubeUrl),
    imageSrc: cmsField(f, "imageSrc", story.imageSrc),
    imageAlt: cmsField(f, "imageAlt", story.imageAlt),
    boxes: [
      {
        title: cmsField(f, "box1Title", story.boxes[0].title),
        body: cmsField(f, "box1Body", story.boxes[0].body),
      },
      {
        title: cmsField(f, "box2Title", story.boxes[1].title),
        body: cmsField(f, "box2Body", story.boxes[1].body),
      },
      {
        title: cmsField(f, "box3Title", story.boxes[2].title),
        body: cmsField(f, "box3Body", story.boxes[2].body),
      },
    ],
  };
}

export function buildVerificationFooterContent(cms?: CmsSectionMap) {
  const notF = cmsSection(cms, "not-guarantee");
  const trustF = cmsSection(cms, "closing-trust");
  const ctaF = cmsSection(cms, "cta");

  return {
    notGuarantee: {
      title: cmsField(notF, "title", VERIFICATION_NOT_GUARANTEE.title),
      lead: cmsField(notF, "lead", VERIFICATION_NOT_GUARANTEE.lead),
      items: cmsLines(notF, "items", VERIFICATION_NOT_GUARANTEE.items),
      note: cmsField(notF, "note", VERIFICATION_NOT_GUARANTEE.note),
    },
    closingTrust: cmsField(
      trustF,
      "body",
      "In global commodity markets, trust should be supported by evidence. Finekarts helps businesses move beyond documents and representations by combining corporate verification, regulatory information, commercial intelligence, credit assessment, supply-chain analysis and independent inspection where appropriate.",
    ),
    cta: {
      title: cmsField(ctaF, "title", VERIFICATION_CTA.title),
      lead: cmsField(ctaF, "lead", VERIFICATION_CTA.lead),
      tagline: cmsField(ctaF, "tagline", VERIFICATION_CTA.tagline),
      fields: cmsLines(ctaF, "fields", VERIFICATION_CTA.fields),
    },
  };
}

export function buildVerificationHubContent(cms?: CmsSectionMap) {
  const globalF = cmsSection(cms, "global-network");
  const intelF = cmsSection(cms, "real-time-intel");
  const frameworkF = cmsSection(cms, "framework");
  const reportF = cmsSection(cms, "report-sections");

  return {
    services: resolveVerificationServices(cms),
    globalNetwork: {
      title: cmsField(globalF, "title", GLOBAL_VERIFICATION_NETWORK.title),
      lead: cmsField(globalF, "lead", GLOBAL_VERIFICATION_NETWORK.lead),
      regions: cmsLines(globalF, "regions", GLOBAL_VERIFICATION_NETWORK.regions),
      note: cmsField(globalF, "note", GLOBAL_VERIFICATION_NETWORK.note),
    },
    realTimeIntel: {
      title: cmsField(intelF, "title", REAL_TIME_INTELLIGENCE.title),
      lead: cmsField(intelF, "lead", REAL_TIME_INTELLIGENCE.lead),
      note: cmsField(intelF, "note", REAL_TIME_INTELLIGENCE.note),
      disclaimer: cmsField(intelF, "disclaimer", REAL_TIME_INTELLIGENCE.disclaimer),
    },
    frameworkSteps: parseFrameworkSteps(
      cmsLines(
        frameworkF,
        "steps",
        VERIFICATION_FRAMEWORK_STEPS.map((s) => `${s.step}. ${s.title} — ${s.text}`),
      ),
    ),
    reportSections: parseReportSections(
      cmsLines(
        reportF,
        "sections",
        VERIFICATION_REPORT_SECTIONS.map((s) => `${s.title}: ${s.text}`),
      ),
    ),
  };
}
