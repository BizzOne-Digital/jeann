/** Marketing /packaging page — canonical client copy. */

export const PACKAGING_PAGE_HERO = {
  eyebrow: "Bulk packaging & containment",
  title: "Packaging formats for international commodity trade",
  description:
    "In international bulk commodity trading, selection of the correct packaging format is critical to preserving cargo quality, preventing contamination, optimizing freight costs (FCL/FLAT RACK/BULK), and adhering to international maritime standards (such as IMO, SOLAS, and ISO regulations).",
  categoriesLead:
    "Bulk commodities are broadly categorized into three physical states: Dry Agricultural & Soft Commodities, Liquid Commodities (Food-Grade & Industrial), and Hard Commodities, Minerals & Metals.",
  primaryCta: { href: "#packaging-overview", label: "Explore packaging types →" },
  secondaryCta: { href: "/logistics", label: "Logistics" },
} as const;

export type PackagingSubsection = {
  id: string;
  letter: string;
  title: string;
  description?: string;
  capacity?: string;
  mechanism?: string;
  structure?: string;
  use?: string;
  keyFeatures?: string[];
  keyConsiderations?: string;
  primaryGoods: string;
  bullets?: string[];
};

export const PACKAGING_DRY_SOFT = {
  n: 1,
  title: "Dry agricultural & soft commodities",
  example: "e.g., Refined Sugar, Grains, Pulses, Coffee Beans, Rice, Soybeans",
  lead:
    "Dry bulk softs require packaging that protects against moisture absorption, clumping, pest infestation, and tearing during multi-modal transit.",
  subsections: [
    {
      id: "fibc",
      letter: "A",
      title: 'Flexible intermediate bulk containers (FIBCs / "Jumbo Bags" / "Big Bags")',
      description:
        "Heavy-duty, woven polypropylene (PP) fabric bags holding 500 kg to 2,000 kg (0.5 to 2 Metric Tons).",
      keyFeatures: [
        "Fitted with PE (Polyethylene) internal liners for moisture control and dust containment.",
        "Equipped with top filling spouts and bottom discharge spouts for automated loading/unloading.",
        "Designed with 4-corner lifting loops for forklift or crane operations.",
      ],
      primaryGoods:
        "Refined Cane Sugar (ICUMSA 45/100/150), agricultural pulses (chickpeas, beans, lentils), coffee beans, corn, and fertilizer.",
    },
    {
      id: "pp-bags",
      letter: "B",
      title: "Standard woven polypropylene (PP) & multi-wall paper bags",
      description: "Individual 25 kg or 50 kg woven PP or multi-wall kraft paper bags.",
      keyFeatures: [
        "Poly-lined inner layers or lamination to prevent ambient humidity ingress.",
        "Sized specifically for standard container stuffing (24–27 MT per 20ft/40ft container) and manual/palletized handling at destination ports.",
      ],
      primaryGoods:
        "Commercial-grade refined sugar, milled rice, wheat flour, animal feed, and bulk milk powder.",
    },
    {
      id: "jute",
      letter: "C",
      title: "Jute / hessian bags",
      description: "Natural plant-fiber bags holding 60 kg to 90 kg.",
      keyFeatures: [
        "High breathability allowing air circulation, preventing internal condensation/sweating in high-humidity sea voyages.",
      ],
      primaryGoods: "Green Arabica/Robusta coffee beans, cocoa beans, and raw nuts.",
    },
    {
      id: "liners",
      letter: "D",
      title: "Sea bulk / container liners (dry bulk liners)",
      description:
        "Custom-fitted PE/PP film bladders lined inside standard 20ft or 40ft dry sea containers.",
      keyFeatures: [
        "Converts standard ISO containers into bulk flow vessels; goods are pneumatically blown or gravity-fed directly into the liner.",
      ],
      primaryGoods: "Unprocessed bulk grains, malt, plastic resin pellets, and oilseeds.",
    },
  ] satisfies PackagingSubsection[],
} as const;

