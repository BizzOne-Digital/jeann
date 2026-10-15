/** Canonical copy for /insights — deep technical & operational trade guide. */

export const INSIGHTS_HERO = {
  eyebrow: "Deep technical & operational insights",
  title: "Global commodity trade & quality assurance",
  description:
    "Most of what we publish here is about cargo quality and regulatory fit: how sugar, oils, coffee, grains, and pulses meet government food-safety and import rules, how inspection and validation evidence supports PSAs, and how containment and documentation keep programmes bankable.",
  guideLead:
    "This comprehensive insights guide bridges these three critical domains into an actionable framework for trade execution, risk mitigation, and operational governance.",
  primaryCta: { href: "#insights-framework", label: "Explore the framework →" },
  secondaryCta: { href: "#insights-sop-checklist", label: "SOP checklist" },
} as const;

export const INSIGHTS_ARCHITECTURE = {
  n: 1,
  title: "Quality & process assurance architecture",
  lead:
    "In global trade, failure to distinguish between verification and validation often leads to costly demurrage, rejected shipments, or legal disputes under GAFTA, FOSFA, or ICC rules.",
} as const;

export const INSIGHTS_LIFECYCLE = [
  {
    phase: "Qualification & assurance lifecycle",
    subtitle: "Process & system validation",
    bullets: [
      "ISO 17025 lab method validation",
      "CTRM algorithmic risk checks",
      "Plant equipment qualification (3Qs)",
      "EUDR satellite geolocation — evaluates infrastructure",
    ],
  },
  {
    phase: "Inspection & quality verification",
    subtitle: "Point-in-time cargo compliance",
    bullets: [
      "Incoming / receiving checks",
      "In-process quality controls",
      "Final pre-shipment inspection",
      "Independent confirmation of the specific cargo batch",
    ],
  },
  {
    phase: "Containment & transportation",
    subtitle: "Bulk logistics integrity",
    bullets: [
      "Dry bulk vessels (cargo holds)",
      "Intermodal flexitanks",
      "FIBC jumbo bags / 50 kg sacks",
      "ISO tank containers",
    ],
  },
] as const;

export const INSIGHTS_VERIFICATION_VS_VALIDATION = {
  title: "Verification vs. validation: operational distinction",
  verification: {
    label: "Inspection & verification (point-in-time cargo compliance)",
    question: "Does this specific batch or cargo load conform to contract specifications right now?",
    body:
      "Physical, chemical, and dimensional audits performed directly on the material before or during loading.",
  },
  validation: {
    label: "Validation (system & process capability)",
    question:
      "Are the underlying systems, testing methodologies, supply chain tracking tools, and risk models designed to consistently deliver compliant results?",
    body:
      "Validation guarantees that the infrastructure generating the verification data is scientifically sound, legal, and robust.",
  },
} as const;

export const INSIGHTS_PROTOCOL = {
  n: 2,
  title: "The multi-layered inspection protocol",
  lead:
    "To prevent non-conforming cargo from reaching destination ports, trading firms and superintendents (such as SGS, Bureau Veritas, or Intertek) apply a 4-tier inspection strategy:",
  pipeline: [
    { label: "Incoming inspection", note: "Raw materials & inputs" },
    { label: "In-process checks", note: "Processing & packaging" },
    { label: "Pre-shipment inspection", note: "Final lab analysis & specs" },
    { label: "Loading supervision", note: "Hold cleanliness & draft" },
  ],
  tiers: [
    {
      n: 1,
      title: "Incoming / receiving inspection",
      body:
        "Evaluates raw inputs at the processing plant or mill (e.g., raw sugar cane polarity or unrefined seed oil acidity) to ensure processing parameters will hit target outputs.",
    },
    {
      n: 2,
      title: "In-process inspection",
      body:
        "Monitors key parameters during processing (e.g., refinery filtration temperatures, bleaching earth ratios, and automated bag-sealing tension) to prevent mid-production batch corruption.",
    },
    {
      n: 3,
      title: "Final / pre-shipment inspection (PSI)",
      body:
        "Performed on fully processed and packaged goods prior to port arrival. Involves drawing composite samples for laboratory chemical testing (e.g., polarimetry, gas chromatography, or spectrophotometry).",
    },
    {
      n: 4,
      title: "Loading supervision & hatch / hold inspection",
      body:
        "Executed at the port terminal. Independent surveyors conduct ultrasonic hatch leak detection, draft surveys (to calculate exact cargo tonnage via vessel displacement), and cleanliness inspections (confirming holds are free of rust, pest infestation, or chemical residue).",
    },
  ],
} as const;

