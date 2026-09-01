/** Client-approved packaging types — display order is fixed. */

export type PackagingTypeContent = {
  order: number;
  slug: string;
  name: string;
  mode: "dry" | "liquid" | "unpackaged";
  category: "transport" | "product";
  summary: string;
  description: string;
  applications: string[];
  advantages: string[];
  commodities: string[];
  images: { src: string; alt: string }[];
  note?: string;
};

export const PACKAGING_HERO = {
  eyebrow: "Packaging types",
  title: "Packaging & transport modes for global commodity trade",
  description:
    "Finekarts structures commodity programmes across transport modes — flexitank, tanker vessel, containerized cargo, bulk truck, bulk vessel and bulk railcar — and product packaging formats including ISO tanks, IBC totes, drums, bulk liners, FIBCs, woven and laminated bags. Not every option is available for every commodity or corridor.",
  primaryCta: { href: "#packaging-types", label: "View packaging types →" },
  secondaryCta: { href: "/logistics", label: "Logistics overview" },
};

/** Homepage “Packaging for Every Commodity” grid — uses client photos from public/images/packaging/. */
export const HOMEPAGE_PACKAGING_TEASER = [
  {
    name: "Jumbo Bags",
    image: "/images/packaging/fibc-jumbo-bags.png",
    alt: "FIBC jumbo bag filled with granular dry commodity",
  },
  {
    name: "Flexitanks",
    image: "/images/packaging/flexitank.png",
    alt: "Flexitank bladder installed inside a shipping container",
  },
  {
    name: "IBC Totes",
    image: "/images/packaging/ibc-1.png",
    alt: "Intermediate bulk container tote for liquid commodities",
  },
  {
    name: "Drums",
    image: "/images/packaging/drums.png",
    alt: "Steel drums for edible oils and liquid products",
  },
  {
    name: "Bulk Vessels",
    image: "/images/packaging/bulk-vessel-hold.png",
    alt: "Dry bulk carrier with open cargo holds loading unpackaged agricultural commodity",
  },
] as const;

