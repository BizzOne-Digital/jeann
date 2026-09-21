/** Due diligence topics for bulk commodity trade — Finekarts coordinates third-party checks; we are not a verification bureau. */

import { FINEKARTS_DUE_DILIGENCE_LEAD, FINEKARTS_TOOLS_DISCLAIMER } from "@/lib/content/trader-positioning";

export type VerificationService = {
  n: number;
  title: string;
  summary: string;
  intro?: string;
  items?: string[];
  body?: string;
  sections?: { title: string; text: string }[];
  note?: string;
};

export const VERIFICATION_HERO = {
  eyebrow: "Due diligence in bulk commodity trade",
  title: "Know who you are trading with",
  description: FINEKARTS_DUE_DILIGENCE_LEAD,
  primaryCta: { href: "#request-verification", label: "Contact trade desk →" },
  secondaryCta: { href: "#diligence-topics", label: "Browse diligence topics" },
};

export const GLOBAL_VERIFICATION_NETWORK = {
  title: "International diligence coverage",
  lead:
    "Finekarts is a commodity trader, not a verification agency. Where a programme requires it, we coordinate trusted third-party providers and commercial intelligence to evaluate counterparties operating across:",
  regions: [
    "North America",
    "South America",
    "Europe",
    "Middle East",
    "Africa",
    "Asia",
    "Oceania",
  ],
  note: "Verification scope depends on the country, availability of public records, regulatory requirements and the specific due-diligence package requested.",
};

export const REAL_TIME_INTELLIGENCE = {
  title: "Real-time business intelligence",
  lead: "Business information can change quickly. Companies may change ownership, directors, registered addresses, legal status, licenses, import/export permissions, operating status, financial condition, credit profile, manufacturing capacity, distribution networks and banking relationships.",
  note:
    "Where supported by the relevant data source, registry and intelligence feeds we rely on can incorporate current or recently updated information to support trade decisions.",
  disclaimer:
    "Verification results should always be understood as a point-in-time assessment, not a permanent guarantee of future performance.",
};

