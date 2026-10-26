import type { CmsSectionMap } from "@/lib/content/cms-field";
import { CAREERS_INTRO } from "@/lib/content/careers-page-content";
import { CAREERS_PAGE_IMAGES } from "@/lib/content/careers-page-images";
import {
  CAREERS_APPLICATION_DEFAULTS,
  CAREERS_EQUAL_OPPORTUNITY_DEFAULTS,
  CAREERS_INTRO_DEFAULTS,
  CAREERS_PILLARS_DEFAULTS,
  cmsImageSrc,
  cmsMerged,
  parseTitleBodyRows,
} from "@/lib/marketing/simple-pages-cms";

/** Admin section ids for /careers. */
export const CAREERS_CMS_SECTION_IDS = [
  "hero",
  "intro",
  "pillars",
  "application",
  "equal-opportunity",
] as const;

export function buildCareersContent(cms: CmsSectionMap) {
  const intro = cmsMerged(cms, "intro", CAREERS_INTRO_DEFAULTS);
  const pillars = cmsMerged(cms, "pillars", CAREERS_PILLARS_DEFAULTS);
  const application = cmsMerged(cms, "application", CAREERS_APPLICATION_DEFAULTS);
  const equal = cmsMerged(cms, "equal-opportunity", CAREERS_EQUAL_OPPORTUNITY_DEFAULTS);

  return {
    intro: {
      eyebrow: intro.eyebrow,
      title: intro.title,
      lead: intro.lead,
      image: {
        src: cmsImageSrc(cms.intro?.image, CAREERS_PAGE_IMAGES.interview.src),
        alt: CAREERS_PAGE_IMAGES.interview.alt,
      },
    },
    pillars: parseTitleBodyRows(
      pillars.cardItems,
      CAREERS_INTRO.pillars.map((p) => [p.title, p.body]),
    ).map(([title, body]) => ({ title, body })),
    application,
    equalOpportunity: equal,
  };
}

export type CareersContent = ReturnType<typeof buildCareersContent>;
