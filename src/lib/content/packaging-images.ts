/**
 * Client-approved packaging photography — single source of truth.
 * Every label on the marketing site must use the matching path below.
 */

export const PACKAGING_IMAGES = {
  flexitank: {
    src: "/images/packaging/flexitank.png",
    alt: "Flexitank liquid bladder installed inside a shipping container",
  },
  ibcTote: {
    src: "/images/packaging/ibc-1.png",
    alt: "Schütz IBC tote with metal cage on pallet",
  },
  ibcToteWarehouse: {
    src: "/images/packaging/ibc-2.png",
    alt: "White IBC tote with metal cage in an industrial warehouse",
  },
  drums: {
    src: "/images/packaging/drums.png",
    alt: "Yellow steel drums stacked on pallets in a warehouse",
  },
  fibcJumboBag: {
    src: "/images/packaging/fibc-jumbo-bags.png",
    alt: "FIBC jumbo bag filled with granular dry commodity",
  },
  fibcJumboBagsStacked: {
    src: "/images/packaging/fibc-jumbo-bags-2.png",
    alt: "Warehouse stacked with white FIBC jumbo bags",
  },
  bulkVessel: {
    src: "/images/packaging/bulk-vessel-cargo-loading.png",
    alt: "Bulk carrier vessel loading dry commodity cargo at port",
  },
  bulkVesselLoading: {
    src: "/images/packaging/bulk-vessel-loading.png",
    alt: "Bulk vessel being loaded with dry bulk cargo at a marine terminal",
  },
  bulkVesselHold: {
    src: "/images/packaging/bulk-vessel-hold.png",
    alt: "Dry bulk commodity in a ship hold during loading operations",
  },
  bulkVesselPort: {
    src: "/images/packaging/bulk-vessel-cargo-loading.png",
    alt: "Bulk carrier loading dry commodity cargo at port",
  },
  containerizedCargoPort: {
    src: "/images/packaging/containerized-cargo-port.png",
    alt: "Container ship at port with gantry cranes",
  },
  containerizedCargoLoading: {
    src: "/images/packaging/containerized-cargo-loading.png",
    alt: "Bagged commodity cargo loaded into a shipping container",
  },
  tankerVessel: {
    src: "/images/packaging/tanker-vessel.jpg",
    alt: "Liquid bulk tanker vessel at sea with cargo piping on deck",
  },
  bulkTruck: {
    src: "/images/packaging/bulk-truck.png",
    alt: "White hopper trailer truck with bulk commodity silos at an elevator terminal",
  },
  bulkRailcar: {
    src: "/images/packaging/bulk-railcar.jpg",
    alt: "White covered hopper railcars on curved track for dry bulk export",
  },
  bulkRailcarHopperTrain: {
    src: "/images/packaging/bulk-railcar-hopper-train.jpg",
    alt: "Covered hopper railcar train on multi-track corridor for agricultural bulk",
  },
  bulkRailcarGrainTerminal: {
    src: "/images/packaging/bulk-railcar-grain-terminal.jpg",
    alt: "Bulk grain hopper train beside export silos and rail loading infrastructure",
  },
  bulkRailcarIntermodal: {
    src: "/images/packaging/bulk-railcar-intermodal.png",
    alt: "Intermodal rail corridor connecting inland elevators to port bulk terminals",
  },
  isoTank1: {
    src: "/images/packaging/iso-tank-1.png",
    alt: "ISO tank container with blue frame and white cylindrical tank for intermodal liquid bulk",
  },
  isoTank2: {
    src: "/images/packaging/iso-tank-2.png",
    alt: "ISO tank container at a logistics yard",
  },
  bulkLiner: {
    src: "/images/packaging/bulk-liner.png",
    alt: "Container liner for dry bulk inside a shipping container",
  },
  palletizedBags: {
    src: "/images/packaging/palletized-bags.png",
    alt: "Palletized multi-wall sacks in a warehouse",
  },
  kraftPaperBags: {
    src: "/images/packaging/kraft-paper-bags.png",
    alt: "Kraft paper bags for commodity packaging",
  },
  laminatedPpBags: {
    src: "/images/packaging/laminated-pp-bags.png",
    alt: "Laminated polypropylene bags",
  },
  bags50kg: {
    src: "/images/packaging/bags-50kg.png",
    alt: "Fifty-kilogram commodity sacks",
  },
  bags25kg: {
    src: "/images/packaging/bags-25kg.png",
    alt: "Twenty-five-kilogram commodity sacks",
  },
  ppWovenBags: {
    src: "/images/packaging/pp-woven-bags.png",
    alt: "PP woven bags for sugar and grains",
  },
} as const;

function teaser(
  name: string,
  slug: string,
  photo: { src: string; alt: string },
) {
  return { name, slug, image: photo.src, alt: photo.alt };
}

/** Slugs featured on the homepage packaging grid — full catalogue lives on /packaging. */
export const HOMEPAGE_PACKAGING_SLUGS = [
  "flexitank",
  "bulk-railcar",
  "tanker-vessel",
  "bulk-vessel",
  "bulk-truck",
] as const;

/** Homepage packaging grid — teaser photos are unique from `/packaging` body imagery; slugs link to the catalogue. */
export const HOMEPAGE_PACKAGING_TEASER = [
  teaser("Flexitank", "flexitank", {
    src: "/images/home/packaging-teaser-flexitank.jpg",
    alt: "Flexitank bladder installed inside a shipping container",
  }),
  teaser("Bulk Railcar", "bulk-railcar", {
    src: "/images/home/packaging-teaser-bulk-rail-ship.jpg",
    alt: "Bulk carrier and export terminal — inland-to-port bulk logistics",
  }),
  teaser("Tanker Vessel", "tanker-vessel", PACKAGING_IMAGES.tankerVessel),
  teaser("Bulk Vessel", "bulk-vessel", PACKAGING_IMAGES.bulkVesselLoading),
  teaser("Bulk Truck", "bulk-truck", {
    src: "/images/home/packaging-teaser-bulk-truck.jpg",
    alt: "Hopper truck loading grain at an elevator terminal",
  }),
] as const;