export const VERIFICATION_SERVICES: VerificationService[] = [
  {
    n: 1,
    title: "Corporate Registration Verification",
    summary:
      "Verify available government and corporate-registration information to establish whether the entity presented during negotiations corresponds with a legally registered business.",
    intro: "Coordinated third-party diligence may confirm information including:",
    items: [
      "Legal company name, registration number and date of incorporation",
      "Company status, registered jurisdiction and registered address",
      "Directors and officers, legal entity type and business activities",
      "Parent or subsidiary relationships where available",
    ],
  },
  {
    n: 2,
    title: "Government Registration Verification",
    summary:
      "Depending on jurisdiction, verification may include available government databases and official records.",
    intro: "Records may relate to:",
    items: [
      "Business, tax and VAT/GST registration",
      "Customs registration and regulatory registrations",
      "Industry licenses and food/agricultural registrations",
      "Manufacturing registrations, export and import registrations",
    ],
    note: "Where possible, information is checked against official government or regulatory sources.",
  },
  {
    n: 3,
    title: "Import & Export License Verification",
    summary:
      "For international commodity transactions, the ability to legally import or export a product can be critical.",
    intro: "Verification may include available evidence of:",
    items: [
      "Import and export licenses, customs registration",
      "Commodity-specific permits and food-import authorization",
      "Agricultural permits, phytosanitary requirements",
      "Customs identification, authorized exporter status and destination-market registrations",
    ],
    note: "Particularly relevant for food, agricultural commodities, edible oils, sugar, rice, grains, meat and other regulated products.",
  },
  {
    n: 4,
    title: "Supplier Verification",
    summary:
      "Before committing to a supplier, clients may request verification of who they are, where they operate, what they produce, what they can supply and whether documentation is consistent with available records.",
    intro: "Supplier verification may include:",
    items: [
      "Corporate identity, ownership and facility location",
      "Production capability, warehouse capacity and product portfolio",
      "Export capability, certifications and operating history",
      "Trade references, previous shipment information and independent site verification where requested",
    ],
  },
  {
    n: 5,
    title: "Manufacturer Verification",
    summary:
      "A supplier claiming to be a manufacturer should be evaluated differently from a trading intermediary.",
    intro: "Independent checks coordinated for the transaction may help establish:",
    items: [
      "Manufacturing location, factory existence and production activities",
      "Production capacity, processing equipment and storage facilities",
      "Quality-management systems, certifications and product categories",
      "Operational status — with independent on-site inspection or factory auditing where required",
    ],
  },
  {
    n: 6,
    title: "Distributor & Trading Company Verification",
    summary:
      "Third-party diligence may be coordinated to assess distributors, wholesalers, brokers, and trading companies involved in a programme.",
    intro: "Verification may include:",
    items: [
      "Legal existence, business activities and distribution capabilities",
      "Warehousing, market presence and operating history",
      "Trade references and customer/supplier relationships where independently verifiable",
      "Geographic coverage and import/export capabilities",
    ],
    note: "This can help distinguish an established trading company from an entity that may have limited operational capacity.",
  },
  {
    n: 7,
    title: "Buyer Verification",
    summary:
      "A buyer's ability to perform is just as important as a supplier's ability to deliver.",
    intro: "Buyer due diligence can include available information regarding:",
    items: [
      "Corporate registration, business history and ownership",
      "Operating activities, credit information and trade references",
      "Payment history and financial indicators where available",
      "Import activity, market presence, regulatory status and sanctions/compliance screening",
    ],
    note: "This helps suppliers evaluate the commercial risk associated with extending credit, accepting deferred payment or entering into long-term supply agreements.",
  },
  {
    n: 8,
    title: "Creditworthiness & Financial Due Diligence",
    summary:
      "Where legally available and permitted, commercial credit information relating to counterparties may be obtained through licensed intelligence providers.",
    intro: "Depending on the market and available data, reports may include:",
    items: [
      "Credit rating and credit limit recommendations",
      "Payment history, outstanding obligations and financial indicators",
      "Company age, financial strength indicators and insolvency information",
      "Trade payment behavior and credit risk assessment",
    ],
    note: "Credit information is not a guarantee of payment. It is one component of a broader commercial-risk assessment.",
  },
  {
    n: 9,
    title: "Supply Chain Verification",
    summary:
      "A commodity transaction can involve multiple parties from producer through logistics provider.",
    body:
      "Producer → Manufacturer/Processor → Supplier → Trader → Distributor → Buyer → Logistics Provider. Relevant participants may be mapped and checked through independent sources where scope allows.",
    intro: "The objective is to identify:",
    items: [
      "Who owns the product and who produces it",
      "Who controls inventory and is authorized to sell it",
      "Where the commodity is located",
      "Who is responsible for transportation and who issues commercial documentation",
    ],
    note: "This can reduce confusion and improve transaction transparency.",
  },
  {
    n: 10,
    title: "Facility & Physical Presence Verification",
    summary:
      "Where required, an independent verification visit may be arranged to establish whether a stated facility exists and appears operational.",
    intro: "A site verification may document:",
    items: [
      "Facility address, exterior/interior condition and signage",
      "Production areas, warehouses, storage tanks and equipment",
      "Loading areas, inventory observations and photographs",
      "Video evidence where permitted, date and time of visit",
    ],
    note: "Physical presence verification does not, by itself, prove ownership of inventory or guarantee production capacity. Those matters require appropriate documentary and/or independent commodity verification.",
  },
  {
    n: 11,
    title: "Certification & License Verification",
    summary:
      "Companies frequently provide certificates during international transactions.",
    intro: "Depending on product and jurisdiction, documentary review coordinated with specialists may cover:",
    items: [
      "ISO, HACCP, GMP and food-safety certifications",
      "Organic and Halal certifications",
      "Phytosanitary documentation, export certificates and import permits",
      "Industry licenses, inspection certificates and laboratory certificates",
    ],
    note: "The objective is to determine whether the certificate appears consistent with the issuing organization's records and the scope claimed.",
  },
  {
    n: 12,
    title: "Compliance & Sanctions Screening",
    summary:
      "International transactions may involve significant regulatory and compliance risks.",
    intro: "Where available, due diligence may include screening against relevant:",
    items: [
      "Sanctions lists and restricted-party lists",
      "Government enforcement databases and regulatory actions",
      "Insolvency records, fraud indicators and adverse legal information",
      "Politically exposed-person information where legally appropriate",
      "Other relevant compliance databases",
    ],
    note: "Screening is performed subject to applicable laws, data availability and jurisdictional limitations.",
  },
  {
    n: 13,
    title: "Commodity Availability Verification",
    summary:
      "A legitimate company does not necessarily mean that the commodity exists. For large transactions, Finekarts recommends separating company verification from commodity verification.",
    sections: [
      {
        title: "Company verification",
        text: "Does the business exist and have the claimed capability?",
      },
      {
        title: "Commodity verification",
        text: "Does the specific commodity actually exist, meet specifications and have the claimed quantity? This may involve an independent inspection company conducting physical inventory inspection, sampling, laboratory testing, quantity measurement, warehouse inspection, tank measurement, draft survey or loading supervision.",
      },
    ],
  },
  {
    n: 14,
    title: "Independent Inspection Partners",
    summary:
      "Where appropriate, Finekarts appoints recognized independent inspection and diligence firms — we are the trader coordinating them, not the inspection or verification company.",
    intro: "Potential inspection organizations may include:",
    items: ["SGS", "Intertek", "Bureau Veritas", "Cotecna", "Control Union", "CCIC"],
    note: "The inspection organization is selected according to commodity, country, location, inspection scope and contractual requirements. Use of an organization's name or logo does not imply endorsement, affiliation or partnership unless formally authorized.",
  },
];