export const PACKAGING_LIQUID = {
  n: 2,
  title: "Bulk liquid commodities",
  example: "e.g., Edible Vegetable Oils, Molasses, Biofuels, Base Oils, Chemicals",
  lead:
    "Liquid bulk packaging must sustain hydrostatic pressure, temperature fluctuations, and contamination risks, while maintaining purity.",
  subsections: [
    {
      id: "flexi",
      letter: "A",
      title: "Flexitanks (in-container bladders)",
      description:
        "Single- or multi-layer polyethylene (PE) bladders installed inside standard 20-foot ocean shipping containers.",
      capacity: "16,000 to 24,000 Liters (approx. 18 to 22 Metric Tons).",
      keyFeatures: [
        "One-time use (eliminates cross-contamination and tank washing costs).",
        "Equipped with bottom loading/unloading valves and heating pads for high-viscosity liquids.",
      ],
      primaryGoods:
        "Non-hazardous liquid commodities—bulk edible oils (sunflower, soybean, canola, palm, corn, olive oil), liquid sugar, molasses, wine, and base lubricants.",
    },
    {
      id: "iso",
      letter: "B",
      title: "ISO tank containers (intermodal tank containers)",
      description: "High-grade stainless steel pressure vessels held within a standard ISO 20-foot frame.",
      capacity: "21,000 to 26,000 Liters.",
      keyFeatures: [
        "Reusable, fully insulated, pressure-rated, and equipped with heating/cooling coils for temperature-sensitive cargoes.",
      ],
      primaryGoods:
        "Food-grade liquids, hazardous/non-hazardous liquid chemicals, petrochemicals, and biofuels.",
    },
    {
      id: "ibc-drums",
      letter: "C",
      title: "Intermediate bulk containers (IBC totes) & steel/plastic drums",
      description:
        "When transporting bulk commodities via sea, rail, or barge, traditional individual packages (like bags or boxes) are replaced by industrial bulk containment systems—ranging from specialized container-sized bladders to the structural cargo holds and tanks of the ships themselves.",
      bullets: [
        "IBC totes: Rigid cubic HDPE plastic tanks enclosed in a galvanized steel cage on an integrated pallet (1,000-Liter capacity).",
        "Drums: Standard 208-Liter (55-Gallon) tight-head steel or high-density polyethylene (HDPE) barrels.",
      ],
      primaryGoods:
        "Specialty oils, food additives, flavors, industrial lubricants, and specialty liquid chemicals where smaller unit-offtake is required.",
    },
  ] satisfies PackagingSubsection[],
} as const;

export const PACKAGING_HARD = {
  n: 3,
  title: "Hard commodities, energy & minerals",
  example: "e.g., Copper Cathodes, Scrap Metal, Coal, Iron Ore, Bauxite",
  lead:
    "Hard commodities require high-density structural packaging or specialized breakbulk/bulk vessel loading to withstand severe weight and abrasion.",
  subsections: [
    {
      id: "bundles",
      letter: "A",
      title: "Strapped bundles & palletized units",
      description:
        "Metal sheets, ingots, or bars bound with high-tensile steel or heavy-duty PET strapping.",
      keyFeatures: [
        "Stackable units designed for direct crane hook loading or forklift handling inside breakbulk holds and containerized flat racks.",
      ],
      primaryGoods: "Copper cathodes, aluminum ingots, zinc blocks, and steel rebar.",
    },
    {
      id: "heavy-fibc",
      letter: "B",
      title: 'Reinforced FIBCs (heavy-duty ore bags)',
      description: "Extra-heavy woven PP bags with reinforced cross-corner loops and anti-sifting seams.",
      capacity: "Up to 2,500 kg.",
      primaryGoods:
        "High-density mineral concentrates, ferro-alloys, sand, quartz, and industrial slag.",
    },
    {
      id: "breakbulk",
      letter: "C",
      title: "Unpackaged bulk / breakbulk (solid bulk cargo)",
      description:
        "Goods shipped without individual packaging, loaded directly into cargo holds of bulk carriers (Panamax, Supramax, Capesize vessels) or open-top railcars.",
      primaryGoods: "Iron ore, thermal coal, clinker, crude oil (via tanker ships), and raw scrap metal.",
    },
  ] satisfies PackagingSubsection[],
} as const;

export const PACKAGING_MARITIME = {
  title: "Large-scale vessel & intermodal containment",
  lead:
    "When transporting bulk commodities via sea, rail, or barge, industrial bulk containment systems range from specialized container-sized bladders to the structural cargo holds and tanks of the ships themselves.",
  dryVessel: {
    title: "1. Dry bulk cargo vessel packaging & holds",
    subsections: [
      {
        letter: "A",
        title: "Solid bulk cargo holds (unpackaged)",
        capacity: "10,000 to over 200,000 Metric Tons across multiple holds depending on vessel class (Handysize, Supramax, Panamax, Capesize).",
        mechanism:
          "Cargo is poured directly into steel holds via shore-based conveyor belts or grabs. Holds are sealed with weather-tight hydraulic hatch covers.",
        keyConsiderations:
          "Must comply with the IMSBC Code (International Maritime Solid Bulk Cargoes) to manage cargo shift, moisture content, and chemical hazards (e.g., self-heating in coal or iron ore fines).",
        primaryGoods:
          "Raw cane sugar, wheat, corn, soybeans, iron ore, coal, bauxite, and fertilizer.",
      },
      {
        letter: "B",
        title: "Dry bulk sea container liners (intermodal bulk packaging)",
        capacity: "Up to 24 Metric Tons per 20ft/40ft ocean container.",
        mechanism:
          "Custom polyethylene (PE) or polypropylene (PP) full-length bladders that transform standard ISO shipping containers into sealed dry bulk units. Filled via top/front loading ports using pneumatic blowers or gravity chutes, and discharged by tilting the container.",
        primaryGoods: "Refined food-grade sugar, malt, plastic resins, coffee beans, and starch.",
      },
    ],
  },
  liquidVessel: {
    title: "2. Liquid bulk tanker vessel & intermodal systems",
    subsections: [
      {
        letter: "A",
        title: "Integrated ship cargo tanks (product & chemical tankers)",
        capacity: "10,000 to over 300,000 Deadweight Tons (DWT) on VLCCs (Very Large Crude Carriers).",
        structure:
          "High-grade coated steel tanks (epoxy or zinc silicate lined) or solid stainless steel tanks. Built with double hulls to prevent leaks in collisions.",
        keyFeatures: [
          "Integrated heating coils (to maintain viscosity in heavy oils or palm oil).",
          "Nitrogen inerting systems (to prevent fire).",
          "Individual deep-well pumps for each tank to prevent cross-contamination.",
        ],
        primaryGoods:
          "Bulk edible oils (sunflower, soybean, palm, canola), crude petroleum, refined fuels, molasses, and industrial chemicals.",
      },
      {
        letter: "B",
        title: "Flexitanks (containerized liquid bladders)",
        capacity: "16,000 to 24,000 Liters (18–22 Metric Tons).",
        structure:
          "Multi-layered food-grade polyethylene bladders placed inside standard 20ft dry containers, turning standard cargo ships into liquid bulk carriers without requiring specialized tanker vessels.",
        primaryGoods: "Edible vegetable oils, liquid sugar, wine, and non-hazardous liquid chemicals.",
      },
    ],
  },
  gasVessel: {
    title: "3. Gas & cryogenic bulk tankers",
    lead: "Specialized containment systems designed for gases that are liquified under pressure or extreme cold.",
    subsections: [
      {
        letter: "A",
        title: "Membrane tanks",
        structure:
          "Integrated directly into the ship's hull using thin invar or stainless steel membranes backed by thick insulation layers.",
        use: "Liquefied Natural Gas (LNG) kept at -162°C (-260°F).",
      },
      {
        letter: "B",
        title: "Moss spherical / independent Type-B tanks",
        structure:
          "Heavy self-supporting aluminum or steel spheres mounted inside the vessel hull.",
        use: "LNG and Liquefied Petroleum Gas (LPG like propane/butane), capable of handling immense thermal expansion and high internal pressures.",
      },
    ],
  },
} as const;

