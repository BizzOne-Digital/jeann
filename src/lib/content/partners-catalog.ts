export type PartnerEntry = {
  slug: string;
  name: string;
  /** One-line intro shown directly under the partner name */
  intro: string;
  category: "inspection" | "certification" | "verification" | "other";
  /** Partner photo — upload to public/images/partners/ e.g. sgs.jpg */
  photoSrc?: string;
  photoAlt?: string;
  /** Full description — one or more paragraphs (client-editable copy) */
  content: string[];
  website?: string;
};

export const PARTNERS_PAGE_INTRO = {
  title: "Verification partners",
  lead:
    "Finekarts works with internationally recognized inspection, certification, and verification organizations. Qualified buyers can use these relationships to build confidence in counterparties, cargo, and documentation.",
  note:
    "Partnership listings support transparency — they do not replace contractual inspection terms, bank requirements, or independent due diligence.",
};

/** Edit names, intros, photos, and content[] as partnerships are confirmed. */
export const PARTNERS: PartnerEntry[] = [
  {
    slug: "sgs",
    name: "SGS",
    intro: "Independent inspection, testing, and certification for commodities worldwide.",
    category: "inspection",
    content: [
      "Add your partnership narrative here — how Finekarts and buyers engage SGS for quality, quantity, and compliance verification on agricultural and bulk cargoes.",
      "Describe corridor coverage, certificate types, and how buyers can independently verify scope and accreditation for each programme.",
    ],
    website: "https://www.sgs.com",
  },
  {
    slug: "bureau-veritas",
    name: "Bureau Veritas",
    intro: "Commodity inspection and laboratory services across agriculture, food, and bulk trade.",
    category: "inspection",
    content: [
      "Add your partnership narrative here — destination-specific inspection scope, laboratory routing, and documentary alignment with LC or contract terms.",
    ],
    website: "https://www.bureauveritas.com",
  },
  {
    slug: "intertek",
    name: "Intertek",
    intro: "Cargo inspection, sampling, and analysis for oils, grains, sugar, and related bulk cargoes.",
    category: "inspection",
    content: [
      "Add your partnership narrative here — loading and discharge supervision, sampling methods, and certificate workflows relevant to Finekarts programmes.",
    ],
    website: "https://www.intertek.com",
  },
  {
    slug: "control-union",
    name: "Control Union",
    intro: "Agricultural commodity certification and inspection programmes.",
    category: "certification",
    content: [
      "Add partnership details and verification pathways — how buyers can confirm certification scope and chain-of-custody where applicable.",
    ],
    website: "https://www.controlunion.com",
  },
  {
    slug: "cotecna",
    name: "Cotecna",
    intro: "Inspection and compliance services for international trade corridors.",
    category: "verification",
    content: [
      "Add partnership details — pre-shipment, destination inspection, and compliance notes for corridors you serve with Cotecna.",
    ],
    website: "https://www.cotecna.com",
  },
  {
    slug: "more-partners",
    name: "Additional partners",
    intro: "Further verification and certification partners will be listed as agreements are confirmed.",
    category: "other",
    content: [
      "Replace this section with the company name, intro, photo, and descriptive text for each additional partner.",
    ],
  },
];

export function getPartners() {
  return PARTNERS;
}

export function getPartner(slug: string) {
  return PARTNERS.find((p) => p.slug === slug);
}

export const PARTNER_CATEGORIES = {
  inspection: "Inspection & survey",
  certification: "Certification",
  verification: "Trade verification",
  other: "Partners",
} as const;
