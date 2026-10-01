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
import { FINEKARTS_TRADE_SAFEGUARDS } from "@/lib/content/trader-positioning";

const section = buildPageSection;

const BASE_MARKETING_PAGE_REGISTRY: PageRegistryEntry[] = [
  {
    slug: "home",
    title: "Homepage",
    path: "/",
    seoTitle: "Finekarts — Global agricultural commodity distribution",
    seoDescription:
      "Finekarts Incorporated is a bulk agricultural commodity distributor and trader selling to qualified international buyers — with coordinated due diligence, inspection, CIF carriage, and bankable ICC-aligned payment structures.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Bulk commodities • Documented programmes • Worldwide delivery",
        title: "Bulk Agricultural Commodities for Qualified Buyers",
        description:
          "Finekarts supplies edible oils, sugar, rice, beans, and related cargoes for sale to qualified international buyers. " +
          FINEKARTS_TRADE_SAFEGUARDS,
        primaryCtaLabel: "Browse products",
        primaryCtaHref: "/products",
        secondaryCtaLabel: "Buyer portal",
        secondaryCtaHref: "/login",
        youtubeVideoId: "gADVpRPdr7E",
      }),
      section("connection", "Connection", {
        eyebrow: "Who we are",
        title: "Selling bulk commodities with trust at the centre",
        body:
          "Finekarts Incorporated is a distributor: every product listed on this site is offered for sale to qualified bulk buyers. We are not a marketplace and we do not connect unrelated buyers with unrelated sellers.",
        body2:
          "Origin relationships stay private. What we publish is how we trade — using independent verification, inspection, carriers, and marine insurance where contracts require them, not selling those capabilities as Finekarts-branded services.",
        image1: "/images/home-1.png",
        image2: "/images/home-2.png",
      }),
      section("commodities", "Commodities we trade", {
        eyebrow: "Products we sell",
        title: "Listed grades and on-demand purchase programmes",
        body: "Every category on this site is offered for sale. Standard listings show typical specifications; on-demand orders are structured when volume, corridor, and banking support a dedicated programme.",
      }),
      section("sourced", "Sourced responsibly", {
        eyebrow: "Sourced responsibly",
        title: "Quality coordination across origins and corridors",
        body: "Supply is supported through private origin programmes and independent inspection partners where contracts require them — building buyer confidence without advertising supplier identities on this site.",
        image: "/images/home-3.png",
      }),
      section("process", "Process timeline", {
        eyebrow: "How we work",
        title: "From enquiry to structured trade execution",
        body: "Enquiry, qualification, contract, Irrevocable LC / SBLC where agreed, inspection, insurance, and shipment milestones — subject to contract, corridor, and bank approval.",
      }),
      section("shipping", "Shipping terms", {
        eyebrow: "CIF & trade insurance",
        title: "FOB or CIF — insurance and freight aligned to contract",
        body: "CIF programmes include coordinated marine cargo insurance and main carriage to the named port. FOB places main carriage with the buyer from the loading port. Responsibilities and documentation are defined in the signed PSA and Incoterms.",
      }),
      section("partners-teaser", "Partners teaser", {
        eyebrow: "Verification partners",
        title: "Recognized inspection & certification partners",
        body: "Finekarts coordinates with independent inspection and certification firms on programmes we sell — buyers confirm scope in the PSA; we are the trader, not the inspection company.",
      }),
      section("packaging", "Packaging", {
        eyebrow: "Packaging options",
        title: "Dry bulk, liquid bulk, and vessel programmes",
        body: "FIBCs, flexitanks, IBC totes, drums, and unpackaged vessel holds — compatibility confirmed per product and route.",
      }),
      section("cta-banner", "Ready CTA", {
        title: "Ready to discuss a bulk commodity programme?",
        body: "Sign in to submit purchase requests, book consultations, and track enquiries through the buyer portal.",
        primaryCtaLabel: "Buyer sign in",
        primaryCtaHref: "/login",
      }),
      section("insights", "Insights", {
        eyebrow: "Insights & notes",
        title: "Trade education and process notes",
        body: "Plain-language articles on Incoterms, documentation, packaging, and how purchase requests work.",
      }),
    ],
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
      section("who-we-are", "Who we are", {
        eyebrow: "Who We Are",
        title: "We sell commodities — we do not broker buyers and sellers.",
        body:
          "Finekarts Incorporated is a distributor offering bulk agricultural commodities for sale. Supplier relationships are private; qualified buyers receive specification discipline, coordinated inspection and logistics, marine insurance where CIF applies, and bankable documentation — delivered through independent partners, not as standalone Finekarts-branded services.",
        body2:
          "From enquiry through contract, inspection milestones, and shipment documentation, our trade desk focuses on disciplined execution and clear communication — while specialists appointed under the PSA perform inspection, carriage, and insurance work.",
      }),
      section("capabilities", "Capabilities", {
        eyebrow: "What we do",
        title: "Structured programmes for bulk trade",
        body: "Specification alignment, independent inspection, logistics coordination, trade insurance where agreed, and export documentation — plus Irrevocable LC at sight, SBLC backup, and transferable revolving LC structures for longer programmes when banks approve.",
      }),
      section("process", "Process", {
        eyebrow: "Our process",
        title: "Documentation-led trade execution",
        body: "Enquiry → qualification → offer → contract → inspection → shipment → delivery documentation.",
      }),
      section("global", "Global network", {
        title: "Corridors we serve",
        body: "We sell bulk commodities into major import markets — coordinating CIF marine insurance, freight, and export documentation while buyers confirm destination clearance requirements before contract. See Dispute resolution for responsibilities under FOB and CIF.",
      }),
      section("cta", "CTA", {
        title: "Discuss your next bulk commodity requirement",
        body: "Reach the trade desk or sign in to submit a purchase request through the buyer portal.",
        primaryCtaLabel: "Contact",
        primaryCtaHref: "/contact",
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
        title: "Resources",
        description:
          "CIF trade insurance, PSA banking clauses, ICC payment structures, and trade documents — plus dispute resolution and responsibilities. Purchase requests go through the buyer portal.",
        primaryCtaLabel: "Buyer portal sign-in →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Register as buyer",
        secondaryCtaHref: "/register/buyer",
      }),
      section("intro", "Introduction", {
        body: "Prioritize CIF trade insurance, PSA banking clauses, and payment structures before downloads. Document sets vary by product, corridor, bank, and contract — lists below are starting points, not guarantees.",
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
    seoTitle: "Verification partners",
    seoDescription:
      "Independent inspection and certification firms Finekarts may appoint on commodity programmes — Finekarts is the trader, not the inspection company.",
    sections: [
      section("hero", "Hero", {
        title: "Verification partners",
        description:
          "Finekarts coordinates with internationally recognized inspection and certification organizations on trades we sell. Listings help buyers see which independent firms may be appointed — they are tools for safer transactions, not services Finekarts operates.",
        primaryCtaLabel: "Browse partners →",
        primaryCtaHref: "#partners-list",
        secondaryCtaLabel: "Inspection overview",
        secondaryCtaHref: "/inspections",
      }),
      section("intro", "Introduction", {
        note: "Partnership listings support transparency — they do not replace contractual inspection terms, bank requirements, or independent due diligence.",
        body: "Independent inspection, testing, and certification firms we coordinate with on commodity programmes. Listings support buyer confidence — contractual inspection scope and bank requirements still apply.",
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
      section("hero", "Hero", {
        title: "Common questions",
        description:
          "How we sell bulk commodities, structure CIF and trade insurance, handle payments and disputes, and work with qualified buyers. Deal-specific terms are always in the signed PSA.",
        primaryCtaLabel: "Request a Quote →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Contact us",
        secondaryCtaHref: "/contact",
      }),
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
      section("hero", "Hero", {
        title: "People behind the trade desk",
        description:
          "Leadership and trade desk contacts supporting qualified buyer programmes — bulk sales, logistics, compliance, and ICC-aligned banking structures.",
        primaryCtaLabel: "Contact the trade desk →",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "About Finekarts",
        secondaryCtaHref: "/about",
      }),
      section("board-intro", "Board of directors", {
        title: "Board members",
        body:
          "Each board member is listed with their name, position, and the department they lead.",
      }),
    ],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    path: "/testimonials",
    seoTitle: "Testimonials",
    seoDescription: "Approved client testimonials with name, role, company and photo.",
    sections: [
      section("hero", "Hero", {
        title: "What counterparties say",
        description:
          "Buyers and long-term programme partners on structured execution, inspection discipline, and reliable documentation.",
        primaryCtaLabel: "Start a conversation →",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Trade resources",
        secondaryCtaHref: "/resources",
      }),
    ],
  },
  {
    slug: "booking",
    title: "Booking",
    path: "/booking",
    seoTitle: "Book a consultation",
    seoDescription: "Request a trade desk consultation through the buyer portal.",
    sections: [
      section("hero", "Hero", {
        title: "Book a consultation",
        description:
          "Signed-in buyers request a trade desk call to discuss volume, CIF or FOB, payment instruments, and on-demand programmes. Times are confirmed by the desk.",
        primaryCtaLabel: "Buyer sign in →",
        primaryCtaHref: "/login",
      }),
    ],
  },
  {
    slug: "privacy",
    title: "Careers",
    path: "/privacy",
    seoTitle: "Careers",
    seoDescription: "Career opportunities and applications at Finekarts Incorporated.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Career portal",
        title: "Build your career in global commodity trade",
        description:
          "Create a career portal account, then complete the Finekarts job application, HR questionnaire, and dossier upload.",
        primaryCtaLabel: "Start application →",
        primaryCtaHref: "#career-application",
        secondaryCtaLabel: "Meet the team",
        secondaryCtaHref: "/team",
      }),
    ],
  },
  {
    slug: "terms",
    title: "Terms redirect",
    path: "/terms",
    seoTitle: "Terms",
    seoDescription: "Redirects to Terms & Conditions.",
    sections: [
      section("hero", "Hero", {
        title: "Terms & Conditions",
        description: "This route redirects to the full terms and conditions page.",
      }),
    ],
  },
  {
    slug: "cookies",
    title: "Cookies",
    path: "/cookies",
    seoTitle: "Cookie notice",
    seoDescription: "Finekarts cookie policy.",
    sections: [
      section("hero", "Hero", {
        title: "Cookie notice",
        description: "Information about cookies and similar technologies on this site.",
      }),
    ],
  },
  {
    slug: "buyer-terms",
    title: "Buyer terms",
    path: "/buyer-terms",
    seoTitle: "Buyer terms",
    seoDescription: "Terms for buyer portal registration and submissions.",
    sections: [
      section("hero", "Hero", {
        title: "Buyer terms",
        description: "Terms governing buyer portal registration, submissions, and enquiries.",
      }),
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
      section("hero", "Hero", {
        title: "Buyer purchase request",
        description:
          "Submit RFQs for listed commodities or on-demand volumes after registration. Include destination, FOB or CIF preference, and agreed payment structure.",
        primaryCtaLabel: "Register as buyer",
        primaryCtaHref: "/register/buyer",
        secondaryCtaLabel: "Buyer sign in",
        secondaryCtaHref: "/login",
      }),
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
      section("hero", "Hero", {
        title: "Supplier relationships",
        description:
          "Finekarts is a distributor selling to qualified buyers. Origin supply is managed privately — supplier access is invitation-only after verification.",
        primaryCtaLabel: "Contact trade desk",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Buyer programmes",
        secondaryCtaHref: "/products",
      }),
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
