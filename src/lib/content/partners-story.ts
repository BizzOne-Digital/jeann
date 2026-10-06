import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";

/** Story block for `/partners` only — keep imagery out of shared marketing-pages registries. */
export const PARTNERS_STORY = {
  eyebrow: "Independent partners",
  title: "Recognized inspection and certification relationships",
  lead:
    "On commodity programmes we sell, Finekarts may appoint internationally known inspection, testing, and certification firms when contracts call for independent evidence — we coordinate them; we do not operate as those brands.",
  youtubeUrl: "https://www.youtube.com/watch?v=rJPI2UA25HQ",
  imageSrc: "/images/partners/in-the-field-coffee-inspection.jpg",
  imageAlt:
    "Inspector holding a sealed green coffee bean sample beside ripe cherries at origin — independent partner inspection context",
  boxes: [
    {
      title: "Quality",
      body:
        "Partner networks cover agricultural commodities, edible oils, minerals, and petroleum — with scope-specific accreditation that should be confirmed for each port, laboratory, and service line.",
    },
    {
      title: "Safety",
      body:
        "Independent inspection scope can cover sanitary handling, packaging integrity, and documentary traceability from load port through discharge when agreed in the PSA.",
    },
    {
      title: "Punctuality",
      body:
        "Appointed surveyors align field attendance with vessel schedules and banking deadlines so certificates are issued when your transaction needs them.",
    },
  ] satisfies MarketingContentBox[],
} as const;
