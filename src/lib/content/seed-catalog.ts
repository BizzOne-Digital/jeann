export type SeedProduct = {
  slug: string;
  name: string;
  overview: string;
  availabilityText: string;
  originOptions: string[];
  gradeSummary: string;
  packaging: string[];
  inspectionOptions: string[];
  incotermOptions: string[];
  documentCategories: string[];
  minOrderText: string;
  status: "draft" | "pending_verification" | "published";
  image?: string;
};

export type SeedCategory = {
  slug: string;
  name: string;
  summary: string;
  products: SeedProduct[];
};

const draftNote =
  "Example content — requires Finekarts admin verification before treating as confirmed trade specifications.";

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "edible-oils",
    name: "Edible oils — crude and refined",
    summary:
      "Bulk edible oils for refiners, distributors, and industrial buyers. Specifications and packaging confirmed per enquiry.",
    products: [
      {
        slug: "sunflower-oil",
        name: "Sunflower oil",
        overview:
          "Crude or refined sunflower oil sourced for qualified buyers. Grades and refining level confirmed against enquiry requirements.",
        availabilityText: "Availability confirmed per enquiry and supplier allocation.",
        originOptions: ["Origin options confirmed per contract (example field)"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "IBC totes", "Drums/barrels", "ISO tank containers"],
        inspectionOptions: ["Inspection options configurable (e.g. SGS, Veritas) when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Packing List", "Certificate of Analysis", "Certificate of Origin"],
        minOrderText: "Minimum order volumes vary by origin, packaging, and vessel/container programme.",
        status: "pending_verification",
      },
      {
        slug: "soybean-oil",
        name: "Soybean oil",
        overview: "Soybean oil offered in crude or refined forms subject to supplier programme and buyer specifications.",
        availabilityText: "Subject to seasonal and logistical confirmation.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "ISO tank containers", "Drums/barrels"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis", "Bill of Lading"],
        minOrderText: "Discuss container or bulk programmes with the trade desk.",
        status: "pending_verification",
      },
      {
        slug: "palm-oil",
        name: "Palm oil",
        overview: "Palm oil programmes for qualified industrial and refining buyers. Sustainability and specification claims only when admin-verified.",
        availabilityText: "Confirmed case by case.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "ISO tank containers"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis", "Certificate of Origin"],
        minOrderText: "Volume thresholds depend on route and packaging.",
        status: "pending_verification",
      },
      {
        slug: "rapeseed-oil",
        name: "Rapeseed oil",
        overview: "Rapeseed oil for food and industrial channels. Buyer-focused overview pending admin verification of grades and origins.",
        availabilityText: "Enquiry-based availability.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "IBC totes", "Drums/barrels"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis"],
        minOrderText: "Minimums confirmed during RFQ review.",
        status: "pending_verification",
        image: "/images/products/rapeseed-oil-reference.png",
      },
      {
        slug: "canola-oil",
        name: "Canola oil",
        overview: "Canola oil offerings for distributors and processors. Specs, packaging, and Incoterms negotiated per transaction.",
        availabilityText: "Subject to supplier confirmation.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "IBC totes", "ISO tank containers"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis", "Packing List"],
        minOrderText: "Container and bulk programmes available subject to agreement.",
        status: "pending_verification",
        image: "/images/products/rapeseed-oil-reference.png",
      },
      {
        slug: "corn-oil",
        name: "Corn oil",
        overview: "Corn oil for food manufacturing and distribution channels. Details confirmed after RFQ review.",
        availabilityText: "Enquiry-based.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "Drums/barrels"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis"],
        minOrderText: "Discuss with trade desk.",
        status: "pending_verification",
      },
      {
        slug: "olive-oil",
        name: "Olive oil",
        overview: "Olive oil programmes for qualified buyers. Grades and origins only stated when admin-approved.",
        availabilityText: "Subject to harvest and allocation.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Drums/barrels", "IBC totes", "Flexitanks"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Origin", "Certificate of Analysis"],
        minOrderText: "Volume programmes vary by grade.",
        status: "pending_verification",
      },
      {
        slug: "vegetable-oil",
        name: "Vegetable oil",
        overview: "Blended or specified vegetable oil offerings subject to buyer requirements and supplier capability.",
        availabilityText: "Confirmed per enquiry.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Flexitanks", "IBC totes", "Drums/barrels"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Analysis"],
        minOrderText: "Minimums depend on blend and packaging.",
        status: "pending_verification",
      },
    ],
  },
  {
    slug: "sugar",
    name: "Sugar",
    summary: "Refined and other sugar grades commonly requested in international trade. ICUMSA targets discussed per RFQ.",
    products: [
      ["icumsa-45", "ICUMSA 45"],
      ["icumsa-100", "ICUMSA 100"],
      ["icumsa-150", "ICUMSA 150"],
      ["icumsa-600", "ICUMSA 600"],
      ["icumsa-1200", "ICUMSA 1200"],
    ].map(([slug, name]) => ({
      slug,
      name,
      overview: `${name} sugar enquiries for qualified buyers. Exact polarity, moisture, and packing confirmed contractually.`,
      availabilityText: "Subject to crop, refining, and logistics confirmation.",
      originOptions: ["Confirmed per enquiry"],
      gradeSummary: draftNote,
      packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
      inspectionOptions: ["Configurable when verified"],
      incotermOptions: ["FOB", "CIF"],
      documentCategories: ["Commercial Invoice", "Certificate of Weight and Quantity", "Certificate of Analysis", "Bill of Lading"],
      minOrderText: "Typically discussed in container or bulk vessel lots.",
      status: "pending_verification" as const,
    })),
  },
  {
    slug: "beans-and-pulses",
    name: "Beans and pulses",
    summary: "Beans and pulses for wholesalers, distributors, and food manufacturers. Grades and calibrations confirmed per enquiry.",
    products: [
      "Kidney beans",
      "White beans",
      "Red beans",
      "Black beans",
      "Yellow beans",
      "Pinto beans",
      "Soybeans",
      "Chickpeas",
    ].map((name) => ({
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      overview: `${name} offered to qualified buyers. Calibration, moisture, and packing confirmed during RFQ review.`,
      availabilityText: "Seasonal and origin-dependent.",
      originOptions: ["Confirmed per enquiry"],
      gradeSummary: draftNote,
      packaging: ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
      inspectionOptions: ["Configurable when verified"],
      incotermOptions: ["FOB", "CIF"],
      documentCategories: ["Commercial Invoice", "Packing List", "Phytosanitary certificate", "Certificate of Origin"],
      minOrderText: "Container programmes common; bulk discussed where applicable.",
      status: "pending_verification" as const,
    })),
  },
  {
    slug: "rice-and-grains",
    name: "Rice and grains",
    summary: "Rice programmes for importers and distributors. Additional grain entries can be added through the CMS.",
    products: [
      ["basmati-rice", "Basmati rice"],
      ["parboiled-rice", "Parboiled rice"],
      ["jasmine-rice", "Jasmine rice"],
    ].map(([slug, name]) => ({
      slug,
      name,
      overview: `${name} for qualified international buyers. Broken percentage, moisture, and packing confirmed per specification.`,
      availabilityText: "Crop and mill confirmation required.",
      originOptions: ["Confirmed per enquiry"],
      gradeSummary: draftNote,
      packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners"],
      inspectionOptions: ["Configurable when verified"],
      incotermOptions: ["FOB", "CIF"],
      documentCategories: ["Commercial Invoice", "Phytosanitary certificate", "Certificate of Origin", "Packing List"],
      minOrderText: "Typically container-based; larger lots by agreement.",
      status: "pending_verification" as const,
    })),
  },
  {
    slug: "other-commodities",
    name: "Other commodities",
    summary: "Extensible category for coffee, nuts, spices, and future commodities managed in the CMS.",
    products: [
      {
        slug: "coffee-beans",
        name: "Coffee beans",
        overview: "Green coffee bean enquiries for qualified buyers. Origin and grade claims only when verified.",
        availabilityText: "Crop-dependent.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Multi-wall sacks", "FIBCs/jumbo bags"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Origin", "Phytosanitary certificate"],
        minOrderText: "Discuss lot size with the trade desk.",
        status: "pending_verification",
      },
      {
        slug: "cashews-and-nuts",
        name: "Cashews and other nuts",
        overview: "Cashews and selected nuts for distributors. Specs and food-safety documents confirmed per contract.",
        availabilityText: "Subject to supplier allocation.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Cartons", "Multi-wall sacks", "FIBCs/jumbo bags"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Health/Veterinary certificate", "Certificate of Origin"],
        minOrderText: "Minimums vary by nut type and grade.",
        status: "pending_verification",
      },
      {
        slug: "cinnamon",
        name: "Cinnamon",
        overview: "Cinnamon offerings for qualified spice buyers. Form and grade confirmed during RFQ review.",
        availabilityText: "Enquiry-based.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: draftNote,
        packaging: ["Multi-wall sacks", "Cartons"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Certificate of Origin", "Phytosanitary certificate"],
        minOrderText: "Discuss with trade desk.",
        status: "pending_verification",
      },
    ],
  },
];

