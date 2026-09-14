/** Client-approved logistics photography — single source of truth. */

export type LogisticsImage = { src: string; alt: string };

export const LOGISTICS_IMAGES = {
  hero: {
    src: "/images/logistics/global-multimodal-day.jpg",
    alt: "Global multimodal logistics — cargo ship, aircraft, truck, and worldwide trade routes",
  },
  seaAirRoutes: {
    src: "/images/logistics/sea-air-freight-routes.jpg",
    alt: "Sea freight and air freight routes connecting global trade lanes",
  },
  portTrucks: {
    src: "/images/logistics/port-trucks-container-yard.png",
    alt: "Container trucks at a busy export port with vessel and gantry cranes at sunset",
  },
  terminalHub: {
    src: "/images/logistics/container-terminal-hub.png",
    alt: "Busy container terminal — vessel at berth, gantry cranes, warehouse, rail, and road freight",
  },
  terminalOperations: {
    src: "/images/logistics/container-terminal-operations.jpg",
    alt: "Container terminal operations — cargo ship, truck, and stacked containers at port",
  },
  supplyChainNight: {
    src: "/images/logistics/global-supply-chain-night.jpg",
    alt: "Integrated global supply chain — vessel, rail, air, and road freight connected worldwide",
  },
  railIntermodalYard: {
    src: "/images/logistics/rail-intermodal-yard.png",
    alt: "Intermodal rail yard — locomotive and long train of stacked shipping containers",
  },
  railInternationalContainers: {
    src: "/images/logistics/rail-international-containers.jpg",
    alt: "International rail freight — flag-marked containers on intermodal flatcars",
  },
  gantryCraneRailLoading: {
    src: "/images/logistics/gantry-crane-rail-loading.png",
    alt: "Gantry crane loading a shipping container onto a rail wagon at a freight terminal",
  },
  bulkGrainRail: {
    src: "/images/logistics/bulk-grain-rail-silos.jpg",
    alt: "Bulk grain hopper train beside silos — agricultural rail logistics",
  },
  roadFreightHighway: {
    src: "/images/logistics/road-freight-highway.jpg",
    alt: "Road freight — articulated truck on a highway at golden hour",
  },
} as const;

/** Full-width ship + truck band (logistics page bleed + home food-safety band). */
export const LOGISTICS_SHIP_TRUCK_BAND = LOGISTICS_IMAGES.terminalOperations;

/** Split panels & backdrop — each `src` used once on `/logistics` (except shared band above). */
export const LOGISTICS_PAGE_SECTION_IMAGES = {
  globalCoverage: LOGISTICS_IMAGES.seaAirRoutes,
  realTimeTracking: LOGISTICS_IMAGES.terminalHub,
  portToPort: LOGISTICS_IMAGES.railInternationalContainers,
  contractToCargo: LOGISTICS_IMAGES.supplyChainNight,
} as const;

/** “Global reach” — five rail / road aspects (not reused in split panels above). */
export const LOGISTICS_GALLERY_IMAGES: readonly LogisticsImage[] = [
  LOGISTICS_IMAGES.railIntermodalYard,
  LOGISTICS_IMAGES.gantryCraneRailLoading,
  LOGISTICS_IMAGES.bulkGrainRail,
  LOGISTICS_IMAGES.roadFreightHighway,
  LOGISTICS_IMAGES.portTrucks,
];