export const VERIFICATION_HUB_INTRO =
  "Finekarts sells bulk commodities — these topics explain the independent checks and intelligence we may coordinate before or during a trade. We are not a verification or credit-rating agency; scope is agreed per transaction.";

export const VERIFICATION_PILLARS = [
  {
    id: "registration",
    title: "Registration & licensing",
    summary: "Corporate identity, government records, and import/export permissions.",
    icon: "document",
    image: "/images/about/team-strategy-meeting.png",
    imageAlt: "Trade desk team reviewing corporate registration and licensing records",
    accent: { main: "#1b7a4a", light: "#edf7f1", ring: "#1b7a4a" },
    serviceNumbers: [1, 2, 3],
  },
  {
    id: "counterparties",
    title: "Trading counterparties",
    summary: "Origin, manufacturer, and supply-chain due diligence for bulk programmes.",
    icon: "users",
    image: "/images/about/team-collaboration.png",
    imageAlt: "Trade desk reviewing supply-chain verification documentation",
    accent: { main: "#1e4d8f", light: "#eef3fa", ring: "#1e4d8f" },
    serviceNumbers: [4, 5, 6, 7],
  },
  {
    id: "risk",
    title: "Risk & operations",
    summary: "Credit, supply chain, facilities, certifications, and our six-step framework.",
    icon: "shield",
    image: "/images/inspections/warehouse-bulk-inspection.png",
    imageAlt: "Warehouse bulk inspection for operational verification",
    accent: { main: "#c88e4a", light: "#fff9ef", ring: "#c88e4a" },
    serviceNumbers: [8, 9, 10, 11],
  },
  {
    id: "compliance",
    title: "Compliance & reports",
    summary: "Sanctions screening, commodity proof, inspection partners, and report structure.",
    icon: "check",
    image: "/images/inspections/cargo-inspector-loading.png",
    imageAlt: "Cargo loading supervision and commodity verification",
    accent: { main: "#c41e3a", light: "#fdf0f2", ring: "#c41e3a" },
    serviceNumbers: [12, 13, 14],
  },
] as const;

export type VerificationPillarId = (typeof VERIFICATION_PILLARS)[number]["id"];

export const VERIFICATION_FRAMEWORK_STEPS = [
  { step: 1, title: "Identify", text: "Confirm the legal identity of the counterparty." },
  { step: 2, title: "Validate", text: "Check available government, regulatory and commercial records." },
  { step: 3, title: "Verify", text: "Compare company claims against independent information." },
  { step: 4, title: "Assess", text: "Review operational capability, licenses, credit information and relevant risk indicators." },
  { step: 5, title: "Inspect", text: "Where required, arrange independent on-site or commodity inspection." },
  { step: 6, title: "Report", text: "Independent providers issue structured diligence reports identifying verified information, supporting sources, discrepancies, and areas requiring additional review." },
];

export const VERIFICATION_REPORT_SECTIONS = [
  { title: "Company profile", text: "Legal identity and corporate information." },
  { title: "Registration", text: "Government and corporate registration findings." },
  { title: "Licenses", text: "Import, export and industry-specific licensing." },
  { title: "Operations", text: "Facilities, manufacturing and distribution capabilities." },
  { title: "Financial & credit information", text: "Available commercial credit and financial indicators." },
  { title: "Supply chain", text: "Relevant producers, suppliers, distributors and logistics participants." },
  { title: "Compliance", text: "Sanctions, regulatory and adverse-information screening." },
  { title: "Inspection", text: "Independent inspection findings where commissioned." },
  { title: "Risk indicators", text: "Identified inconsistencies, gaps or areas requiring further investigation." },
  { title: "Verification status", text: "A clear indication of what has been independently verified, what is based on documentary evidence and what remains unverified." },
];

export const VERIFICATION_NOT_GUARANTEE = {
  title: "Due diligence is not a guarantee",
  lead: `${FINEKARTS_TOOLS_DISCLAIMER} Coordinated checks and reports do not guarantee:`,
  items: [
    "Future financial performance or payment",
    "Delivery, product availability or product ownership",
    "Contract performance or solvency after the verification date",
    "Absence of undisclosed liabilities or future regulatory compliance",
  ],
  note: "Clients should use verification findings together with appropriate legal, financial, banking, insurance, inspection and trade advice before entering significant transactions.",
};

export const VERIFICATION_CTA = {
  title: "Discuss due diligence for your programme",
  lead:
    "Tell us about your commodity, counterparty, and corridor. Finekarts will explain which independent verification, inspection, and documentation steps apply to a potential trade — before contract.",
  tagline: "Trader first. Evidence-backed programmes.",
  fields: ["Company name", "Country", "Counterparty role", "Commodity", "Verification scope", "Urgency"],
};