export const SEED_PACKAGING = [
  {
    slug: "fibc-jumbo-bags",
    name: "FIBCs / jumbo bags",
    mode: "dry" as const,
    description: "Flexible intermediate bulk containers for many dry commodities. Compatibility depends on product and route.",
  },
  {
    slug: "container-liners",
    name: "Container liners",
    mode: "dry" as const,
    description: "Liners for dry bulk in standard containers where suitable.",
  },
  {
    slug: "multi-wall-sacks",
    name: "Multi-wall sacks",
    mode: "dry" as const,
    description: "Bagged packaging common for rice, pulses, sugar, and similar goods.",
  },
  {
    slug: "flexitanks",
    name: "Flexitanks",
    mode: "liquid" as const,
    description: "Non-hazardous liquid bulk in containers, subject to product suitability.",
  },
  {
    slug: "ibc-totes",
    name: "IBC totes",
    mode: "liquid" as const,
    description: "Intermediate bulk containers for liquid products where agreed.",
  },
  {
    slug: "drums-barrels",
    name: "Drums / barrels",
    mode: "liquid" as const,
    description: "Drum programmes for smaller liquid lots or specific handling needs.",
  },
  {
    slug: "iso-tank-containers",
    name: "ISO tank containers",
    mode: "liquid" as const,
    description: "Tank containers for suitable liquid commodities and routes.",
  },
  {
    slug: "dry-bulk-vessel",
    name: "Dry-bulk vessel holds",
    mode: "unpackaged" as const,
    description: "Unpackaged dry bulk where vessel programmes apply. Not available for every product.",
  },
  {
    slug: "product-chemical-tankers",
    name: "Product / chemical tankers",
    mode: "unpackaged" as const,
    description: "Tanker programmes where product chemistry and route permit. Subject to agreement.",
  },
];

export const SITE = {
  name: "Finekarts Incorporated",
  headline: "Global Agricultural Commodity Trading",
  email: "Info@finekarts.com",
  phone: "4169858772",
  phoneDisplay: "+1 (416) 985-8772",
  addressLine1: "4275 Village Center Court",
  addressLine2: "Mississauga, Ontario L4Z 1V3, Canada",
  positioning:
    "An extension of manufacturers and suppliers — sourcing quality agricultural commodities globally and delivering to qualified buyers worldwide.",
};
