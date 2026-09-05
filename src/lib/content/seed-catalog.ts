import { getOilProductDetail, getOilProductMarketing } from "@/lib/content/oil-product-content";
import { getPulseProductDetail, getPulseProductMarketing } from "@/lib/content/pulse-product-content";
import { getRiceProductDetail, getRiceProductMarketing } from "@/lib/content/rice-product-content";
import { getCoffeeProductDetail, getCoffeeProductMarketing } from "@/lib/content/coffee-product-content";
import { getSpiceProductDetail, getSpiceProductMarketing } from "@/lib/content/spice-product-content";
import { getSugarGradeDetail, getSugarProductMarketing } from "@/lib/content/sugar-product-content";
import { PACKAGING_TYPES } from "@/lib/content/packaging-content";

export type SeedProduct = {
  slug: string;
  name: string;
  overview: string;
  description?: string;
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
  youtubeVideoId?: string;
  highlights?: string[];
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
      "sunflower-oil",
      "soybean-oil",
      "palm-oil",
      "rapeseed-oil",
      "canola-oil",
      "corn-oil",
      "coconut-oil",
      "olive-oil",
      "vegetable-oil",
    ].map((slug) => {
      const oil = getOilProductDetail(slug);
      const marketing = getOilProductMarketing(slug);
      const names: Record<string, string> = {
        "sunflower-oil": "Sunflower oil",
        "soybean-oil": "Soybean oil",
        "palm-oil": "Palm oil",
        "rapeseed-oil": "Rapeseed oil",
        "canola-oil": "Canola oil",
        "corn-oil": "Corn oil",
        "coconut-oil": "Coconut oil",
        "olive-oil": "Olive oil",
        "vegetable-oil": "Vegetable oil",
      };
      const defaultOverviews: Record<string, string> = {
        "sunflower-oil":
          "Crude or refined sunflower oil sourced for qualified buyers. Grades and refining level confirmed against enquiry requirements.",
        "soybean-oil":
          "Soybean oil offered in crude or refined forms subject to supplier programme and buyer specifications.",
        "palm-oil":
          "Palm oil programmes for qualified industrial and refining buyers. Sustainability and specification claims only when admin-verified.",
        "rapeseed-oil":
          "Rapeseed oil for food and industrial channels. Buyer-focused overview pending admin verification of grades and origins.",
        "canola-oil":
          "Canola oil offerings for distributors and processors. Specs, packaging, and Incoterms negotiated per transaction.",
        "corn-oil":
          "Corn oil for food manufacturing and distribution channels. Details confirmed after RFQ review.",
        "coconut-oil":
          "Coconut oil programmes for food, cosmetic and industrial buyers. Refined and crude grades confirmed per enquiry.",
        "olive-oil":
          "Olive oil programmes for qualified buyers. Grades and origins only stated when admin-approved.",
        "vegetable-oil":
          "Blended or specified vegetable oil offerings subject to buyer requirements and supplier capability.",
      };
      const defaultPackaging: Record<string, string[]> = {
        "sunflower-oil": ["Flexitanks", "IBC totes", "Drums/barrels", "ISO tank containers"],
        "soybean-oil": ["Flexitanks", "ISO tank containers", "Drums/barrels"],
        "palm-oil": ["Flexitanks", "ISO tank containers"],
        "rapeseed-oil": ["Flexitanks", "IBC totes", "Drums/barrels"],
        "canola-oil": ["Flexitanks", "IBC totes", "ISO tank containers"],
        "corn-oil": ["Flexitanks", "Drums/barrels"],
        "coconut-oil": ["Flexitanks", "Drums/barrels", "IBC totes"],
        "olive-oil": ["Drums/barrels", "IBC totes", "Flexitanks"],
        "vegetable-oil": ["Flexitanks", "IBC totes", "Drums/barrels"],
      };
      const defaultMinOrder: Record<string, string> = {
        "sunflower-oil": "Minimum order volumes vary by origin, packaging, and vessel/container programme.",
        "soybean-oil": "Discuss container or bulk programmes with the trade desk.",
        "palm-oil": "Volume thresholds depend on route and packaging.",
        "rapeseed-oil": "Minimums confirmed during RFQ review.",
        "canola-oil": "Container and bulk programmes available subject to agreement.",
        "corn-oil": "Discuss with trade desk.",
        "coconut-oil": "Discuss container or bulk programmes with the trade desk.",
        "olive-oil": "Volume programmes vary by grade.",
        "vegetable-oil": "Minimums depend on blend and packaging.",
      };
      const name = names[slug] ?? slug;
      return {
        slug,
        name,
        overview: oil
          ? `${oil.grade} — ${oil.subtitle}. ${oil.description.slice(0, 120)}…`
          : defaultOverviews[slug] ?? `${name} enquiries for qualified buyers.`,
        description: marketing?.description,
        availabilityText:
          slug === "olive-oil"
            ? "Subject to harvest and allocation."
            : slug === "soybean-oil"
              ? "Subject to seasonal and logistical confirmation."
              : slug === "palm-oil" || slug === "canola-oil"
                ? "Subject to supplier confirmation."
                : slug === "rapeseed-oil" || slug === "corn-oil" || slug === "vegetable-oil"
                  ? "Enquiry-based availability."
                  : "Availability confirmed per enquiry and supplier allocation.",
        originOptions:
          slug === "sunflower-oil"
            ? ["Origin options confirmed per contract (example field)"]
            : ["Confirmed per enquiry"],
        gradeSummary: oil
          ? `${oil.grade} — ${oil.subtitle}. ${draftNote}`
          : draftNote,
        packaging: oil?.packaging ?? defaultPackaging[slug] ?? ["Flexitanks", "Drums/barrels"],
        inspectionOptions:
          slug === "sunflower-oil"
            ? ["Inspection options configurable (e.g. SGS, Veritas) when verified"]
            : ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories:
          slug === "soybean-oil"
            ? ["Commercial Invoice", "Certificate of Analysis", "Bill of Lading"]
            : slug === "palm-oil" || slug === "olive-oil"
              ? ["Commercial Invoice", "Certificate of Analysis", "Certificate of Origin"]
              : slug === "canola-oil"
                ? ["Commercial Invoice", "Certificate of Analysis", "Packing List"]
                : ["Commercial Invoice", "Certificate of Analysis"],
        minOrderText: defaultMinOrder[slug] ?? "Discuss with trade desk.",
        status: "pending_verification" as const,
        image: oil?.heroImage,
        highlights: marketing?.highlights,
      };
    }),
  },
  {
    slug: "sugar",
    name: "Sugar",
    summary:
      "Refined and other sugar grades for international food, beverage, manufacturing and distribution markets. ICUMSA 45, 100, 150, 600 and 1200 — specifications confirmed per contract.",
    products: [
      ["icumsa-45", "ICUMSA 45"],
      ["icumsa-100", "ICUMSA 100"],
      ["icumsa-150", "ICUMSA 150"],
      ["icumsa-600", "ICUMSA 600"],
      ["icumsa-1200", "ICUMSA 1200"],
    ].map(([slug, name]) => {
      const marketing = getSugarProductMarketing(slug);
      const grade = getSugarGradeDetail(slug);
      return {
        slug,
        name,
        overview: grade
          ? `${grade.code} — ${grade.subtitle}. ${grade.description.slice(0, 120)}…`
          : `${name} sugar enquiries for qualified buyers. Exact polarity, moisture, and packing confirmed contractually.`,
        description: marketing?.description,
        availabilityText: "Subject to crop, refining, and logistics confirmation.",
        originOptions: ["Brazil", "India", "Thailand", "Central America — confirmed per contract"],
        gradeSummary: grade
          ? `${grade.code} — ${grade.subtitle}. Colour, polarization, moisture and ash per agreed specification and Certificate of Analysis. ${draftNote}`
          : draftNote,
        packaging: grade?.packaging ?? [
          "FIBCs/jumbo bags",
          "Multi-wall sacks",
          "Container liners",
          "Bulk vessel holds",
        ],
        inspectionOptions: [
          "SGS / Intertek / Bureau Veritas at load or discharge",
          "Certificate of weight and quantity",
          "Certificate of analysis (ICUMSA colour, polarization, moisture)",
        ],
        incotermOptions: ["FOB", "CIF", "CFR"],
        documentCategories: [
          "Commercial Invoice",
          "Certificate of Weight and Quantity",
          "Certificate of Analysis",
          "Bill of Lading",
          "Certificate of Origin",
          "Phytosanitary certificate (where required)",
        ],
        minOrderText: "Typically discussed in container or bulk vessel lots (e.g. 12,500 MT parcels).",
        status: "pending_verification" as const,
        image: grade?.heroImage,
        youtubeVideoId: marketing?.youtubeVideoId,
        highlights: marketing?.highlights,
      };
    }),
  },
  {
    slug: "beans-and-pulses",
    name: "Beans",
    summary: "Dry beans for wholesalers, distributors, and food manufacturers. Grades and calibrations confirmed per enquiry.",
    products: [
      "Kidney beans",
      "White beans",
      "Yellow beans",
      "Red beans",
      "Black beans",
      "Pinto beans",
      "Soybeans",
    ].map((name) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      const pulse = getPulseProductDetail(slug);
      const marketing = getPulseProductMarketing(slug);
      return {
        slug,
        name,
        overview: pulse
          ? `${pulse.grade} — ${pulse.subtitle}. ${pulse.description.slice(0, 120)}…`
          : `${name} offered to qualified buyers. Calibration, moisture, and packing confirmed during RFQ review.`,
        description: marketing?.description,
        availabilityText: "Seasonal and origin-dependent.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: pulse ? `${pulse.grade} — ${pulse.subtitle}. ${draftNote}` : draftNote,
        packaging: pulse?.packaging ?? ["FIBCs/jumbo bags", "Multi-wall sacks", "Container liners"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Packing List", "Phytosanitary certificate", "Certificate of Origin"],
        minOrderText: "Container programmes common; bulk discussed where applicable.",
        status: "pending_verification" as const,
        image: pulse?.heroImage,
        highlights: marketing?.highlights,
      };
    }),
  },
  {
    slug: "rice-and-grains",
    name: "Rice and grains",
    summary: "Rice programmes for importers and distributors. Additional grain entries can be added through the CMS.",
    products: [
      ["basmati-rice", "Basmati rice"],
      ["parboiled-rice", "Parboiled rice"],
      ["jasmine-rice", "Jasmine rice"],
    ].map(([slug, name]) => {
      const rice = getRiceProductDetail(slug);
      const marketing = getRiceProductMarketing(slug);
      return {
        slug,
        name,
        overview: rice
          ? `${rice.grade} — ${rice.subtitle}. ${rice.description.slice(0, 120)}…`
          : `${name} for qualified international buyers. Broken percentage, moisture, and packing confirmed per specification.`,
        description: marketing?.description,
        availabilityText: "Crop and mill confirmation required.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: rice ? `${rice.grade} — ${rice.subtitle}. ${draftNote}` : draftNote,
        packaging: rice?.packaging ?? ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: ["Commercial Invoice", "Phytosanitary certificate", "Certificate of Origin", "Packing List"],
        minOrderText: "Typically container-based; larger lots by agreement.",
        status: "pending_verification" as const,
        image: rice?.heroImage,
        highlights: marketing?.highlights,
      };
    }),
  },
  {
    slug: "coffee",
    name: "Coffee",
    summary:
      "Green coffee, dry Arabica beans, and roasted Arabica coffee for qualified roasters, traders, and distributors — origins and grades confirmed per enquiry.",
    products: [
      ["green-coffee-beans", "Green coffee beans"],
      ["dry-coffee-beans", "Dry coffee beans"],
      ["roasted-arabica-coffee-beans", "Roasted Arabica coffee beans"],
    ].map(([slug, name]) => {
      const coffee = getCoffeeProductDetail(slug);
      const marketing = getCoffeeProductMarketing(slug);
      return {
        slug,
        name,
        overview: coffee
          ? `${coffee.grade} — ${coffee.subtitle}. ${coffee.description.slice(0, 120)}…`
          : `${name} enquiries for qualified buyers. Specifications confirmed per RFQ review.`,
        description: marketing?.description,
        availabilityText: "Crop-dependent.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: coffee ? `${coffee.grade} — ${coffee.subtitle}. ${draftNote}` : draftNote,
        packaging: coffee?.packaging ?? ["Multi-wall sacks", "FIBCs/jumbo bags"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: [
          "Commercial Invoice",
          "Certificate of Origin",
          "Phytosanitary certificate",
        ],
        minOrderText: "Discuss lot size with the trade desk.",
        status: "pending_verification" as const,
        image: coffee?.heroImage,
        highlights: marketing?.highlights,
      };
    }),
  },
  {
    slug: "spices",
    name: "Spices",
    summary:
      "Cinnamon sticks, black pepper, turmeric, cloves, cardamom, nutmeg, cashews and related specialty products — grades and origins confirmed per enquiry.",
    products: [
      ["cashews", "Cashews"],
      ["cinnamon-sticks", "Cinnamon sticks"],
      ["black-pepper", "Black pepper"],
      ["turmeric", "Turmeric"],
      ["cloves", "Cloves"],
      ["cardamom", "Cardamom"],
      ["nutmeg", "Nutmeg"],
    ].map(([slug, name]) => {
      const spice = getSpiceProductDetail(slug);
      const marketing = getSpiceProductMarketing(slug);
      return {
        slug,
        name,
        overview: spice
          ? `${spice.grade} — ${spice.subtitle}. ${spice.description.slice(0, 120)}…`
          : `${name} enquiries for qualified buyers. Specifications confirmed per RFQ review.`,
        description: marketing?.description,
        availabilityText: "Enquiry-based availability.",
        originOptions: ["Confirmed per enquiry"],
        gradeSummary: spice ? `${spice.grade} — ${spice.subtitle}. ${draftNote}` : draftNote,
        packaging: spice?.packaging ?? ["Multi-wall sacks", "Cartons"],
        inspectionOptions: ["Configurable when verified"],
        incotermOptions: ["FOB", "CIF"],
        documentCategories: [
          "Commercial Invoice",
          "Certificate of Origin",
          "Phytosanitary certificate",
          ...(slug === "cashews" ? ["Health/Veterinary certificate"] : []),
        ],
        minOrderText:
          slug === "cashews" ? "Minimums vary by kernel grade and count." : "Discuss with trade desk.",
        status: "pending_verification" as const,
        image: spice?.heroImage,
        highlights: marketing?.highlights,
      };
    }),
  },
];

export const SEED_PACKAGING = PACKAGING_TYPES.map((p) => ({
  slug: p.slug,
  name: p.name,
  mode: p.mode,
  description: p.description,
  advantages: p.advantages,
}));

export const SITE = {
  name: "Finekarts Incorporated",
  headline: "Global Agricultural Commodity Trading",
  email: "Info@finekarts.com",
  phone: "4169858772",
  phoneDisplay: "+1 (416) 985-8772",
  addressLine1: "4275 Village Center Court",
  addressLine2: "Mississauga, Ontario L4Z 1V3, Canada",
  positioning:
    "Sourcing quality agricultural commodities globally and delivering to qualified buyers worldwide through structured trade programmes.",
};