export const INSIGHTS_VALIDATION = {
  n: 3,
  title: "End-to-end validation domains in commodity trade",
  lead: "Process validation spans five core functional pillars of commodity operations:",
  pillars: [
    "Laboratory & test method validation",
    "Supply chain & origin validation",
    "Trade finance & legal compliance",
    "CTRM & ERP system validation",
    "Equipment qualification (3Qs)",
  ],
  domains: [
    {
      id: "lab",
      roman: "I",
      title: "Laboratory & test method validation (ISO 17025)",
      lead:
        "Before a Certificate of Analysis (CoA) is legally binding in arbitration, the testing laboratory must validate its analytical methods:",
      bullets: [
        "Linearity & range: Demonstrating that instruments (e.g., spectrophotometers measuring ICUMSA color) yield linear results across varying sugar concentration levels.",
        "Repeatability & reproducibility (R&R): Proving that different technicians operating different equipment arrive at identical test values on the same oil or grain sample.",
      ],
    },
    {
      id: "supply",
      roman: "II",
      title: "Supply chain & origin validation",
      lead: "Driven by global mandates such as the EU Deforestation Regulation (EUDR):",
      bullets: [
        "Geolocation validation: Cross-referencing GPS polygon data of farmland against satellite imagery to validate that soft commodities (soybean, palm oil, coffee) were not grown on deforested land.",
        "Rules of origin (COO): Validating transformation steps to confirm tariff preferences under international agreements (USMCA, CETA).",
      ],
    },
    {
      id: "finance",
      roman: "III",
      title: "Trade finance & legal compliance validation",
      bullets: [
        "Documentary credit validation: Automated cross-checking of Letter of Credit (LC) conditions against International Chamber of Commerce rules (UCP 600) to ensure zero document discrepancies upon presentation.",
        "Counterparty & sanctions validation: Screening corporate entities, Ultimate Beneficial Owners (UBOs), and vessel IMO numbers against international database registries (OFAC, UN, EU) prior to signing Sale and Purchase Agreements (SPAs).",
      ],
    },
    {
      id: "ctrm",
      roman: "IV",
      title: "CTRM & digital system validation",
      lead:
        "Ensures Commodity Trading and Risk Management (CTRM) software operates reliably under heavy trade volume:",
      bullets: [
        "Algorithmic risk models: Validating Mark-to-Market (MTM) calculations and Value-at-Risk (VaR) algorithms to prevent unexpected margin calls.",
        "Automated contract generation: Stress-testing document vaults to ensure auto-generated trade contracts retain data integrity and legal enforceability.",
      ],
    },
    {
      id: "equipment",
      roman: "V",
      title: "Process & equipment qualification (the 3Qs)",
      lead: "Used during plant buildouts, refinery expansions, or packaging line upgrades:",
      bullets: [
        "Installation qualification (IQ): Verifies equipment, piping, wiring, and utilities are installed according to engineering designs.",
        "Operational qualification (OQ): Tests operating limits (temperature ranges, flow rates, pressure thresholds) under worst-case scenarios.",
        "Performance qualification (PQ): Demonstrates that the integrated line consistently produces compliant product across extended commercial runs.",
      ],
    },
  ],
} as const;

export const INSIGHTS_CONTAINMENT_MATRIX = {
  n: 4,
  title: "Master matrix: bulk commodity containment & logistics",
  lead:
    "Selecting cargo packaging involves balancing material chemistry, moisture exposure risks, physical unit weights, and freight cost efficiency.",
  rows: [
    {
      classification: "Refined sugar",
      specs: "ICUMSA 45 / 100 / 150",
      packaging:
        "Woven PP jumbo bags (FIBC) • Multi-wall kraft sacks • Dry bulk container liners",
      unit: "1,000 kg • 25 kg / 50 kg • ~24 MT / 20ft",
      hazards:
        "Caking & moisture ingress: Requires PE inner liners; relative humidity must remain below 60% to prevent sugar crystal hardening.",
    },
    {
      classification: "Grains & pulses",
      specs: "Wheat, corn, chickpeas, beans",
      packaging: "Bulk vessel cargo holds • Woven PP bags • Dry bulk container liners",
      unit: "15,000–60,000 MT • 50 kg sacks • ~25 MT / 20ft",
      hazards:
        "Sweating & infestation: Holds must be clean, dry, and fumigated (e.g., aluminum phosphide); ventilation control to prevent moisture condensation.",
    },
    {
      classification: "Green coffee & cocoa",
      specs: "Arabica / robusta beans",
      packaging: "Jute / hessian bags • Specialty GrainPro liners",
      unit: "60 kg – 69 kg bags",
      hazards:
        "Moisture & off-odor: Natural jute allows breathability; hermetic inner liners prevent mold and moisture absorption during ocean transit.",
    },
    {
      classification: "Edible oils",
      specs: "Sunflower, soybean, canola, palm",
      packaging:
        "Flexitanks in 20ft containers • Product / chemical tankers • Stainless steel ISO tanks",
      unit: "18,000–24,000 liters • 10,000–50,000 DWT • 21,000–26,000 liters",
      hazards:
        "Oxidation & free fatty acid (FFA) rise: Nitrogen blanketing prevents rancidity; flexitanks require heating pads for high-viscosity oils (e.g., palm oil).",
    },
    {
      classification: "Metals & minerals",
      specs: "Copper cathodes, ingots",
      packaging: "Steel-strapped bundles • Reinforced heavy-duty FIBCs",
      unit: "1,000–2,500 kg • Up to 2,500 kg",
      hazards:
        "Physical shift & abrasion: High weight density requires reinforced steel strapping and heavy-duty floor distribution inside containers or breakbulk holds.",
    },
  ],
} as const;

