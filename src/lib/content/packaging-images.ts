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
    src: "/images/packaging/bulk-vessel-hold.png",
    alt: "Dry bulk carrier with open cargo holds loading unpackaged commodity",
  },
  bulkVesselLoading: {
    src: "/images/packaging/bulk-vessel-loading.png",
    alt: "Bulk vessel being loaded from shore silos via conveyor at port",
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
    alt: "Hopper bulk truck and trailer at a grain elevator with storage silos",
  },
  bulkRailcar: {
    src: "/images/packaging/bulk-railcar.png",
    alt: "Bulk hopper railcars at a grain terminal",
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

function teaser(name: string, photo: { src: string; alt: string }) {
  return { name, image: photo.src, alt: photo.alt };
}

/** Homepage packaging grid — transport modes with client-verified photos. */
export const HOMEPAGE_PACKAGING_TEASER = [
  teaser("Flexitanks", PACKAGING_IMAGES.flexitank),
  teaser("Tanker Vessel", PACKAGING_IMAGES.tankerVessel),
  teaser("Bulk Vessels", PACKAGING_IMAGES.bulkVessel),
  teaser("Bulk Railcar", PACKAGING_IMAGES.bulkRailcar),
  teaser("ISO Tank Containers", PACKAGING_IMAGES.isoTank1),
] as const;
