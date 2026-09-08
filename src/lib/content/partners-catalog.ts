export type PartnerEntry = {
  slug: string;
  name: string;
  /** One-line intro shown directly under the partner name */
  intro: string;
  category: "inspection" | "certification" | "verification" | "other";
  /** Partner photo — upload to public/images/partners/ e.g. sgs.jpg */
  photoSrc?: string;
  photoAlt?: string;
  /** Optional YouTube overview when no partner photo is uploaded yet */
  youtubeVideoId?: string;
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
    youtubeVideoId: "gADVpRPdr7E",
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
    youtubeVideoId: "zScbiOe7-oY",
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
    youtubeVideoId: "lKfVooP59Jk",
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
    youtubeVideoId: "HcmbcuxTpYA",
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
    youtubeVideoId: "hr-lVK3rfNo",
    content: [
      "Add partnership details — pre-shipment, destination inspection, and compliance notes for corridors you serve with Cotecna.",
    ],
    website: "https://www.cotecna.com",
  },
  {
    slug: "cfia-inspection",
    name: "CFIA Inspection",
    intro: "Canadian Food Inspection Agency programmes for agricultural commodities, food safety, and import compliance.",
    category: "inspection",
    youtubeVideoId: "JI7IaQhlD10",
    content: [
      "Finekarts coordinates inspection and documentation pathways where CFIA requirements apply to Canadian import or export corridors — including phytosanitary alignment, product identity, and certificate presentation for qualified buyers.",
      "Scope, laboratory routing, and certificate wording should be confirmed per contract, destination, and the applicable CFIA programme for your commodity.",
    ],
    website: "https://inspection.canada.ca",
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
