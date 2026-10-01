import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";

/** Each image used at most once on `/resources` (hero is CMS `resourcesHero`). */
export const RESOURCES_PAGE_IMAGES = {
  banking: {
    src: "/images/packaging/iso-tank-1.png",
    alt: "International trade and commodity documentation context",
  },
  payments: {
    src: AGRICULTURE_IMAGES.grainSilos.src,
    alt: AGRICULTURE_IMAGES.grainSilos.alt,
  },
  documents: {
    src: AGRICULTURE_IMAGES.combineHarvest.src,
    alt: AGRICULTURE_IMAGES.combineHarvest.alt,
  },
  downloads: {
    src: "/images/packaging/containerized-cargo-port.png",
    alt: "Containerized export cargo at port",
  },
} as const;
