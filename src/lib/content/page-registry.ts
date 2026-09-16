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
        eyebrow: "Bulk commodities for sale • Verified programmes • Worldwide delivery",
        title: "Bulk Agricultural Commodities for Qualified Buyers",
        description:
          "Finekarts supplies edible oils, sugar, rice, beans, and related bulk cargoes for sale to qualified international buyers — backed by inspection, logistics, trade insurance where agreed, and bankable structures such as Irrevocable LC at sight and SBLC for longer contracts.",
        primaryCtaLabel: "Buyer portal",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Explore Products",
        secondaryCtaHref: "/products",
        youtubeVideoId: "gADVpRPdr7E",
      }),
      section("connection", "Connection", {
        eyebrow: "Who we are",
        title: "Selling bulk commodities with trust at the centre",
        body:
          "Finekarts Incorporated is a distributor: every product listed on this site is offered for sale to qualified bulk buyers. We are not a marketplace and we do not connect unrelated buyers with unrelated sellers.",
        body2:
          "Origin relationships and supplier identities remain private. What we publish is how we deliver — independent verification and inspection, disciplined logistics, trade insurance where contracts require it, and ICC-aligned bankable payment structures.",
        image1: "/images/home-1.png",
        image2: "/images/home-2.png",
      }),
      section("commodities", "Commodities we trade", {
        eyebrow: "Commodities we trade",
        title: "Bulk agricultural products for international programmes",
        body: "Edible oils, sugar, rice and grains, beans, and related bulk cargoes — specifications confirmed per enquiry.",
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
        eyebrow: "Shipping & Incoterms",
        title: "FOB, CIF, and corridor-specific logistics",
        body: "FOB and CIF structures follow ICC Incoterms® rules. Marine cargo insurance, freight coordination, and documentary discipline are aligned with the signed SPA and banking instrument.",
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
      "Finekarts Incorporated supplies bulk agricultural commodities for sale to qualified buyers worldwide — verification, inspection, logistics, and bankable transactions.",
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
        title: "Sourced responsibly.\nDelivered globally.",
        body: "Private supply channels and logistics partners help us deliver quality commodities reliably — with transparent communication and documentation discipline at every corridor.",
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
          "Reach the Finekarts trade desk for qualified buyer enquiries. Signed-in buyers can send messages, book consultations, and submit purchase requests from the buyer portal.",
        primaryCtaLabel: "Buyer sign in →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Register",
        secondaryCtaHref: "/register/buyer",
      }),
      section("channels", "Contact channels", {
        eyebrow: "How to reach us",
        title: "Choose the right path for your enquiry",
        body: "Purchase requests, consultations, and general enquiries are handled through the buyer portal after sign-in.",
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
          "Educational reference for trade documents, terminology, and process notes. Purchase requests and consultations are submitted through the buyer portal after sign-in.",
        primaryCtaLabel: "Buyer portal sign-in →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Register as buyer",
        secondaryCtaHref: "/register/buyer",
      }),
      section("intro", "Introduction", {
        body: "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
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
        body: "Each profile uses the partner name, a short intro, a photo, and descriptive text content. Send updated copy and images to your administrator when ready.",
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
        title: "Products we trade",
        description:
          "Browse commodity categories and example specifications. Confirmed grades, origins, and packaging are agreed per enquiry.",
        primaryCtaLabel: "Buyer sign in →",
        primaryCtaHref: "/login",
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
          "Finekarts structures programmes across flexitank, tanker vessel, containerized cargo, bulk truck, bulk vessel and bulk railcar — subject to product, volume and corridor.",
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
          "Global shipping coverage using recognized Incoterms® rules — with FOB and CIF as our primary commercial terms. Final requirements are confirmed contractually.",
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
          "Independent inspection supports quality, quantity, and compliance confirmation — scope is defined per contract and corridor.",
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
          "Independent business intelligence before significant commercial relationships — verification is a point-in-time assessment, not a guarantee of future performance.",
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
          "Straight answers about how we trade. For deal-specific advice, contact the trade desk.",
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
          "Educational articles on bulk agricultural trade — not legal, tax, or shipping advice.",
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
          "Our operations, logistics, and compliance leads support qualified buyer and supplier programmes.",
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
          "Verified buyers and trade partners share their experience working with Finekarts.",
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
          "Signed-in buyers can request a trade desk conversation. Preferred times are confirmed by staff only.",
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
        description: "Submit your application and resume for trade, logistics, and operations roles.",
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
];

export function getRegistryPage(slug: string): PageRegistryEntry | undefined {
  return MARKETING_PAGE_REGISTRY.find((p) => p.slug === slug);
}

export function listRegistryPages(): PageRegistryEntry[] {
  return MARKETING_PAGE_REGISTRY;
}
