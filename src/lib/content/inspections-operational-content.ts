/** Canonical /inspections marketing copy. */

export const INSPECTIONS_HERO = {
  eyebrow: "Inspections",
  title: "Structured examination for standards & requirements",
  description:
    "An inspection is a structured physical examination or critical review used across engineering, manufacturing, construction, software, and quality management to determine if a system, product, or process meets specific standards and requirements.",
  primaryCta: { href: "#inspection-types", label: "Explore inspection types →" },
  secondaryCta: { href: "/insights", label: "Operational insights guide" },
} as const;

export const INSPECTIONS_TIMING_TYPES = {
  title: "Types of inspection by timing and purpose",
  items: [
    {
      n: 1,
      title: "Receiving / incoming inspection",
      purpose:
        "Evaluates raw materials, parts, or components delivered by suppliers before they enter production or inventory.",
      focus:
        "Verifies dimensions, material certifications, visual defects, quantity, and packaging integrity.",
      benefit:
        "Prevents defective raw materials from entering the manufacturing line, reducing wasted labor and scrap costs.",
    },
    {
      n: 2,
      title: "In-process / in-line inspection",
      purpose:
        "Conducted during the manufacturing or operational process at specified checkpoints.",
      focus:
        "Verifies tool calibration, intermediate assembly dimensions, machine setups, and process tolerances.",
      benefit:
        "Catches defects early in production before subsequent high-cost value-add steps are performed.",
    },
    {
      n: 3,
      title: "Final / pre-shipment inspection",
      purpose:
        "Performed on fully finished products prior to packaging, shipping, or handover to the customer.",
      focus:
        "Checks functional performance, total dimensional accuracy, surface cosmetics, labeling, and packaging completeness.",
      benefit:
        "Ensures compliance with customer specifications and quality management systems (e.g., ISO 9001), preventing customer returns.",
    },
  ],
} as const;

export const INSPECTIONS_METHOD_TYPES = {
  title: "Types of inspection by methodology",
  items: [
    {
      n: 1,
      title: "Visual inspection",
      purpose:
        "Uses direct human vision or optics (microscopes, borescopes) to spot surface-level abnormalities.",
      focus:
        "Identifies cracks, surface corrosion, weld porosity, painting defects, misalignments, and missing components.",
      benefit: "Cost-effective, fast, and acts as the first line of defense before technical testing.",
    },
    {
      n: 2,
      title: "Non-destructive testing (NDT) / non-destructive inspection (NDI)",
      purpose:
        "Evaluates internal structure and integrity without damaging or altering the material or part.",
      focus: "Detects internal cracks, voiding, wall thickness loss, and sub-surface flaws.",
      techniques: [
        "Ultrasonic testing (UT): High-frequency sound waves measure thickness and locate internal cracks.",
        "Radiographic testing (RT): X-rays or gamma rays create internal imaging of welds or castings.",
        "Magnetic particle testing (MT): Detects surface and near-surface flaws in ferromagnetic materials.",
        "Liquid penetrant testing (PT): Fluorescent or red dye reveals surface-breaking cracks.",
      ],
      benefit:
        "Ensures safety and integrity in high-stress components (boilers, aircraft parts, pipelines) without destroying usable assets.",
    },
    {
      n: 3,
      title: "Destructive inspection",
      purpose: "Tests materials to the point of mechanical failure or severe physical alteration.",
      focus:
        "Evaluates material properties like tensile strength, hardness, impact resistance, and fatigue life.",
      techniques: [
        "Tensile testing, Charpy impact testing, metallographic sectioning, and burn-through tests.",
      ],
      benefit: "Provides definitive empirical data on material strength and safety margins.",
    },
    {
      n: 4,
      title: "Dimensional / metrology inspection",
      purpose:
        "Verifies that physical geometry matches engineering designs and CAD models within specified tolerances.",
      focus:
        "Measurements of length, diameter, flatness, concentricity, and profile tolerances.",
      techniques: [
        "Calipers, micrometers, coordinate measuring machines (CMM), laser scanners, and optical comparators.",
      ],
      benefit: "Guarantees proper fit and interchangeability of parts during assembly.",
    },
  ],
} as const;