export const PACKAGING_TYPES: PackagingTypeContent[] = [
  {
    order: 1,
    slug: "flexitank",
    name: "Flexitank",
    mode: "liquid",
    category: "transport",
    summary: "Liquid bulk inside a standard shipping container.",
    description:
      "A flexitank is a flexible bladder fitted inside a 20-foot shipping container, used to transport non-hazardous liquid commodities such as edible oils and other suitable food-grade liquids. It converts a dry container into a single-use liquid bulk compartment when properly installed and supported.",
    applications: [
      "Edible oils and refined vegetable oils",
      "Non-hazardous food-grade liquids where product suitability is confirmed",
      "Containerised liquid programmes when ISO tanks or tanker parcels are not required",
    ],
    advantages: [
      "Cost-effective liquid bulk in standard containers",
      "Single-use bladder reduces cross-contamination risk when properly fitted",
      "Suitable for medium-volume liquid shipments on established container routes",
    ],
    commodities: ["Sunflower oil", "Soybean oil", "Palm oil", "Rapeseed oil", "Other suitable liquids"],
    images: [
      {
        src: "/images/packaging/flexitank.png",
        alt: "Flexitank bladder installed inside a shipping container for liquid bulk transport",
      },
    ],
    note: "Product compatibility, container condition, reinforcement and discharge method must be confirmed before nomination.",
  },
  {
    order: 2,
    slug: "tanker-vessel",
    name: "Tanker vessel",
    mode: "unpackaged",
    category: "transport",
    summary: "Dedicated liquid bulk ocean transport.",
    description:
      "Tanker vessels carry liquid commodities in dedicated cargo tanks — the primary mode for large-volume crude and refined edible oils, oleochemicals and other suitable liquid bulk programmes. Loading and discharge typically take place at specialised terminals with pipeline or hose connections.",
    applications: [
      "Large-volume edible oil and liquid food programmes",
      "Crude and refined oil movements between producing and consuming ports",
      "Parcel or full-ship tanker cargoes subject to route and terminal capability",
    ],
    advantages: [
      "Highest efficiency for very large liquid bulk volumes",
      "Dedicated tank compartments for food-grade or product-specific cargoes",
      "Pipeline loading and discharge at suitable marine terminals",
    ],
    commodities: ["Crude edible oils", "Refined oils", "Liquid bulk food products where agreed"],
    images: [
      {
        src: "/images/packaging/tanker-vessel.png",
        alt: "Product tanker vessel underway at sea",
      },
    ],
    note: "Tank preparation, prior-cargo history, heating and coating requirements are confirmed per contract and terminal rules.",
  },
  {
    order: 3,
    slug: "containerized-cargo",
    name: "Containerized cargo",
    mode: "dry",
    category: "transport",
    summary: "Bagged, palletized or unitized cargo in standard containers.",
    description:
      "Containerized programmes move packaged commodities — such as bagged sugar, rice, pulses and similar goods — in 20-foot or 40-foot containers. This mode suits smaller parcels, multi-drop delivery and destinations with container-handling infrastructure.",
    applications: [
      "Bagged sugar, rice, grains and pulses",
      "Palletized or sack cargo for regional distribution",
      "Programmes where buyers prefer container lots over bulk vessel minimums",
    ],
    advantages: [
      "Flexible lot sizes compared with full bulk-vessel programmes",
      "Door-to-port or port-to-port options on established liner services",
      "Easier inventory control with defined bag or unit counts per container",
    ],
    commodities: ["ICUMSA sugar (bagged)", "Rice", "Grains", "Pulses", "Packaged food products"],
    images: [
      {
        src: "/images/packaging/containerized-cargo-loading.png",
        alt: "Bagged commodity cargo loaded into a shipping container via conveyor",
      },
      {
        src: "/images/packaging/containerized-cargo-port.png",
        alt: "Container ship at port with gantry cranes loading containers",
      },
    ],
  },
  {
    order: 4,
    slug: "bulk-truck",
    name: "Bulk truck",
    mode: "dry",
    category: "transport",
    summary: "Road transport of unpackaged or pneumatic dry bulk.",
    description:
      "Bulk trucks — including hopper trailers and pneumatic tankers — move dry commodities by road between farms, mills, warehouses, silos and port terminals. This mode bridges origin storage and export loading points in domestic and cross-border corridors.",
    applications: [
      "Farm-to-silo or mill-to-terminal dry bulk movements",
      "Pneumatic discharge into storage or ship-loading systems",
      "Regional redistribution before ocean or rail export",
    ],
    advantages: [
      "Direct road access where rail or vessel cannot reach origin",
      "Efficient for staged delivery to port silos and loading facilities",
      "Gravity or pneumatic discharge into storage and conveyor systems",
    ],
    commodities: ["Grains", "Sugar (bulk where agreed)", "Pulses", "Other dry flowable commodities"],
    images: [
      {
        src: "/images/packaging/bulk-truck.png",
        alt: "Hopper bulk truck at an industrial grain terminal with storage silos",
      },
    ],
    note: "Trailer type, moisture limits and weighbridge documentation should be agreed for each programme.",
  },
  {
    order: 5,
    slug: "bulk-vessel",
    name: "Bulk vessel",
    mode: "unpackaged",
    category: "transport",
    summary: "Unpackaged dry bulk in vessel holds.",
    description:
      "Bulk vessels transport large quantities of unpackaged dry commodities — sugar, grains, rice and similar cargoes — loaded directly into vessel holds. This is the standard mode for high-volume international dry bulk trade when parcel size and route economics justify a full or part-cargo shipment.",
    applications: [
      "Large-volume sugar, grain and rice export programmes",
      "Draft-survey quantity verification at load and discharge",
      "Hold cleanliness and stowage planning for food-grade dry bulk",
    ],
    advantages: [
      "Lowest unit cost for very large dry bulk volumes",
      "Suited to major producing origins with bulk loading terminals",
      "Established inspection, sampling and loading supervision at load port",
    ],
    commodities: ["ICUMSA sugar (bulk)", "Wheat", "Corn", "Rice", "Soybeans", "Other dry bulk"],
    images: [
      {
        src: "/images/packaging/bulk-vessel-hold.png",
        alt: "Dry bulk carrier with open cargo holds loading unpackaged commodity",
      },
      {
        src: "/images/packaging/bulk-vessel-loading.png",
        alt: "Bulk vessel being loaded from shore silos via conveyor at port",
      },
    ],
    note: "Hold cleanliness, fumigation, moisture and draft survey methods are defined in the sales contract.",
  },
  {
    order: 6,
    slug: "bulk-railcar",
    name: "Bulk railcar",
    mode: "dry",
    category: "transport",
    summary: "High-capacity rail transport for dry bulk commodities.",
    description:
      "Bulk hopper railcars move large volumes of dry commodities by rail between inland production areas, elevators and port terminals. This mode is common in corridors where rail infrastructure connects agricultural regions to export loading facilities.",
    applications: [
      "Mill-to-port or elevator-to-terminal dry bulk movements",
      "Staged accumulation before vessel loading",
      "Inland corridors with established bulk rail networks",
    ],
    advantages: [
      "High-capacity unit trains for efficient inland logistics",
      "Gravity discharge into silos and ship-loading systems",
      "Cost-effective over long inland distances versus road only",
    ],
    commodities: ["Grains", "Oilseeds", "Sugar (bulk where rail programme exists)", "Pulses"],
    images: [
      {
        src: "/images/packaging/bulk-railcar.png",
        alt: "BNSF freight train with covered hopper railcars at a grain elevator facility",
      },
    ],
    note: "Rail routing, car type, demurrage and destination unloading capability must be confirmed per corridor.",
  },
  {
    order: 7,
    slug: "iso-tank-containers-2",
    name: "ISO tank containers (2)",
    mode: "liquid",
    category: "product",
    summary: "Dedicated intermodal tank for food-grade and suitable liquid cargoes.",
    description:
      "ISO tank containers are stainless or lined cylindrical tanks mounted in a standard container frame for intermodal transport by vessel, truck and rail. They suit edible oils and other liquids where a dedicated, reusable tank compartment is preferred over flexitank programmes.",
    applications: [
      "Edible oils and refined vegetable oils",
      "Food-grade liquids on established container corridors",
      "Programmes requiring dedicated tank equipment rather than single-use bladders",
    ],
    advantages: [
      "Intermodal transfer by ship, truck and rail without transloading",
      "Dedicated tank reduces cross-contamination versus multi-cargo dry containers",
      "Reusable asset subject to cleaning, inspection and prior-cargo approval",
    ],
    commodities: ["Sunflower oil", "Soybean oil", "Palm oil", "Rapeseed oil", "Other suitable liquids"],
    images: [
      {
        src: "/images/packaging/iso-tank-2.png",
        alt: "White ISO tank container with orange stripe in a standard container frame",
      },
    ],
    note: "Tank condition, heating, prior-cargo history and terminal acceptance must be confirmed before booking.",
  },
  {
    order: 8,
    slug: "ibc-containers-2",
    name: "IBC containers (2)",
    mode: "liquid",
    category: "product",
    summary: "Intermediate bulk container for liquids and flowable products.",
    description:
      "IBC (intermediate bulk container) totes combine a plastic inner bottle with a protective metal cage and pallet base — typically around 1,000 litres. They suit medium-volume liquid programmes, blending, and distribution to industrial buyers.",
    applications: [
      "Edible oils and liquid food ingredients",
      "Smaller liquid lots for regional distributors",
      "Multi-drop delivery where drum quantities are too small",
    ],
    advantages: [
      "Standard pallet footprint for warehouse and forklift handling",
      "Lower handling cost than drums for medium volumes",
      "Single-trip or returnable programmes depending on corridor",
    ],
    commodities: ["Edible oils", "Liquid food ingredients", "Non-hazardous industrial liquids where agreed"],
    images: [
      {
        src: "/images/packaging/ibc-2.png",
        alt: "White IBC tote with metal cage in an industrial warehouse",
      },
    ],
  },
  {
    order: 9,
    slug: "ibc-containers-1",
    name: "IBC containers (1)",
    mode: "liquid",
    category: "product",
    summary: "Schütz-style IBC for efficient liquid bulk handling.",
    description:
      "Reusable IBC totes on integrated pallet bases allow efficient stacking, storage and discharge of liquid commodities. Valve and cap specifications vary by product and food-grade requirements.",
    applications: [
      "Refined oils and oleochemical distribution",
      "Industrial food manufacturing supply",
      "Containerised or domestic truck programmes",
    ],
    advantages: [
      "Compact 1,000-litre unit for inventory control",
      "Discharge valve for controlled pumping or gravity flow",
      "Widely accepted in warehouses and customs corridors",
    ],
    commodities: ["Edible oils", "Syrups and liquid food products", "Suitable non-hazardous liquids"],
    images: [
      {
        src: "/images/packaging/ibc-1.png",
        alt: "IBC container on pallet with discharge valve and protective cage",
      },
    ],
  },
  {
    order: 10,
    slug: "drums",
    name: "Drums",
    mode: "liquid",
    category: "product",
    summary: "Steel or HDPE drums for smaller liquid lots.",
    description:
      "Drum programmes — typically 200-litre steel or HDPE drums — suit sample shipments, industrial buyers and destinations where smaller unit sizes are required for warehousing or redistribution.",
    applications: [
      "Industrial and food-service oil distribution",
      "Sample and trial programmes before bulk contracts",
      "Markets preferring drum handling over IBC or flexitank",
    ],
    advantages: [
      "Familiar unit for customs, warehouse and retail redistribution",
      "Flexible order sizes for smaller buyers",
      "Steel or plastic options per product and regulatory requirements",
    ],
    commodities: ["Edible oils", "Specialty liquids", "Food-grade industrial products"],
    images: [
      {
        src: "/images/packaging/drums.png",
        alt: "Stacked yellow metal drums on pallets in a warehouse",
      },
    ],
  },
  {
    order: 11,
    slug: "palletized-bags",
    name: "Palletized bags",
    mode: "dry",
    category: "product",
    summary: "Bagged cargo unitized on pallets for handling and container loading.",
    description:
      "Palletized bag programmes stack sacks or bags on standard pallets for forklift handling, warehouse storage and efficient container stowage. Common for sugar, rice, pulses and similar dry commodities.",
    applications: [
      "Sugar and rice export in bagged form",
      "Warehouse and distribution centre delivery",
      "Container stuffing with defined pallet counts",
    ],
    advantages: [
      "Efficient handling with standard forklifts and pallet jacks",
      "Defined unit loads for inventory and insurance",
      "Easier partial discharge than loose bag stuffing",
    ],
    commodities: ["ICUMSA sugar (bagged)", "Rice", "Pulses", "Grains"],
    images: [
      {
        src: "/images/packaging/palletized-bags.png",
        alt: "Palletized commodity bags stacked in a warehouse",
      },
    ],
  },
  {
    order: 12,
    slug: "fibc-jumbo-bags",
    name: "FIBC / jumbo bags",
    mode: "dry",
    category: "product",
    summary: "Flexible intermediate bulk containers for 500–2,000 kg dry units.",
    description:
      "FIBCs (flexible intermediate bulk containers), also called jumbo bags or big bags, hold 500–2,000 kg of dry flowable commodities. They are widely used for sugar, grains, rice and pulses on container and warehouse programmes.",
    applications: [
      "Bulk sugar, rice and grain in 1-tonne units",
      "Container loading with sling or forklift handling",
      "Mill-to-warehouse dry bulk distribution",
    ],
    advantages: [
      "Efficient dry bulk handling without full vessel minimums",
      "Stackable and storable in warehouses when properly supported",
      "Single-use or returnable programmes depending on corridor",
    ],
    commodities: ["Sugar", "Rice", "Grains", "Pulses", "Other dry flowable products"],
    images: [
      {
        src: "/images/packaging/fibc-jumbo-bags.png",
        alt: "Single FIBC jumbo bag filled with granular dry commodity",
      },
      {
        src: "/images/packaging/fibc-jumbo-bags-2.png",
        alt: "Warehouse stacked with white FIBC jumbo bags",
      },
    ],
  },
  {
    order: 13,
    slug: "bulk-liner",
    name: "Bulk liner",
    mode: "dry",
    category: "product",
    summary: "Container liner for free-flowing dry bulk in standard containers.",
    description:
      "A bulk liner is a heavy-duty flexible bag installed inside a shipping container, converting it into a dry bulk compartment for granular or powdered commodities. Discharge uses a spout, valve or pneumatic system at destination.",
    applications: [
      "Granular sugar, grains and similar free-flowing dry bulk",
      "Container routes where dedicated bulk vessels are not economical",
      "Programmes requiring contamination barrier versus bare container walls",
    ],
    advantages: [
      "Uses standard container equipment without vessel charter",
      "Liner protects cargo from container residue and moisture",
      "Suitable for medium-volume dry bulk on liner services",
    ],
    commodities: ["Sugar", "Grains", "Plastic pellets", "Other free-flowing dry bulk"],
    images: [
      {
        src: "/images/packaging/bulk-liner.png",
        alt: "Shipping container with bulk liner bag and discharge equipment",
      },
    ],
    note: "Container reinforcement, loading method and discharge equipment must be agreed before shipment.",
  },
  {
    order: 14,
    slug: "iso-tank-containers-1",
    name: "ISO tank containers (1)",
    mode: "liquid",
    category: "product",
    summary: "Standard ISO tank frame for intermodal liquid programmes.",
    description:
      "ISO tank containers in standard frames allow liquid commodities to move seamlessly between vessel, truck and rail. Capacity, pressure rating and lining are matched to the product and regulatory requirements.",
    applications: [
      "International edible oil container programmes",
      "Chemical-grade or food-grade liquids where tank dedication is required",
      "Corridors with ISO tank depot and cleaning facilities",
    ],
    advantages: [
      "Full intermodal compatibility with global container networks",
      "Documented cleaning and inspection history for food-grade cargoes",
      "Efficient versus drums for medium-to-large liquid volumes",
    ],
    commodities: ["Edible oils", "Food-grade liquids", "Suitable industrial liquids"],
    images: [
      {
        src: "/images/packaging/iso-tank-1.png",
        alt: "ISO tank container with blue frame and white cylindrical tank",
      },
    ],
  },
  {
    order: 15,
    slug: "kraft-paper-bags",
    name: "Kraft paper bags",
    mode: "dry",
    category: "product",
    summary: "Multi-wall kraft paper sacks for bagged dry commodities.",
    description:
      "Kraft paper bags — often multi-wall construction — are a traditional packaging format for rice, flour, sugar and similar goods. They are palletized for warehouse storage and container or truck loading.",
    applications: [
      "Rice and grain export in paper sacks",
      "Food manufacturing supply in defined bag sizes",
      "Markets specifying paper rather than woven PP",
    ],
    advantages: [
      "Breathable paper construction for certain agricultural products",
      "Familiar format for retail and industrial redistribution",
      "Palletized for efficient handling and stowage",
    ],
    commodities: ["Rice", "Flour", "Sugar", "Pulses"],
    images: [
      {
        src: "/images/packaging/kraft-paper-bags.png",
        alt: "Stacks of brown kraft paper bags on wooden pallets in a warehouse",
      },
    ],
  },
  {
    order: 16,
    slug: "laminated-pp-bags",
    name: "Laminated PP bags",
    mode: "dry",
    category: "product",
    summary: "Laminated polypropylene bags with printed branding.",
    description:
      "Laminated PP bags combine woven polypropylene with a laminated outer layer for moisture protection and high-quality printing. Common for rice, grains and branded export programmes in 25 kg and 50 kg sizes.",
    applications: [
      "Branded rice and grain export",
      "Retail-ready sack programmes with printed labels",
      "Moisture-sensitive dry commodities",
    ],
    advantages: [
      "Strong moisture barrier versus plain woven sacks",
      "High-quality print for brand and regulatory information",
      "Durable handling through port and warehouse chains",
    ],
    commodities: ["Rice", "Grains", "Sugar", "Pulses"],
    images: [
      {
        src: "/images/packaging/laminated-pp-bags.png",
        alt: "Assorted laminated polypropylene commodity bags in multiple sizes",
      },
    ],
  },
  {
    order: 17,
    slug: "bags-50kg",
    name: "50 kg bags",
    mode: "dry",
    category: "product",
    summary: "Standard 50 kg woven or laminated sacks.",
    description:
      "Fifty-kilogram bags are a common commercial unit for rice, sugar, grains and pulses in international trade. Net weight, stitching, liner and marking are defined in the contract and packing list.",
    applications: [
      "Rice export to African and Middle Eastern markets",
      "Industrial sugar and grain redistribution",
      "Container and break-bulk bagged programmes",
    ],
    advantages: [
      "Widely accepted commercial unit in many import markets",
      "Manageable manual handling at destination",
      "Clear weight declaration for customs and inventory",
    ],
    commodities: ["Rice", "Sugar", "Grains", "Pulses"],
    images: [
      {
        src: "/images/packaging/bags-50kg.png",
        alt: "Stacked white woven bags marked 50 kg net weight",
      },
    ],
    note: "Actual net weight, bag construction and marking must match the sales contract and packing list.",
  },
  {
    order: 18,
    slug: "pp-woven-bags",
    name: "PP woven bags",
    mode: "dry",
    category: "product",
    summary: "Plain or printed woven polypropylene sacks.",
    description:
      "PP woven bags are durable, cost-effective sacks for dry commodities. They may be plain white or printed with product, weight and origin information. Liner bags can be added for moisture-sensitive cargoes.",
    applications: [
      "Sugar, rice and grain in standard export sacks",
      "Food manufacturing and wholesale supply",
      "Container stuffing with defined bag counts",
    ],
    advantages: [
      "High strength-to-weight ratio for stacking and handling",
      "Breathable or lined options per product requirements",
      "Widely produced and accepted globally",
    ],
    commodities: ["Sugar", "Rice", "Grains", "Pulses", "Animal feed"],
    images: [
      {
        src: "/images/packaging/pp-woven-bags.png",
        alt: "White woven polypropylene bags filled with grain",
      },
    ],
  },
  {
    order: 19,
    slug: "bags-25kg",
    name: "25 kg bags",
    mode: "dry",
    category: "product",
    summary: "Standard 25 kg sacks for retail and food-service channels.",
    description:
      "Twenty-five-kilogram bags are commonly used where smaller unit sizes are preferred for retail redistribution, food-service supply or markets specifying 25 kg as the standard trade unit.",
    applications: [
      "Sugar and rice for retail and food-service markets",
      "Smaller-lot export programmes",
      "Palletized container loads with higher bag counts",
    ],
    advantages: [
      "Preferred unit size in several import markets",
      "Easier manual handling than 50 kg sacks",
      "Efficient palletization for container programmes",
    ],
    commodities: ["ICUMSA sugar", "Rice", "Flour", "Pulses"],
    images: [
      {
        src: "/images/packaging/bags-25kg.png",
        alt: "White 25 kg bags stacked on a wooden shipping pallet",
      },
    ],
    note: "Bag weight, stitching and pallet configuration are confirmed in the contract specification.",
  },
];

export const PACKAGING_SELECTION = {
  title: "Choosing the right packaging mode",
  lead: "The appropriate mode depends on commodity type, volume, origin infrastructure, destination handling capability, Incoterms and contract requirements. Finekarts helps align packaging with inspection, documentation and shipping programmes.",
  factors: [
    "Commodity and grade (liquid vs dry, food-grade vs industrial)",
    "Parcel size and minimum commercial quantities",
    "Origin loading facilities (silo, bagging line, tank farm, container yard)",
    "Destination discharge equipment and storage",
    "Banking and documentary presentation requirements",
  ],
};

export const PACKAGING_CTA = {
  title: "Specify packaging in your enquiry",
  lead: "Signed-in buyers can select packaging per line item in purchase requests. Include quantity, origin, destination and preferred mode so our trade desk can confirm feasibility.",
  tagline: "Matched to product · Matched to corridor · Matched to contract",
};
