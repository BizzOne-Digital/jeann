export type {
  PageFieldType,
  PageFieldDef,
  PageSectionDef,
  PageRegistryEntry,
  EditablePage,
} from "@/lib/content/page-registry-section";
import { buildPageSection } from "@/lib/content/page-registry-section";
import type { PageRegistryEntry } from "@/lib/content/page-registry-section";
import { mergeMarketingPageBodies } from "@/lib/content/page-registry-bodies";
import { ABOUT_HERO } from "@/lib/content/about-content";
import { homeRegistrySections } from "@/lib/marketing/home-cms";

const section = buildPageSection;

const BASE_MARKETING_PAGE_REGISTRY: PageRegistryEntry[] = [
  {
    slug: "home",
    title: "Homepage",
    path: "/",
    seoTitle: "Finekarts — Global agricultural commodity distribution",
    seoDescription:
      "Finekarts Incorporated is a bulk agricultural commodity distributor and trader selling to qualified international buyers — with coordinated due diligence, inspection, CIF carriage, and bankable ICC-aligned payment structures.",
    sections: homeRegistrySections(),
  },
  {
    slug: "about",
    title: "About",
    path: "/about",
    seoTitle: "About Finekarts Incorporated",
    seoDescription: ABOUT_HERO.description,
    sections: [
      section("hero", "Hero", {
        eyebrow: ABOUT_HERO.eyebrow,
        title: ABOUT_HERO.title,
        description: ABOUT_HERO.description,
        primaryCtaLabel: ABOUT_HERO.primaryCtaLabel,
        primaryCtaHref: ABOUT_HERO.primaryCtaHref,
        secondaryCtaLabel: ABOUT_HERO.secondaryCtaLabel,
        secondaryCtaHref: ABOUT_HERO.secondaryCtaHref,
      }),
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    path: "/contact",
    seoTitle: "Contact Finekarts",
    seoDescription: "Reach the Finekarts trade desk for qualified buyer enquiries.",
    sections: [
      section("hero", "Hero", {
        title: "Speak with our team",
        description:
          "Qualified buyers reach the trade desk for bulk programmes — listed products and on-demand orders. Sign in to submit purchase requests, book consultations, and track enquiries.",
        primaryCtaLabel: "Buyer sign in →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Register",
        secondaryCtaHref: "/register/buyer",
      }),
      section("channels", "Contact channels", {
        eyebrow: "How to reach us",
        title: "Choose the right path for your enquiry",
        body: "Purchase requests and consultations use the buyer portal. General enquiries and careers use the form or email — we respond with next steps, not binding offers.",
        // One card per line: "Title: text | Link label | /href"
        items:
          "Purchase requests: RFQs, specifications, Incoterms, and logistics discussions for signed-in buyers. | Sign in to submit | /login\n" +
          "Consultations: Request a trade desk conversation. Preferred times are confirmed by staff only. | Book via buyer portal | /login\n" +
          "Trade assurance: Dispute resolution, CIF responsibilities, and PSA documentation — read before you contract. | Dispute resolution | /dispute-resolution",
      }),
      section("message", "Message form", {
        eyebrow: "Message",
        title: "Send a message",
        body: "Tell us who you are, which department should receive the note, and what you need. Submitting a message does not create a binding trade commitment.",
      }),
      section("cta", "CTA", {
        title: "Prefer to start with a purchase request?",
        body: "Share product, quantity, destination, and preferred Incoterms. Submission does not guarantee acceptance or pricing.",
        primaryCtaLabel: "Buyer sign in",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Browse products",
        secondaryCtaHref: "/products",
        image: "/images/contact/enquiry-cta.jpg",
      }),
    ],
  },
  {
    slug: "resources",
    title: "Resources",
    path: "/resources",
    seoTitle: "Trade resources",
    seoDescription: "Educational reference for trade documents, terminology, and process notes.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Trade reference",
        title: "Resources",
        description:
          "CIF trade insurance, PSA banking clauses, ICC payment structures, and trade documents — plus dispute resolution and responsibilities. Purchase requests go through the buyer portal.",
        primaryCtaLabel: "Buyer portal sign-in →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Register as buyer",
        secondaryCtaHref: "/register/buyer",
      }),
    ],
  },
  {
    slug: "dispute-resolution",
    title: "Dispute resolution",
    path: "/dispute-resolution",
    seoTitle: "Dispute resolution & trade assurance",
    seoDescription:
      "ICC-aligned dispute resolution, seller and buyer responsibilities, quality and safety, PSA documentation, and payment flexibility for Finekarts bulk commodity buyers.",
    sections: [
      section("hero", "Hero", {
        title: "Trade assurance & dispute handling",
        description:
          "How Finekarts approaches commercial disagreements, contractual responsibilities under FOB and CIF, and alignment with ICC frameworks where the PSA provides.",
        primaryCtaLabel: "Contact trade desk",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Payment reference",
        secondaryCtaHref: "/resources#resources-hub",
      }),
    ],
  },
  {
    slug: "partners",
    title: "Partners",
    path: "/partners",
    seoTitle: "Producer & manufacturer partnerships",
    seoDescription:
      "Partner with Finekarts on bulk commodity export programmes — scale, quality, and regulatory discipline for international buyers.",
    sections: [
      section("hero", "Hero", {
        title: "Partner with Finekarts on export programmes",
        description:
          "Finekarts sells bulk agricultural and food commodities to qualified international buyers. We work with established farms, aggregators, processors, and manufacturers who can meet contract specifications and volume commitments.",
        primaryCtaLabel: "Explore programmes →",
        primaryCtaHref: "#partner-programmes",
        secondaryCtaLabel: "Supplier enquiry",
        secondaryCtaHref: "/supplier-offer",
      }),
    ],
  },
  {
    slug: "products",
    title: "Products",
    path: "/products",
    seoTitle: "Products & categories",
    seoDescription: "Bulk agricultural commodity categories and example specifications.",
    sections: [
      section("hero", "Hero", {
        title: "Commodities we trade",
        description:
          "Bulk supply only — browse edible oils, sugar, rice & grains, beans, coffee, spices, and related programmes. Minimum order volumes apply by category. Specifications are confirmed with the trade desk.",
        primaryCtaLabel: "Click here to ORDER →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Browse catalog",
        secondaryCtaHref: "#catalog",
      }),
    ],
  },
  {
    slug: "packaging",
    title: "Packaging",
    path: "/packaging",
    seoTitle: "Bulk packaging & containment",
    seoDescription:
      "Dry soft, liquid, and hard commodity packaging — FIBCs, flexitanks, ISO tanks, IBC totes, drums, vessel holds, and breakbulk containment for international trade.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Bulk packaging & containment",
        title: "Packaging formats for international commodity trade",
        description:
          "Correct packaging preserves cargo quality, prevents contamination, optimizes FCL/flat rack/bulk freight, and supports IMO, SOLAS, and ISO compliance.",
        primaryCtaLabel: "Explore packaging types →",
        primaryCtaHref: "#packaging-overview",
        secondaryCtaLabel: "Logistics",
        secondaryCtaHref: "/logistics",
      }),
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    path: "/logistics",
    seoTitle: "Trade logistics coordination",
    seoDescription:
      "Finekarts is a bulk commodity trader that coordinates FOB and CIF shipping, documentation, and tracking with carriers and forwarders — not a freight operator.",
    sections: [
      section("hero", "Hero", {
        title: "Moving commodities from origin to destination",
        description:
          "FOB and CIF are our primary Incoterms® on programmes we sell — we coordinate marine cargo insurance and main carriage with insurers and carriers to the named port. Documentation aligns with the signed PSA and LC where applicable.",
      }),
    ],
  },
  {
    slug: "inspections",
    title: "Inspections",
    path: "/inspections",
    seoTitle: "Inspections overview",
    seoDescription:
      "Inspection types by timing, methodology, and scope — plus commodity verification and validation in international trade.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Inspections",
        title: "Structured examination for standards & requirements",
        description:
          "A structured physical examination or critical review to determine if a system, product, or process meets specific standards and requirements.",
        primaryCtaLabel: "Explore inspection types →",
        primaryCtaHref: "#inspection-types",
        secondaryCtaLabel: "Operational insights guide",
        secondaryCtaHref: "/insights",
      }),
    ],
  },
  {
    slug: "verification",
    title: "Verification",
    path: "/verification",
    seoTitle: "Due diligence profile & verification",
    seoDescription:
      "Corporate identity, supply chain risk, documentation requirements, and SWIFT trade finance message types for Finekarts Incorporated commodity programmes.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Due diligence profile & verification",
        title: "Structured counterparty and trade verification",
        description:
          "Evaluation scope: corporate governance, financial health, supply chain integrity, and sanctions/compliance screening for global commodity trade.",
        primaryCtaLabel: "Explore diligence framework →",
        primaryCtaHref: "#due-diligence-overview",
        secondaryCtaLabel: "Contact trade desk",
        secondaryCtaHref: "/contact",
      }),
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    path: "/faq",
    seoTitle: "Frequently asked questions",
    seoDescription: "Answers to common questions about Finekarts and bulk commodity trade.",
    sections: [
      section("hero", "Hero", FAQ_HERO_DEFAULTS),
      section("cta", "Bottom buttons (below questions)", FAQ_CTA_DEFAULTS),
    ],
  },
  {
    slug: "insights",
    title: "Insights",
    path: "/insights",
    seoTitle: "Global commodity trade & quality assurance",
    seoDescription:
      "Deep technical and operational insights on verification, validation, inspection protocols, containment logistics, and trade execution SOPs.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Deep technical & operational insights",
        title: "Global commodity trade & quality assurance",
        description:
          "Quality verification, process validation, and bulk containment logistics — an actionable framework for trade execution, risk mitigation, and operational governance.",
        primaryCtaLabel: "Explore the framework →",
        primaryCtaHref: "#insights-framework",
        secondaryCtaLabel: "SOP checklist",
        secondaryCtaHref: "#insights-sop-checklist",
      }),
    ],
  },
  {
    slug: "team",
    title: "Team",
    path: "/team",
    seoTitle: "Our team",
    seoDescription: "Finekarts trade desk and leadership profiles.",
    sections: [
      section("hero", "Hero", TEAM_HERO_DEFAULTS),
      section("board-intro", "Team intro (above members)", TEAM_INTRO_DEFAULTS),
      section("footer-links", "Footer links (Careers / Contact)", TEAM_FOOTER_DEFAULTS),
    ],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    path: "/testimonials",
    seoTitle: "Testimonials",
    seoDescription: "Approved client testimonials with name, role, company and photo.",
    sections: [
      section("hero", "Hero", TESTIMONIALS_HERO_DEFAULTS),
      section("cta", "Contact line (below testimonials)", TESTIMONIALS_CTA_DEFAULTS),
    ],
  },
  {
    slug: "booking",
    title: "Booking",
    path: "/booking",
    seoTitle: "Book a consultation",
    seoDescription: "Request a trade desk consultation through the buyer portal.",
    sections: [
      section("hero", "Hero", BOOKING_HERO_DEFAULTS),
      section("schedule", "Schedule a conversation", BOOKING_SCHEDULE_DEFAULTS),
      section("portal-gate", "Consultation booking box", BOOKING_PORTAL_GATE_DEFAULTS),
    ],
  },
  {
    slug: "careers",
    title: "Careers",
    path: "/careers",
    seoTitle: "Careers",
    seoDescription: "Career opportunities and applications at Finekarts Incorporated.",
    sections: [
      section("hero", "Hero", CAREERS_HERO_DEFAULTS),
      section("intro", "Intro (image + application intake)", CAREERS_INTRO_DEFAULTS),
      section("pillars", "Three pillar cards", CAREERS_PILLARS_DEFAULTS),
      section("application", "Application heading & portal account", CAREERS_APPLICATION_DEFAULTS),
      section("equal-opportunity", "Equal opportunity band", CAREERS_EQUAL_OPPORTUNITY_DEFAULTS),
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    path: "/cookies",
    seoTitle: "Cookie notice",
    seoDescription: "Finekarts cookie policy.",
    sections: [
      section("hero", "Hero", COOKIES_HERO_DEFAULTS),
      section("notice", "Important notice banner", LEGAL_NOTICE_DEFAULTS),
      section("intro", "Intro paragraph", COOKIES_INTRO_DEFAULTS),
      section("essential", "Essential cookies", COOKIES_ESSENTIAL_DEFAULTS),
      section("analytics", "Analytics", COOKIES_ANALYTICS_DEFAULTS),
      section("preferences", "Managing preferences", COOKIES_PREFERENCES_DEFAULTS),
    ],
  },
  {
    slug: "buyer-terms",
    title: "Buyer terms",
    path: "/buyer-terms",
    seoTitle: "Buyer terms",
    seoDescription: "Terms for buyer portal registration and submissions.",
    sections: [
      section("hero", "Hero", BUYER_TERMS_HERO_DEFAULTS),
      section("notice", "Important notice banner", LEGAL_NOTICE_DEFAULTS),
      section("intro", "Intro paragraph", BUYER_TERMS_INTRO_DEFAULTS),
      section("non-binding", "Non-binding enquiries", BUYER_TERMS_NON_BINDING_DEFAULTS),
      section("representations", "Representations", BUYER_TERMS_REPRESENTATIONS_DEFAULTS),
      section("confidentiality", "Confidentiality", BUYER_TERMS_CONFIDENTIALITY_DEFAULTS),
      section("documents", "Download panel", BUYER_TERMS_DOCUMENTS_DEFAULTS),
    ],
  },
  {
    slug: "buyer-request",
    title: "Buyer purchase request",
    path: "/buyer-request",
    seoTitle: "Buyer purchase request",
    seoDescription:
      "How qualified buyers submit bulk commodity purchase requests and on-demand programmes through the Finekarts buyer portal.",
    sections: [
      section("hero", "Hero", BUYER_REQUEST_HERO_DEFAULTS),
      section("steps", "How buyer requests work", BUYER_REQUEST_STEPS_DEFAULTS),
      section("form-card", "Programme form card", BUYER_REQUEST_FORM_CARD_DEFAULTS),
      section("disclaimer", "Disclaimer paragraph", BUYER_REQUEST_DISCLAIMER_DEFAULTS),
    ],
  },
  {
    slug: "supplier-offer",
    title: "Supplier enquiry",
    path: "/supplier-offer",
    seoTitle: "Supplier enquiry",
    seoDescription:
      "Finekarts sources through private programmes. Supplier portal access is by invitation after diligence.",
    sections: [
      section("hero", "Hero", SUPPLIER_OFFER_HERO_DEFAULTS),
      section("invitation", "Invitation-only suppliers", SUPPLIER_OFFER_INVITATION_DEFAULTS),
      section("enquiry", "Initial enquiry box", SUPPLIER_OFFER_ENQUIRY_DEFAULTS),
      section("see-also", "Links paragraph (bottom)", SUPPLIER_OFFER_SEE_ALSO_DEFAULTS),
    ],
  },
];

export const MARKETING_PAGE_REGISTRY = mergeMarketingPageBodies(BASE_MARKETING_PAGE_REGISTRY);

export function getRegistryPage(slug: string): PageRegistryEntry | undefined {
  return MARKETING_PAGE_REGISTRY.find((p) => p.slug === slug);
}

export function listRegistryPages(): PageRegistryEntry[] {
  return MARKETING_PAGE_REGISTRY;
}
