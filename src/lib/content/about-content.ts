/** Canonical About page copy (marketing redesign). */

export const ABOUT_HERO = {
  eyebrow: "About Finekarts Incorporated",
  title: "Built for Structured International Commodity Trade",
  description:
    "Founded in March 2024, Finekarts Incorporated is headquartered in Mississauga, Ontario, Canada — specializing in global sourcing, trade execution, and supply chain management of high-grade agricultural commodities, refined products, and industrial materials.",
  primaryCtaLabel: "Explore our products",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Contact the trade desk",
  secondaryCtaHref: "/contact",
} as const;

export const ABOUT_INTRO = {
  eyebrow: "Who we are",
  title: "Connecting producers with qualified global demand",
  paragraphs: [
    "Finekarts Incorporated is an international trading and commodity distribution company. We bridge primary producers and refineries in key producing regions with industrial buyers, distributors, and food manufacturers across global markets.",
    "Finekarts delivers consistent quality, transparent execution, and end-to-end supply chain reliability on programmes we manage.",
  ],
} as const;

export const ABOUT_HIGHLIGHTS = [
  {
    title: "Global trade corridors",
    detail: "Sourcing and delivery across major export origins and destination markets.",
    icon: "globe",
  },
  {
    title: "Bulk commodity programmes",
    detail: "Refined sugars, edible oils, pulses, grains, and specialty cargoes.",
    icon: "layers",
  },
  {
    title: "FOB & CIF structures",
    detail: "Commercial terms aligned to ICC practice and signed Incoterms.",
    icon: "document",
  },
  {
    title: "Contract-led execution",
    detail: "Documentation, inspection scope, and logistics tied to agreed contracts.",
    icon: "handshake",
  },
] as const;

export const ABOUT_WHAT_WE_DO = {
  eyebrow: "What we do",
  title: "Three primary commodity divisions",
  lead:
    "Finekarts operates across three divisions, with strict adherence to international commercial specifications and industry standards:",
  divisions: [
    {
      n: "1",
      title: "Refined sugars",
      intro:
        "We manage bulk and containerized distribution of refined cane sugar across standard ICUMSA color grades:",
      bullets: [
        "ICUMSA 45: High-purity, white refined sugar for commercial food and beverage manufacturing.",
        "ICUMSA 100 & 150: Standard white refined sugar for food processing and wholesale packaging.",
        "ICUMSA 600 & 1200: Very High Polarization (VHP) raw and brown sugars for industrial processing and refining.",
      ],
      href: "/products/sugar",
    },
    {
      n: "2",
      title: "Bulk edible oils",
      intro:
        "We supply crude and refined food-grade vegetable oils in bulk tanker volumes, ISO tanks, and flexitanks:",
      bullets: [
        "Refined sunflower oil & soybean oil",
        "Canola & rapeseed oil",
        "Palm oil, olive oil & corn oil",
      ],
      href: "/products/edible-oils",
    },
    {
      n: "3",
      title: "Agricultural pulses, grains & specialty trade",
      intro:
        "Our agricultural network handles the bulk movement of dry food commodities and industrial metals:",
      bullets: [
        "Pulses & beans: Red, black, white, pinto, and yellow beans.",
        "Grains & coffee: Milled rice and high-grade Arabica coffee beans.",
        "Industrial metals: Copper cathodes for international commercial trade.",
      ],
      href: "/products",
    },
  ],
} as const;

export const ABOUT_SUPPLY_CHAIN = {
  eyebrow: "Supply chain & quality",
  title: "Our supply chain & quality assurance",
  lead:
    "At Finekarts, trade execution is built on rigorous quality control and modern supply chain infrastructure. Every trade we manage follows a strict operational framework designed to mitigate commercial risk and guarantee cargo integrity:",
  bullets: [
    {
      title: "Third-party inspection",
      body:
        "Every shipment is independently sampled, tested, and certified by accredited international superintendents (such as SGS, Bureau Veritas, or Intertek) prior to loading.",
    },
    {
      title: "Custom containment solutions",
      body:
        "From food-grade multi-layer flexitanks for bulk liquids to PE-lined FIBC jumbo bags (1,000 kg) and 50 kg multi-wall sacks for dry softs, our packaging selection is tailored to cargo chemistry and transit conditions.",
    },
    {
      title: "Documentary & regulatory compliance",
      body:
        "We maintain end-to-end alignment with International Chamber of Commerce (ICC) trade rules, documentary credit standards (UCP 600), phytosanitary mandates, and origin traceability standards.",
    },
  ],
} as const;

export const ABOUT_WHY_PARTNER = {
  eyebrow: "Why Finekarts",
  title: "Why partner with Finekarts?",
  items: [
    {
      title: "Reliable sourcing network",
      body:
        "Direct relationships with vetted producers, mills, and refineries across major export origins.",
      icon: "network",
    },
    {
      title: "End-to-end logistics",
      body:
        "Integrated management of port loading, maritime freight, customs compliance, and multi-modal transit.",
      icon: "logistics",
    },
    {
      title: "Commitment to integrity",
      body:
        "Transparent trade structures, rigorous counterparty verification (KYC/KYB), and reliable contract fulfillment.",
      icon: "shield",
    },
  ],
} as const;

export const ABOUT_CONTACT = {
  eyebrow: "Contact",
  title: "Finekarts Incorporated",
  lines: [
    "Mississauga, Ontario, Canada",
    "Global trading & agricultural commodity distribution",
  ],
  ctaTitle: "Ready to discuss a bulk commodity requirement?",
  ctaBody:
    "Share specifications, destination, and Incoterms preference. Submission does not guarantee acceptance, pricing, or shipment.",
} as const;