export const INSPECTIONS_SCOPE_TYPES = {
  title: "Types of inspection by scope and approach",
  items: [
    {
      n: 5,
      title: "Regulatory, environmental & compliance verification",
      lead:
        "Used by governments, standards bodies (ISO, FDA, ASTM), and third-party auditors to verify adherence to legal frameworks and standards.",
      bullets: [
        "Compliance verification: Formally checks that an organization or product strictly adheres to specific industry regulations (e.g., ISO 9001, FDA Good Manufacturing Practices, OSHA safety codes).",
        "Environmental & carbon verification: Audits emissions, carbon credit generation, sustainability claims, and waste disposal methods against international environmental standards.",
        "Trade & customs verification: Validates tariff classifications, certificates of origin, phytosanitary certificates, and customs documentation for international trade.",
      ],
    },
    {
      n: 6,
      title: "Scientific, clinical & method verification",
      lead:
        "Used in laboratories, healthcare, and pharmaceuticals to ensure test results and analytical methods are consistently accurate.",
      bullets: [
        "Analytical method verification: Demonstrates that a standardized laboratory testing method performs accurately under local lab conditions (checking precision, detection limits, and repeatability).",
        "Clinical trial verification: Audits medical trial data against original patient medical records to ensure research data accuracy and subject safety.",
        "Equipment & calibration verification: Periodically tests laboratory instruments, scales, and sensors against known reference standards to ensure ongoing measurement precision.",
      ],
    },
  ],
} as const;

export const INSPECTIONS_VERIFICATION_SUMMARY = {
  title: "Summary comparison of verification types",
  rows: [
    {
      type: "Quality & manufacturing",
      focus: "Physical specs, tolerances, materials",
      goal: "Zero-defect production and contract compliance",
    },
    {
      type: "Software & systems",
      focus: "Code logic, system behavior, unit tests",
      goal: "Defect-free execution against technical specs",
    },
    {
      type: "Financial & KYB/KYC",
      focus: "Identity, legal standing, funds",
      goal: "Fraud prevention, AML, and regulatory compliance",
    },
    {
      type: "Cybersecurity",
      focus: "Access credentials, hashes, encryption",
      goal: "Data integrity and system security",
    },
    {
      type: "Compliance & regulatory",
      focus: "Standards, environmental rules, trade laws",
      goal: "Legal authorization and audit readiness",
    },
    {
      type: "Scientific & clinical",
      focus: "Lab instruments, test data, methodologies",
      goal: "Repeatable, scientifically accurate results",
    },
  ],
} as const;