export const PACKAGING_SUMMARY_MATRIX = {
  title: "Summary matrix: bulk packaging selection",
  rows: [
    {
      commodity: "Refined sugar / grains",
      packaging: "Jumbo bags (FIBC) / 50 kg PP bags",
      unit: "50 kg to 1,000 kg",
      protection: "Moisture prevention & anti-caking",
    },
    {
      commodity: "Coffee & cocoa",
      packaging: "Jute/hessian bags",
      unit: "60 kg to 90 kg",
      protection: "Air circulation & sweat prevention",
    },
    {
      commodity: "Edible oils (sunflower, soy, canola)",
      packaging: "Flexitanks in 20ft containers",
      unit: "18,000 to 24,000 liters",
      protection: "Leakage prevention, food-grade purity",
    },
    {
      commodity: "Industrial / hazardous liquids",
      packaging: "ISO tanks / steel drums",
      unit: "208 L to 25,000 L",
      protection: "Chemical containment & pressure rating",
    },
    {
      commodity: "Copper cathodes & metals",
      packaging: "Strapped metal bundles",
      unit: "1,000 kg to 2,500 kg",
      protection: "High tensile strength & load stability",
    },
  ],
} as const;

export const PACKAGING_CONTAINMENT_COMPARISON = {
  title: "Large commodity containment comparison",
  rows: [
    {
      type: "Cargo holds",
      vessel: "Bulk carrier (Supramax / Panamax)",
      capacity: "35,000 – 100,000+ MT",
      applications: "Grains, raw sugar, coal, iron ore",
    },
    {
      type: "Ship cargo tanks",
      vessel: "Product / chemical tanker",
      capacity: "10,000 – 50,000 DWT",
      applications: "Edible oils, biodiesel, liquid sugar, petroleum",
    },
    {
      type: "Container liners",
      vessel: "Container ship (FCL)",
      capacity: "18 – 24 MT",
      applications: "Powdered sugar, malt, resin pellets",
    },
    {
      type: "Flexitanks",
      vessel: "Container ship (20ft FCL)",
      capacity: "16,000 – 24,000 L",
      applications: "Edible oils, wine, industrial lubricants",
    },
    {
      type: "Cryogenic tanks",
      vessel: "LNG / LPG carrier",
      capacity: "125,000 – 175,000 m³",
      applications: "Liquefied natural gas, propane, butane",
    },
  ],
} as const;

export const PACKAGING_PAGE_CTA = {
  title: "Match packaging to your commodity programme",
  lead:
    "Share product specification, parcel size, corridor, and Incoterms — our trade desk aligns FIBC, flexitank, ISO, vessel, or breakbulk structures with contract and inspection scope.",
  shareTitle: "Include in your packaging enquiry",
  shareItems: [
    "Commodity state (dry soft, liquid, or hard bulk)",
    "Target unit weight, volume, or vessel parcel",
    "Moisture, purity, or hazardous containment requirements",
    "FCL, flat rack, breakbulk, or tanker routing preference",
    "Destination handling and discharge equipment",
  ],
  primaryLabel: "Contact the trade desk",
  primaryHref: "/contact",
  secondaryLabel: "Inspections & quality",
  secondaryHref: "/inspections",
} as const;
