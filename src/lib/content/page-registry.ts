export type PageFieldType = "text" | "textarea" | "url" | "image";

export type PageFieldDef = {
  key: string;
  label: string;
  type: PageFieldType;
};

export type PageSectionDef = {
  id: string;
  label: string;
  fields: PageFieldDef[];
  defaults: Record<string, string>;
};

export type PageRegistryEntry = {
  slug: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  sections: PageSectionDef[];
};

export type EditablePage = {
  slug: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published" | "archived";
  sections: PageSectionDef[];
};

function section(
  id: string,
  label: string,
  defaultsIn: Record<string, string>,
): PageSectionDef {
  const defaults =
    id === "hero"
      ? {
          heroImage: "",
          youtubeVideoId: "",
          ...defaultsIn,
        }
      : defaultsIn;

  const fields: PageFieldDef[] = Object.keys(defaults).map((key) => ({
    key,
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/Cta/g, "CTA")
      .replace(/Hero image/i, "Hero background image")
      .replace(/Youtube video id/i, "YouTube video link or ID")
      .replace(/([0-9]+)/g, " $1")
      .trim(),
    type:
      /image|photo|heroImage|thumbnail|cover/i.test(key)
        ? "image"
        : /youtube/i.test(key)
          ? "url"
          : key.includes("description") ||
              key.includes("body") ||
              key.includes("note") ||
              key.includes("lead") ||
              key.includes("content")
            ? "textarea"
            : key.includes("Href") || key === "path"
              ? "url"
              : "text",
  }));
  return { id, label, fields, defaults };
}

