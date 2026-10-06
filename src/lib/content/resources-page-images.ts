import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";

/** Each image used at most once on `/resources` (hero is CMS `resourcesHero`). */
export const RESOURCES_PAGE_IMAGES = {
  banking: {
    src: "/images/packaging/ibc-2.png",
    alt: "Industrial IBC tote in warehouse — trade finance and documentation context",
  },
  payments: {
    src: AGRICULTURE_IMAGES.teaPlantation.src,
    alt: AGRICULTURE_IMAGES.teaPlantation.alt,
  },
  documents: {
    src: AGRICULTURE_IMAGES.combineHarvest.src,
    alt: AGRICULTURE_IMAGES.combineHarvest.alt,
  },
  downloads: {
    src: "/images/agriculture/grain-silos.png",
    alt: "Grain silos and export storage for trade document downloads",
  },
} as const;
