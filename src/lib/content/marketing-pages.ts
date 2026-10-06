import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
export const INSPECTIONS_STORY = {
  eyebrow: "How we trade",
  title: "Bulk commodities with independent inspection where the contract requires it",
  lead:
    "Finekarts sells agricultural and edible-oil cargoes to qualified buyers. Inspection is a tool — we appoint recognized independent firms at origin, loading, or destination when the PSA and bank call for documented quality and quantity evidence.",
  youtubeUrl: "https://www.youtube.com/watch?v=gADVpRPdr7E",
  showcaseImageSrc: "/images/inspections/warehouse-bulk-inspection.png",
  showcaseImageAlt:
    "SGS inspectors walking through a bulk commodity warehouse with stacked agricultural bags",
  imageSrc: "/images/inspections/sgs-laboratory-grain-sampling.png",
  imageAlt: "SGS inspector handling a grain sample in a laboratory",
  boxes: [
    {
      title: "Quality",
      body: "Commodity quality inspection and laboratory testing against contract — ICUMSA and polarization for sugar, moisture for grains, FFA for oils, and other agreed parameters.",
    },
    {
      title: "Safety",
      body: "Pre-shipment and loading supervision verify packaging, hold or tank suitability, seals, and chain of custody before cargo leaves origin.",
    },
    {
      title: "Punctuality",
      body: "Inspection scope and inspector appointment are aligned with laycan and banking presentation so certificates are issued when your transaction needs them.",
    },
  ] satisfies MarketingContentBox[],
};

export const VERIFICATION_STORY = {
  eyebrow: "Due diligence",
  title: "Evidence before we commit to a trade",
  lead:
    "Finekarts conducts bulk commodity trades through structured due diligence. We use trusted verification providers, commercial intelligence, validation, and inspection where appropriate — to assess parties, product, and supply chain before signing a PSA. We coordinate these tools; we are not the verification provider.",
  youtubeUrl: "https://www.youtube.com/watch?v=nFFts9WyUm8",
  imageSrc: "/images/verification/story-panel.jpg",
  imageAlt: "Trade desk reviewing structured due diligence before committing to a bulk commodity trade",
  boxes: [
    {
      title: "Identity",
      body: "Corporate registration, government records, licenses and sanctions screening establish whether the counterparty presented in negotiations corresponds with a legally established, operational business.",
    },
    {
      title: "Capability",
      body: "Origin, manufacturer, and distributor verification assess production capacity, facilities, certifications and trade references — distinguishing established operators from limited intermediaries.",
    },
    {
      title: "Commodity",
      body: "Company verification and commodity verification are separate disciplines. Where required, independent inspection confirms inventory, quantity, quality and loading activities.",
    },
  ] satisfies MarketingContentBox[],
};

/** @deprecated Import from `@/lib/content/logistics-story` */
export { LOGISTICS_STORY } from "@/lib/content/logistics-story";

/** @deprecated Use LOGISTICS_STORY */
export { LOGISTICS_STORY as SHIPPING_STORY } from "@/lib/content/logistics-story";
