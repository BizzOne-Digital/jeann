/** One use per image on /inspections (hero uses PAGE_HERO_IMAGES.inspections). */

export const INSPECTIONS_SECTION_IMAGES = {
  intro: {
    src: "/images/inspections/sgs-laboratory-grain-sampling.png",
    alt: "Laboratory grain sampling for structured quality inspection",
  },
  timing: {
    src: "/images/inspections/port-sampling.png",
    alt: "Port sampling during incoming and pre-shipment inspection",
  },
  visual: {
    src: "/images/inspections/sampling-grain.png",
    alt: "Visual inspection and representative sampling of bulk grain",
  },
  finalShipment: {
    src: "/images/inspections/container-rail-loading.png",
    alt: "Gantry crane loading a container onto rail — pre-shipment supervision",
  },
  ndt: {
    src: "/images/inspections/liquid-sampling.png",
    alt: "Technical sampling for non-destructive and laboratory analysis",
  },
  destructive: {
    src: "/images/inspections/tank-sampling.png",
    alt: "Tank and hold sampling for integrity verification",
  },
  dimensional: {
    src: "/images/inspections/warehouse-sack-sampling.png",
    alt: "Dimensional and sack-level inspection in warehouse",
  },
  inProcess: {
    src: "/images/inspections/warehouse-bulk-inspection.png",
    alt: "In-process bulk warehouse inspection",
  },
  regulatory: {
    src: "/images/inspections/green-coffee-warehouse-inspection.png",
    alt: "Warehouse inspection for trade and environmental compliance",
  },
  commodity: {
    src: "/images/inspections/sugar-bags-hold.png",
    alt: "Commodity hold inspection for quantity and quality verification",
  },
} as const;
