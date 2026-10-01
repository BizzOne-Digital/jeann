import {
  HOME_OVERVIEW_COMPANY_IMAGES,
  HOME_OVERVIEW_TRADE_IMAGES,
} from "@/lib/content/home-site-overview-images";

export type HomeOverviewTradeSection = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  bullets: readonly string[];
  href: string;
  ctaLabel: string;
  image: { src: string; alt: string };
};

export const HOME_SITE_OVERVIEW_INTRO = {
  eyebrow: "Site guide",
  title: "Every discipline behind a bulk commodity programme",
  lead:
    "Finekarts is the seller on the contract — these pages explain how banking, packaging, logistics, independent verification, and trade documents fit together before you sign in to submit a request.",
};

export const HOME_SITE_TRADE_SECTIONS: readonly HomeOverviewTradeSection[] = [
  {
    id: "resources",
    eyebrow: "Resources",
    title: "Banking clauses, payments, and document checklists",
    lead:
      "PSA banking wording, LC and SBLC structures, and educational document indexes — starting points for discussion with your bank and counsel.",
    bullets: [
      "SPA banking clause library",
      "12-month payment structure rankings",
      "Trade document groups & downloads",
    ],
    href: "/resources",
    ctaLabel: "Explore resources →",
    image: HOME_OVERVIEW_TRADE_IMAGES.resources,
  },
  {
    id: "packaging",
    eyebrow: "Packaging",
    title: "Containment matched to product and corridor",
    lead:
      "From flexitanks and ISO tanks to FIBCs, drums, and bulk vessel holds — how cargo is presented for inspection, insurance, and discharge.",
    bullets: ["Liquid & dry bulk modes", "Bagged and palletized formats", "PSA-aligned containment notes"],
    href: "/packaging",
    ctaLabel: "View packaging →",
    image: HOME_OVERVIEW_TRADE_IMAGES.packaging,
  },
  {
    id: "logistics",
    eyebrow: "Logistics",
    title: "FOB and CIF coordination — not a freight brand",
    lead:
      "We align carriers, forwarders, surveys, and shipping documents with your PSA while Finekarts remains the commodity seller.",
    bullets: ["Incoterms® 2020 programmes", "Tracking and ETA communication", "Contract-to-cargo milestones"],
    href: "/logistics",
    ctaLabel: "Trade logistics →",
    image: HOME_OVERVIEW_TRADE_IMAGES.logistics,
  },
  {
    id: "partners",
    eyebrow: "Partners",
    title: "Independent inspection & certification firms",
    lead:
      "Recognized surveyors and laboratories we may appoint when contracts require third-party quality, quantity, or compliance evidence.",
    bullets: ["SGS, Intertek, Bureau Veritas & more", "Scope defined in your PSA", "Buyer verification pathways"],
    href: "/partners",
    ctaLabel: "Verification partners →",
    image: HOME_OVERVIEW_TRADE_IMAGES.partners,
  },
  {
    id: "verification",
    eyebrow: "Due diligence",
    title: "Counterparty and programme verification",
    lead:
      "Corporate identity, supply chain integrity, sanctions screening, and SWIFT settlement context for qualified programmes.",
    bullets: ["UBO and registry checks", "Risk assessment matrix", "Documentation for final approval"],
    href: "/verification",
    ctaLabel: "Due diligence overview →",
    image: HOME_OVERVIEW_TRADE_IMAGES.verification,
  },
  {
    id: "inspections",
    eyebrow: "Inspections",
    title: "Quality and quantity evidence at origin and load",
    lead:
      "Independent inspection where the PSA requires it — sampling, hold surveys, and certificates aligned to banking deadlines.",
    bullets: ["Sugar, grains, oils & bulk cargoes", "Loading and discharge scope", "Certificate workflows"],
    href: "/inspections",
    ctaLabel: "Inspection programmes →",
    image: HOME_OVERVIEW_TRADE_IMAGES.inspections,
  },
];

export const HOME_SITE_COMPANY_LINKS = [
  {
    id: "team",
    title: "Team",
    summary: "Leadership and trade desk contacts for qualified buyer programmes.",
    href: "/team",
    ctaLabel: "Meet the team →",
    image: HOME_OVERVIEW_COMPANY_IMAGES.team,
  },
  {
    id: "faq",
    title: "FAQ",
    summary: "Answers on RFQs, Incoterms, inspection, and how the buyer portal works.",
    href: "/faq",
    ctaLabel: "Read FAQ →",
    image: HOME_OVERVIEW_COMPANY_IMAGES.faq,
  },
  {
    id: "careers",
    title: "Careers",
    summary: "Join commodity trading, operations, and compliance teams at Finekarts.",
    href: "/privacy",
    ctaLabel: "Careers portal →",
    image: HOME_OVERVIEW_COMPANY_IMAGES.careers,
  },
  {
    id: "contact",
    title: "Contact",
    summary: "Reach the trade desk for programme questions before you register or sign in.",
    href: "/contact",
    ctaLabel: "Contact us →",
    image: HOME_OVERVIEW_COMPANY_IMAGES.contact,
  },
] as const;
