import {
  type CmsSectionMap,
  cmsField,
  cmsLines,
  cmsParagraphs,
  cmsSection,
} from "@/lib/content/cms-field";
import {
  ABOUT_CONTACT,
  ABOUT_HIGHLIGHTS,
  ABOUT_INTRO,
  ABOUT_SUPPLY_CHAIN,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY_PARTNER,
} from "@/lib/content/about-content";
import { ABOUT_SECTION_IMAGE_META } from "@/lib/content/about-images";

/** "Title: text" lines -> items (falls back to the default item at the same index). */
function titleTextLines<T extends { title: string }>(
  lines: string[],
  defaults: readonly T[],
  textKey: "body" | "detail",
) {
  return defaults.map((d, i) => {
    const line = lines[i];
    if (!line) return d;
    const idx = line.indexOf(":");
    if (idx === -1) return d;
    return { ...d, title: line.slice(0, idx).trim(), [textKey]: line.slice(idx + 1).trim() };
  });
}

/**
 * Divisions format: "N. Title" line, then intro line, then "• bullet" lines.
 * Next "N. Title" line starts the next division.
 */
function parseDivisions(raw: string, defaults: typeof ABOUT_WHAT_WE_DO.divisions) {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const groups: string[][] = [];
  for (const line of lines) {
    if (/^\d+\.\s/.test(line) || groups.length === 0) groups.push([line]);
    else groups[groups.length - 1].push(line);
  }
  return defaults.map((d, i) => {
    const g = groups[i];
    if (!g) return d;
    const title = g[0].replace(/^\d+\.\s*/, "").trim();
    const rest = g.slice(1);
    const intro = rest.find((l) => !l.startsWith("•")) ?? d.intro;
    const bullets = rest.filter((l) => l.startsWith("•")).map((l) => l.replace(/^•\s*/, ""));
    return { ...d, title: title || d.title, intro, bullets: bullets.length ? bullets : [...d.bullets] };
  });
}

export function resolveAboutSections(cms?: CmsSectionMap) {
  const intro = cmsSection(cms, "intro");
  const hl = cmsSection(cms, "highlights");
  const wwd = cmsSection(cms, "what-we-do");
  const sc = cmsSection(cms, "supply-chain");
  const wp = cmsSection(cms, "why-partner");
  const cb = cmsSection(cms, "contact-band");
  const img = ABOUT_SECTION_IMAGE_META;

  return {
    intro: {
      eyebrow: cmsField(intro, "eyebrow", ABOUT_INTRO.eyebrow),
      title: cmsField(intro, "title", ABOUT_INTRO.title),
      paragraphs: cmsParagraphs(intro, "paragraphs", [...ABOUT_INTRO.paragraphs]),
      ctaLabel: cmsField(intro, "ctaLabel", "Learn more about products"),
      image: {
        src: cmsField(intro, "imageSrc", img.teamStrategy.src),
        alt: cmsField(intro, "imageAlt", img.teamStrategy.alt),
      },
    },
    highlights: titleTextLines(
      cmsLines(hl, "items", ABOUT_HIGHLIGHTS.map((h) => `${h.title}: ${h.detail}`)),
      ABOUT_HIGHLIGHTS,
      "detail",
    ),
    whatWeDo: {
      eyebrow: cmsField(wwd, "eyebrow", ABOUT_WHAT_WE_DO.eyebrow),
      title: cmsField(wwd, "title", ABOUT_WHAT_WE_DO.title),
      lead: cmsField(wwd, "lead", ABOUT_WHAT_WE_DO.lead),
      divisions: parseDivisions(wwd.content?.trim() ?? "", ABOUT_WHAT_WE_DO.divisions),
    },
    supplyChain: {
      eyebrow: cmsField(sc, "eyebrow", ABOUT_SUPPLY_CHAIN.eyebrow),
      title: cmsField(sc, "title", ABOUT_SUPPLY_CHAIN.title),
      lead: cmsField(sc, "lead", ABOUT_SUPPLY_CHAIN.lead),
      bullets: titleTextLines(
        cmsLines(sc, "bullets", ABOUT_SUPPLY_CHAIN.bullets.map((b) => `${b.title}: ${b.body}`)),
        ABOUT_SUPPLY_CHAIN.bullets,
        "body",
      ),
      ctaLabel: cmsField(sc, "ctaLabel", "Explore trade resources"),
      image: {
        src: cmsField(sc, "imageSrc", img.teamCollaboration.src),
        alt: cmsField(sc, "imageAlt", img.teamCollaboration.alt),
      },
    },
    whyPartner: {
      eyebrow: cmsField(wp, "eyebrow", ABOUT_WHY_PARTNER.eyebrow),
      title: cmsField(wp, "title", ABOUT_WHY_PARTNER.title),
      items: titleTextLines(
        cmsLines(wp, "items", ABOUT_WHY_PARTNER.items.map((i) => `${i.title}: ${i.body}`)),
        ABOUT_WHY_PARTNER.items,
        "body",
      ),
    },
    contact: {
      eyebrow: cmsField(cb, "eyebrow", ABOUT_CONTACT.eyebrow),
      title: cmsField(cb, "title", ABOUT_CONTACT.title),
      lines: cmsLines(cb, "items", [...ABOUT_CONTACT.lines]),
      ctaTitle: cmsField(cb, "ctaTitle", ABOUT_CONTACT.ctaTitle),
      ctaBody: cmsField(cb, "ctaBody", ABOUT_CONTACT.ctaBody),
      primaryCtaLabel: cmsField(cb, "primaryCtaLabel", "Submit a purchase request"),
      secondaryCtaLabel: cmsField(cb, "secondaryCtaLabel", "Request a consultation"),
      imageSrc: cmsField(cb, "imageSrc", img.contactBand.src),
    },
  };
}

export type ResolvedAbout = ReturnType<typeof resolveAboutSections>;
