/** Client-approved inspection page content (Independent Commodity Inspection Services). */

export const INSPECTIONS_HERO = {
  eyebrow: "Independent Commodity Inspection Services",
  title: "Confidence in Every Shipment",
  description:
    "We sell bulk commodities with proactive safety and quality discipline from origin through the loading dock. Independent inspectors help buyers confirm quality and quantity against the PSA before shipment when that milestone is agreed — reducing disputes and surprises at destination.",
  primaryCta: { href: "#site-enquiry-cta", label: "Request an inspection →" },
  secondaryCta: { href: "#inspection-hub", label: "Browse inspection topics" },
};

export const INSPECTION_SERVICES = [
  {
    n: 1,
    title: "Supplier Verification",
    summary:
      "Independent verification of the supplier before a major transaction — for commercial due diligence, not a guarantee of performance.",
    intro:
      "Depending on scope, verification may include:",
    items: [
      "Corporate and business information",
      "Physical business location",
      "Production or processing facilities",
      "Warehouse and storage facilities",
      "Production capacity and export capability",
      "Quality-management systems",
      "Relevant licenses and certifications",
      "Operational capability and documentation review",
    ],
    note: "Supplier verification provides additional information for due diligence. It does not constitute a guarantee of supplier performance or product availability.",
  },
  {
    n: 2,
    title: "Commodity Quality Inspection",
    summary:
      "Testing and inspection to determine whether the commodity conforms to agreed contractual specifications.",
    intro: "Depending on the product, inspection may include:",
    items: [
      "Physical characteristics, moisture, purity, foreign matter, colour, and grade",
      "Weight and packaging condition",
      "Chemical and microbiological parameters where applicable",
      "Contaminants and residues where required",
    ],
    note: "Inspection and testing are performed according to applicable contract specifications and recognized industry or regulatory standards.",
  },
  {
    n: 3,
    title: "Quantity & Weight Verification",
    summary:
      "Accurate quantity verification for bulk commodity transactions — method depends on commodity, transport, facility, and contract.",
    intro: "Services may include:",
    items: [
      "Certified scale and weighbridge inspection",
      "Tank measurement and draft survey",
      "Shore-tank and meter measurement",
      "Stockpile measurement, tally and counting",
      "Quantity loaded and quantity discharged",
    ],
  },
  {
    n: 4,
    title: "Pre-Shipment Inspection",
    summary:
      "Before shipment, an independent inspection can help confirm that the commodity and shipping arrangements are consistent with the agreed transaction.",
    body:
      "Product → Quantity → Quality → Packaging → Storage → Documentation → Loading readiness. Where applicable, inspectors may examine the product, collect representative samples, review documentation and report material discrepancies identified before shipment.",
    items: [],
  },
  {
    n: 5,
    title: "Loading Supervision",
    summary:
      "Additional transparency for international shipments — loading commencement through completion.",
    intro: "The appointed inspector may monitor:",
    items: [
      "Quantity loaded and product identification",
      "Sampling, packaging, container and seal numbers",
      "Vessel or container condition and loading procedures",
      "Cargo condition and photographic evidence where available",
    ],
    note: "A loading report and applicable inspection certificates may be issued following completion.",
  },
  {
    n: 6,
    title: "Laboratory Testing & Certificate of Analysis",
    summary:
      "Samples submitted to independent laboratories against agreed specifications.",
    intro: "Depending on commodity, testing may cover:",
    items: [
      "Purity, moisture, acidity, FFA, peroxide value",
      "ICUMSA colour, polarization, protein, foreign matter",
      "Pesticide residues, heavy metals, microbiological parameters",
      "Other contractual or regulatory requirements",
    ],
    note: "Where applicable, testing may be performed by laboratories operating under recognized accreditation such as ISO/IEC 17025 for the relevant scope.",
  },
];

export const COMMODITY_INSPECTION_CATEGORIES = [
  {
    title: "Sugar",
    href: "/products/sugar",
    image: "/images/inspections/sugar-bags-hold.png",
    imageAlt: "Quantity verification of bagged sugar in vessel hold",
    text: "ICUMSA colour, polarization, moisture, ash, granulation, packaging, quantity and loading verification.",
  },
  {
    title: "Rice",
    href: "/products/rice-and-grains",
    image: "/images/inspections/sampling-grain.png",
    imageAlt: "Inspector sampling bulk grain at port",
    text: "Grain characteristics, broken percentage, moisture, foreign matter, milling quality, packaging and quantity.",
  },
  {
    title: "Edible Oils",
    href: "/products/edible-oils",
    image: "/images/inspections/tank-sampling.png",
    imageAlt: "Tank sampling on vessel deck",
    text: "Crude and refined sunflower, soybean, palm and rapeseed oils — applicable chemical and physical parameters.",
  },
  {
    title: "Grains & Pulses",
    href: "/products/beans-and-pulses",
    image: "/images/inspections/warehouse-bulk-inspection.png",
    imageAlt: "Bulk commodity warehouse inspection",
    text: "Wheat, corn, soybeans, beans, chickpeas, lentils and other agricultural commodities.",
  },
  {
    title: "Spices & Nuts",
    href: "/products/spices",
    image: "/images/inspections/warehouse-sack-sampling.png",
    imageAlt: "Inspector sampling agricultural sacks in warehouse",
    text: "Cashews, cinnamon, pepper, turmeric and related products — identity, quality, moisture, foreign matter and packaging.",
  },
  {
    title: "Coffee",
    href: "/products/coffee",
    image: "/images/inspections/green-coffee-warehouse-inspection.png",
    imageAlt: "Green coffee beans in burlap sacks stacked in a warehouse for inspection",
    text: "Green, dry and roasted dry coffee — screen size, moisture, defect count, packaging and loading verification.",
  },
];

