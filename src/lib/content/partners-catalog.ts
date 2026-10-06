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
  title: "Independent firms we may appoint",
  lead:
    "Finekarts is the commodity seller — not SGS, Intertek, or any firm listed here. These are recognized inspection, testing, and certification organizations we may coordinate on trades when the PSA and corridor require documented quality, quantity, or compliance evidence.",
  note:
    "Listings show who buyers may see appointed on a programme. They do not replace your contract, bank requirements, or your own due diligence.",
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
      "On programmes where the PSA names SGS (or equivalent scope), Finekarts coordinates field attendance, sampling, and certificate presentation so quality, quantity, and loading evidence aligns with contract and LC wording.",
      "Buyers should confirm the applicable SGS office, service line, and accreditation for each port and commodity — certificates are issued by SGS under its own mandate, not by Finekarts.",
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
      "Bureau Veritas may be appointed for commodity inspection, hold or tank surveys, and laboratory analysis when destination or issuing bank requirements call for an independent third party.",
      "Documentary sets should reference the correct BV certificate type and place of issue; buyers can verify scope and authenticity directly with Bureau Veritas.",
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
      "Intertek supports loading and discharge supervision, representative sampling, and testing for oils, grains, sugar, and related bulk cargoes when agreed in the transaction.",
      "Finekarts aligns inspector mobilization with laycan and banking timelines; final certificate content remains Intertek’s responsibility under the appointed scope.",
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
      "Control Union programmes may apply where agricultural certification, identity preservation, or chain-of-custody evidence is required alongside commercial inspection.",
      "Confirm which Control Union scheme applies to your corridor and commodity before relying on certificate wording in an LC or customs filing.",
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
      "Cotecna may support pre-shipment verification, destination conformity checks, and compliance documentation on corridors where buyers or regulators expect Cotecna-recognized evidence.",
      "Appointment letters and scope should match the commodity, HS classification, and import rules for the discharge market.",
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

/** Featured on `/partners` video band (single section). */
export const PARTNERS_VIDEO_FEATURE_SLUGS = ["sgs", "bureau-veritas", "cfia-inspection"] as const;

export function getPartners() {
  return PARTNERS;
}

export function getPartnersVideoFeatures(): PartnerEntry[] {
  return PARTNERS_VIDEO_FEATURE_SLUGS.map((slug) => getPartner(slug)).filter(
    (p): p is PartnerEntry => p != null,
  );
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
