/** Re-export hub photos for the operational insights layout (no /inspections paths). */

import { INSIGHTS_HUB_SECTION_PHOTOS } from "@/lib/content/insight-images";

export const INSIGHTS_SECTION_IMAGES = {
  introLab: INSIGHTS_HUB_SECTION_PHOTOS.overview,
  architecture: INSIGHTS_HUB_SECTION_PHOTOS.architecture,
  protocolLoading: INSIGHTS_HUB_SECTION_PHOTOS.protocol,
  protocolLabPrimary: {
    src: "/images/insights/protocol/lab-testing-primary.jpg",
    alt: "Laboratory technician analysing commodity sample in ISO-style testing environment",
  },
  protocolLabSecondary: {
    src: "/images/insights/protocol/lab-testing-secondary.jpg",
    alt: "Trade audit and inspection validation — documentary and analytical compliance",
  },
  validationOverview: INSIGHTS_HUB_SECTION_PHOTOS.validationBand,
  labValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainLab,
  supplyChainValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainSupply,
  financeValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainFinance,
  ctrmValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainCtrm,
} as const;