export const INSPECTIONS_COMMODITY_VALIDATION = {
  title: "Commodity validation",
  lead:
    "Yes, validation is heavily used in international commodity trading. However, because bulk commodities (like grains, refined sugar, edible oils, petroleum, and metals) are high-value and traded across borders under strict specifications, the industry makes a clear distinction between verification and validation.",
  distinction: {
    verification:
      "Inspection & verification answer: \"Is this specific batch of sugar, oil, or grain compliant with the contract specs right now?\" (e.g., checking ICUMSA rating, moisture content, or volume).",
    validation:
      "Validation answers: \"Are our underlying operational processes, supply chain models, legal structures, and digital trading systems designed correctly so trades occur without catastrophic loss?\"",
  },
  intro: "Validation in commodity trading spans five core operational areas:",
  areas: [
    {
      n: 1,
      title: "Trade & financial model validation",
      lead:
        "Before executing bulk shipments, commodity trading firms and trade finance institutions must validate the financial and operational feasibility of a deal.",
      bullets: [
        "LC & trade finance validation: Verifying and validating Letter of Credit (LC) terms to ensure they match International Chamber of Commerce (ICC) rules (e.g., UCP 600) and that all required shipping documents (Bill of Lading, Certificate of Origin, Phytosanitary Certificate) can be legitimately fulfilled.",
        "Proof of funds (POF) / bank comfort letter (BCL) validation: Confirming that a buyer's financial instrument is issued by a prime top-tier bank and that credit lines are active before allocating physical cargo.",
        "Mark-to-market (MTM) & VaR model validation: Commodities use complex mathematical models to calculate Value-at-Risk (VaR) and exposure to price volatility. Quantitative risk teams must run model validation to prove that pricing algorithms accurately reflect real-world market movements.",
      ],
    },
    {
      n: 2,
      title: "Supply chain & origin validation",
      lead:
        "In modern global trade, buyers and regulatory authorities demand proof of where commodities come from and how they were produced.",
      bullets: [
        "Deforestation & sustainability validation: Regulations (like the EU Deforestation Regulation — EUDR) require validation of satellite geolocation data to confirm that soft commodities (palm oil, soy, coffee, timber) were not grown on recently deforested land.",
        "Certificate of origin (COO) validation: Ensuring the supply chain route matches trade agreements to validate tariff preferences (e.g., USMCA, CETA) and prevent illegal transshipment or country-of-origin fraud.",
        "Ethical & traceability validation: Validating that supply chains comply with ESG standards, Fair Trade guidelines, or labor regulations (e.g., confirming palm oil or cocoa supply chains are child-labor free).",
      ],
    },
    {
      n: 3,
      title: "Laboratory & testing method validation",
      lead:
        "Physical inspections of commodities rely on lab analysis by independent superintendents (such as SGS, Bureau Veritas, or Intertek). For those test results to be legally binding, the testing processes themselves must be validated.",
      bullets: [
        "Method validation (ISO 17025): Validating that the testing methodology (e.g., gas chromatography for edible oils, polarimetry for refined cane sugar, or spectrophotometry for color grading) consistently yields accurate, repeatable results under laboratory conditions.",
        "Calibration & system validation: Ensuring that equipment—such as automated grain moisture meters or weighbridge scales—is calibrated against international standards so that weight and quality certificates hold up in international arbitration (e.g., GAFTA or FOSFA rules).",
      ],
    },
    {
      n: 4,
      title: "CTRM & digital system validation",
      lead:
        "Commodity trading relies heavily on CTRM (Commodity Trading and Risk Management) platforms and automated trade vault systems.",
      bullets: [
        "Data integrity & workflow validation: Validating that software systems accurately auto-generate contracts, route approvals, enforce risk limits, and track vessel movements without data corruption.",
        "API & integration validation: Testing integrations between internal ERPs, banking networks (SWIFT), and port logistics databases to ensure real-time inventory tracking and order status updates are accurate.",
      ],
    },
    {
      n: 5,
      title: "Counterparty & compliance validation (KYC/KYB)",
      lead: "Global trade involves complex international compliance requirements to avoid sanctions and financial fraud.",
      bullets: [
        "KYB (Know Your Business) validation: Formally validating corporate registration, corporate structure, legal representation, and Ultimate Beneficial Owners (UBOs) of trading partners.",
        "Sanctions & PEP validation: Cross-checking trade counterparties, shipping vessels, and maritime IMO numbers against international sanctions lists (e.g., OFAC, EU, UN) before signing Sale and Purchase Agreements (SPAs).",
      ],
    },
  ],
} as const;

export const INSPECTIONS_COMMODITY_COMPARISON = {
  title: "Summary of verification vs. validation in commodities",
  rows: [
    {
      aspect: "Inspection & verification",
      focus: "The cargo / specific batch",
      question:
        "\"Does this vessel's sugar load meet ICUMSA 45 specs right now?\"",
      examples: "Draft surveys, moisture checks, container loading counts.",
    },
    {
      aspect: "Validation",
      focus: "The system, process, or model",
      question: "\"Is our lab testing method scientifically accurate and ISO-certified?\"",
      examples: "CTRM system testing, EUDR deforestation tracking, CTRM algorithm checks.",
    },
  ],
} as const;

export const INSPECTIONS_CTA = {
  title: "Align inspection scope with your trade programme",
  lead:
    "Share commodity, quantity, corridor, and contractual milestones — our trade desk can help align independent inspection and documentation with your execution protocol.",
  shareTitle: "What to include in your enquiry",
  shareItems: [
    "Inspection timing (incoming, in-process, pre-shipment, loading)",
    "Methodology scope (visual, NDT, dimensional, laboratory)",
    "Regulatory, documentary, and LC requirements",
    "Commodity validation and counterparty KYB milestones",
    "Destination, parcel size, and Incoterms (FOB / CIF)",
  ],
  primaryLabel: "Contact the trade desk",
  primaryHref: "/contact",
  secondaryLabel: "Trade resources",
  secondaryHref: "/resources",
} as const;