export const INSPECTION_NETWORK = {
  lead: "Finekarts works with or may appoint qualified independent inspection, testing and verification organizations according to the requirements of each transaction.",
  organizations: ["SGS", "Intertek", "Bureau Veritas", "Cotecna", "Control Union", "CCIC"],
  selectionNote:
    "The inspection company is selected and appointed according to the specific transaction requirements and availability.",
  disclaimer:
    "The use of an inspection company's name or logo on this website does not constitute an endorsement, certification, affiliation or partnership unless Finekarts has received formal authorization or has an executed agreement with that organization.",
};

export const ORIGIN_DESTINATION = {
  origin: {
    title: "Origin inspection",
    intro: "Origin inspection can be arranged at:",
    places: [
      "Processing facilities and refineries",
      "Mills, warehouses and storage terminals",
      "Ports, tank farms and loading facilities",
    ],
    note: "Origin inspection helps establish the condition, quantity and quality of the cargo before shipment.",
  },
  destination: {
    title: "Destination inspection",
    intro: "Where required by contract, independent inspection can be arranged at destination:",
    places: [
      "Discharge supervision and quantity verification",
      "Quality testing and damage assessment",
      "Contamination investigation and packaging inspection",
      "Sampling and final survey reporting",
    ],
    note: "Destination requirements should be agreed before shipment and incorporated into the applicable sales contract.",
  },
};

export const DOCUMENTARY_TRADE = {
  title: "Inspection & documentary trade",
  lead: "For transactions using Letters of Credit, documentary collections or other documentary payment structures, inspection documents may form part of the agreed documentary requirements.",
  contractItems: [
    "Required inspection company and inspection location",
    "Inspection date and required certificate",
    "Quality parameters and quantity determination method",
    "Sampling method and laboratory requirements",
    "Certificate wording and document presentation requirements",
  ],
  note: "Inspection companies do not guarantee payment or the financial performance of a buyer or seller. Their role is to independently inspect, test, verify and report according to the agreed scope.",
};

export const INSPECTION_PROCESS_STEPS = [
  { step: 1, title: "Transaction review", text: "Finekarts reviews commodity, origin, destination, specifications and contractual requirements." },
  { step: 2, title: "Inspection scope", text: "Parties establish required inspection, sampling, testing and quantity-verification procedures." },
  { step: 3, title: "Inspector appointment", text: "A suitable independent inspection organization is appointed for the transaction." },
  { step: 4, title: "Inspection & sampling", text: "The inspector conducts the agreed inspection and collects representative samples where applicable." },
  { step: 5, title: "Laboratory testing", text: "Samples are tested according to agreed specifications and applicable standards." },
  { step: 6, title: "Loading verification", text: "Quantity, cargo condition and loading activities are documented." },
  { step: 7, title: "Certification", text: "Inspector issues reports, certificates of quality/quantity/analysis or other agreed documentation." },
  { step: 8, title: "Shipment & documentation", text: "Inspection documentation is incorporated into transaction documentation where required." },
];

export const WHY_INDEPENDENT_INSPECTION = [
  {
    title: "Reduce uncertainty",
    text: "Independent verification provides objective information about the cargo and transaction.",
  },
  {
    title: "Improve transparency",
    text: "Inspection creates documented evidence of quality, quantity and loading activities.",
  },
  {
    title: "Support contractual compliance",
    text: "Inspection criteria can be aligned with the SPA, FCO, purchase contract or documentary requirements.",
  },
  {
    title: "Protect commercial interests",
    text: "Early identification of discrepancies can help reduce costly disputes.",
  },
  {
    title: "Strengthen international trade",
    text: "Professional inspection and testing can provide additional confidence to buyers, sellers, financiers, insurers and logistics providers.",
  },
];

export const INSPECTION_CTA = {
  title: "Request an inspection",
  lead: "Tell us your commodity, quantity, origin, destination, and when you need quality and quantity confirmed against the PSA — typically before shipment. We coordinate independent inspection scope with recognized firms.",
  fields: ["Commodity", "Quantity", "Origin", "Destination", "Required inspection", "Delivery terms"],
  tagline: "From origin to destination — verified. Documented. Transparent.",
};

export const INSPECTION_PILLARS = [
  {
    id: "services",
    title: "Our services",
    summary: "Supplier verification, quality, quantity, loading supervision, and laboratory testing.",
    icon: "clipboard",
    accent: {
      main: "#1b3a5c",
      light: "#eef3f8",
      ring: "#1b3a5c",
    },
  },
  {
    id: "commodities",
    title: "Commodities",
    summary: "Sugar, rice, oils, grains, spices, and coffee — scope aligned to your contract.",
    icon: "grid",
    accent: {
      main: "#1b7a4a",
      light: "#edf7f1",
      ring: "#1b7a4a",
    },
  },
  {
    id: "process",
    title: "Process & evidence",
    summary: "Eight-step workflow from transaction review through certification and documentation.",
    icon: "flow",
    accent: {
      main: "#c88e4a",
      light: "#fff9ef",
      ring: "#c88e4a",
    },
  },
  {
    id: "network",
    title: "Partners & scope",
    summary: "Origin and destination coverage, independent firms, and documentary trade.",
    icon: "globe",
    accent: {
      main: "#6b4423",
      light: "#f5ebe0",
      ring: "#6b4423",
    },
  },
] as const;

export type InspectionTabId = (typeof INSPECTION_PILLARS)[number]["id"];

export const INSPECTION_HUB_INTRO =
  "Pick a topic below — services, commodities, process, or partners. Full scope details are one click away; the page stays visual first.";