export const INSIGHTS_SOP = {
  n: 5,
  title: "Standard operating procedure (SOP) checklist for trade execution",
  lead:
    "To synthesize inspection, validation, and packaging into a clear operational workflow, follow this sequential execution protocol:",
  phases: [
    {
      title: "Pre-trade governance & counterparty validation",
      items: [
        "Complete KYB / UBO verification of buyer, seller, and intermediaries.",
        "Screen trade vessels and ports against active OFAC/UN sanctions lists.",
        "Validate financial instruments (LC / BCL / POF) with issuing prime banks under UCP 600 rules.",
      ],
    },
    {
      title: "Manufacturing & plant quality verification",
      items: [
        "Verify supplier ISO 9001 / ISO 22000 / HACCP certification status.",
        "Audit packaging integrity (PE liner thickness in FIBCs, flexitank pressure ratings).",
        "Obtain pre-loading Certificate of Analysis (CoA) for baseline specs (ICUMSA, moisture, FFA).",
      ],
    },
    {
      title: "Port terminal & maritime loading control",
      items: [
        "Appoint accredited third-party superintendent (SGS / Intertek / Bureau Veritas).",
        "Execute hold/tank cleanliness, dryness, and odor-free inspection prior to loading.",
        "Conduct ultrasonic hatch leak testing on dry bulk vessels.",
        "Perform initial and final draft surveys (for solid bulk) or shore tank gauging (for liquid bulk).",
      ],
    },
    {
      title: "Documentation & discharge validation",
      items: [
        "Cross-examine final bill of lading (B/L), phytosanitary certificate, certificate of origin, and loading CoA.",
        "Upload trade documentation to CTRM / ERP digital vault for automated contract reconciliation.",
        "Confirm seal numbers on container doors or tanker hatches match manifest documentation before final discharge.",
      ],
    },
  ],
} as const;

export const INSIGHTS_CTA = {
  title: "Apply this framework to your trade programme",
  lead:
    "Share commodity, quantity, corridor, and contractual milestones — our trade desk can help align verification, validation, and containment with your execution protocol.",
  shareTitle: "What to include in your enquiry",
  shareItems: [
    "Commodity, grade, and specification reference",
    "Quantity, packaging, and Incoterms (FOB / CIF)",
    "Origin, corridor, and destination port",
    "Inspection tier and validation scope",
    "LC / documentary credit milestones if applicable",
  ],
  primaryLabel: "Contact the trade desk",
  primaryHref: "/contact",
  secondaryLabel: "Trade resources",
  secondaryHref: "/resources",
} as const;

/** Home page teaser — mirrors the operational /insights guide (not legacy blog articles). */
export const HOME_INSIGHTS_TEASER = {
  eyebrow: INSIGHTS_HERO.eyebrow,
  title: INSIGHTS_HERO.title,
  viewAllHref: "/insights",
  viewAllLabel: "Explore the insights guide →",
  cards: [
    {
      title: INSIGHTS_ARCHITECTURE.title,
      excerpt: INSIGHTS_ARCHITECTURE.lead,
      href: "/insights#insights-framework",
    },
    {
      title: INSIGHTS_PROTOCOL.title,
      excerpt: INSIGHTS_PROTOCOL.lead,
      href: "/insights#insights-framework",
    },
    {
      title: INSIGHTS_SOP.title,
      excerpt: INSIGHTS_SOP.lead,
      href: "/insights#insights-sop-checklist",
    },
  ],
} as const;
