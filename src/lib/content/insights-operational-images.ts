/** Re-export hub photos for the operational insights layout (no /inspections paths). */

import { INSIGHTS_HUB_SECTION_PHOTOS } from "@/lib/content/insight-images";

export const INSIGHTS_SECTION_IMAGES = {
  introLab: INSIGHTS_HUB_SECTION_PHOTOS.overview,
  architecture: INSIGHTS_HUB_SECTION_PHOTOS.architecture,
  protocolLoading: INSIGHTS_HUB_SECTION_PHOTOS.protocol,
  validationOverview: INSIGHTS_HUB_SECTION_PHOTOS.validationBand,
  labValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainLab,
  supplyChainValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainSupply,
  financeValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainFinance,
  ctrmValidation: INSIGHTS_HUB_SECTION_PHOTOS.domainCtrm,
} as const;