export const MARKETING_PAGE_REGISTRY: PageRegistryEntry[] = [
  {
    slug: "home",
    title: "Homepage",
    path: "/",
    seoTitle: "Finekarts — Global agricultural commodity distribution",
    seoDescription:
      "Finekarts Incorporated supplies bulk agricultural commodities for sale to qualified international buyers — verification, inspection, logistics, trade insurance, and bankable ICC-aligned payment structures.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Bulk commodities • Verified programmes • Worldwide delivery",
        title: "Bulk Agricultural Commodities for Qualified Buyers",
        description:
          "Finekarts supplies edible oils, sugar, rice, beans, and related cargoes to qualified international buyers — with inspection, CIF logistics where agreed, trade insurance, and bankable ICC-aligned payment structures.",
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
          "Origin relationships stay private. What we publish is how we deliver — independent verification and inspection, disciplined logistics, trade insurance where contracts require it, and payment structures agreed with your bank.",
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
        body: "Finekarts aligns with independent verification organizations so bulk buyers can confirm cargo, documentation, and supply-chain claims with confidence.",
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
    seoTitle: "About Finekarts",
    seoDescription:
      "Finekarts sells bulk agricultural commodities to qualified buyers — CIF trade insurance, inspection, ICC-aligned payments, and transparent dispute resolution.",
    sections: [
      section("hero", "Hero", {
        title: "Supplying bulk commodities buyers can trust",
        description:
          "We sell bulk agricultural cargoes to qualified international buyers through structured programmes — verification, inspection, logistics, trade insurance, and ICC-aligned payment instruments.",
        primaryCtaLabel: "Request a Quote →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Contact the desk",
        secondaryCtaHref: "/contact",
      }),
      section("who-we-are", "Who we are", {
        eyebrow: "Who We Are",
        title: "We sell commodities — we do not broker buyers and sellers.",
        body:
          "Finekarts Incorporated is a distributor offering bulk agricultural commodities for sale. Supplier relationships are private; this site focuses on what qualified buyers receive — specification discipline, inspection, logistics, insurance, and bankable documentation.",
        body2:
          "From origin to destination, our team ensures reliable execution, transparent communication, and consistent value at every step.",
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
      "Independent inspection, certification, and verification partners supporting transparent international commodity trade.",
    sections: [
      section("hero", "Hero", {
        title: "Verification partners",
        description:
          "Finekarts works with internationally recognized inspection, certification, and verification organizations. Qualified buyers can use these relationships to build confidence in counterparties, cargo, and documentation.",
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
        title: "Products we sell",
        description:
          "Bulk agricultural commodities listed for sale — plus on-demand programmes when your volume and corridor fit our supply calendar. Confirmed grades, origins, and packaging are agreed per enquiry.",
        primaryCtaLabel: "Submit purchase request →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Trade assurance",
        secondaryCtaHref: "/dispute-resolution",
      }),
    ],
  },
  {
    slug: "packaging",
    title: "Packaging",
    path: "/packaging",
    seoTitle: "Packaging types",
    seoDescription:
      "Flexitank, tanker vessel, containerized cargo, bulk truck, bulk vessel and bulk railcar for international commodity trade.",
    sections: [
      section("hero", "Hero", {
        title: "Packaging & transport modes",
        description:
          "Packaging and transport modes for bulk cargoes we sell — matched to product, FOB or CIF structure, inspection scope, and destination handling before loading.",
      }),
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    path: "/logistics",
    seoTitle: "Global shipping & logistics",
    seoDescription:
      "Finekarts coordinates international commodity shipping — FOB and CIF terms, bulk and container programmes, shipment tracking and port-to-port logistics.",
    sections: [
      section("hero", "Hero", {
        title: "Moving commodities from origin to destination",
        description:
          "FOB and CIF are our primary Incoterms® — CIF includes coordinated marine cargo insurance and main carriage to the named port. Documentation aligns with the signed PSA and LC where applicable.",
      }),
    ],
  },
  {
    slug: "inspections",
    title: "Inspections",
    path: "/inspections",
    seoTitle: "Inspections overview",
    seoDescription: "Inspection and verification programmes for bulk commodity trade.",
    sections: [
      section("hero", "Hero", {
        title: "Inspection & verification",
        description:
          "Buyers confirm quality and quantity against contract before shipment when that milestone is agreed — through independent inspection at origin, loading supervision, and laboratory testing.",
      }),
    ],
  },
  {
    slug: "verification",
    title: "Verification",
    path: "/verification",
    seoTitle: "Global business verification & due diligence",
    seoDescription:
      "Finekarts Verification Services — corporate registration, supply-chain due diligence, credit assessment, compliance screening, and documented evidence for bulk buyers.",
    sections: [
      section("hero", "Hero", {
        title: "Know who you are trading with",
        description:
          "Due diligence before large programmes — corporate registration, licences, supply-chain checks, and commodity evidence. Verification is point-in-time; it supports — but does not replace — contract and inspection discipline.",
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
    seoTitle: "Insights & notes",
    seoDescription: "Trade education articles on Incoterms, documentation, and bulk logistics.",
    sections: [
      section("hero", "Hero", {
        title: "Insights & notes",
        description:
          "Plain-language notes on Incoterms, documentation, CIF insurance, and buyer programmes — educational only, not legal or shipping advice.",
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
        title: "Careers at Finekarts",
        description: "Join trade, logistics, and operations teams supporting bulk commodity sales to qualified international buyers.",
        primaryCtaLabel: "Apply now →",
        primaryCtaHref: "#career-application",
        secondaryCtaLabel: "General enquiry",
        secondaryCtaHref: "/contact",
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
    slug: "accessibility",
    title: "Accessibility",
    path: "/accessibility",
    seoTitle: "Accessibility",
    seoDescription: "Finekarts accessibility statement.",
    sections: [
      section("hero", "Hero", {
        title: "Accessibility statement",
        description: "Our commitment to accessible digital experiences and how to request assistance.",
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

export function getRegistryPage(slug: string): PageRegistryEntry | undefined {
  return MARKETING_PAGE_REGISTRY.find((p) => p.slug === slug);
}

export function listRegistryPages(): PageRegistryEntry[] {
  return MARKETING_PAGE_REGISTRY;
}
