export type PageFieldType = "text" | "textarea" | "url";

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
  defaults: Record<string, string>,
): PageSectionDef {
  const fields: PageFieldDef[] = Object.keys(defaults).map((key) => ({
    key,
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/Cta/g, "CTA")
      .trim(),
    type:
      key.includes("description") ||
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
    seoTitle: "Finekarts — Global agricultural commodity trading",
    seoDescription:
      "Finekarts Incorporated sources and supplies bulk agricultural commodities for qualified international buyers.",
    sections: [
      section("hero", "Hero", {
        eyebrow: "Global sourcing • Bulk commodities • Worldwide delivery",
        title: "Global Agricultural Commodity Trading",
        description:
          "We source and supply high-quality agricultural commodities to qualified buyers across global markets.",
        primaryCtaLabel: "Buyer portal",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Explore Products",
        secondaryCtaHref: "/products",
      }),
      section("connection", "Connection", {
        eyebrow: "Your global connection",
        title: "Connecting suppliers and qualified buyers worldwide",
        body: "Finekarts coordinates sourcing, documentation, and logistics for bulk agricultural commodities — with transparency at every step.",
      }),
      section("commodities", "Commodities we trade", {
        eyebrow: "Commodities we trade",
        title: "Bulk agricultural products for international programmes",
        body: "Edible oils, sugar, rice and grains, beans, and related bulk cargoes — specifications confirmed per enquiry.",
      }),
      section("sourced", "Sourced responsibly", {
        eyebrow: "Sourced responsibly",
        title: "Quality coordination across origins and corridors",
        body: "We work with verified supplier programmes and independent inspection partners where contracts require them.",
      }),
      section("process", "Process timeline", {
        eyebrow: "How we work",
        title: "From enquiry to structured trade execution",
        body: "Purchase requests, matching, documentation, inspection, and shipment milestones — subject to contract and corridor.",
      }),
      section("shipping", "Shipping terms", {
        eyebrow: "Shipping & Incoterms",
        title: "FOB, CIF, and corridor-specific logistics",
        body: "Incoterms allocate cost and risk between parties. Final terms are confirmed in contract documentation.",
      }),
      section("partners-teaser", "Partners teaser", {
        eyebrow: "Verification partners",
        title: "Recognized inspection & certification partners",
        body: "Finekarts aligns with independent verification organizations so international buyers can confirm counterparties and cargo with confidence.",
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
      "Finekarts Incorporated connects qualified buyers and suppliers in bulk agricultural commodity trade.",
    sections: [
      section("hero", "Hero", {
        title: "Your connection to global commodity markets",
        description:
          "Sourcing quality agricultural commodities globally and delivering to qualified buyers worldwide through structured trade programmes.",
        primaryCtaLabel: "Request a Quote →",
        primaryCtaHref: "/login",
        secondaryCtaLabel: "Contact the desk",
        secondaryCtaHref: "/contact",
      }),
      section("who-we-are", "Who we are", {
        eyebrow: "Who We Are",
        title: "An extension of manufacturers and suppliers",
        body: "Finekarts Incorporated connects trusted suppliers with qualified buyers worldwide. We specialize in the sourcing, quality coordination, and logistics of bulk agricultural commodities with integrity and professionalism.",
        body2:
          "From origin to destination, our team ensures reliable execution, transparent communication, and consistent value at every step.",
      }),
      section("capabilities", "Capabilities", {
        eyebrow: "What we do",
        title: "Structured programmes for bulk trade",
        body: "Product sourcing, specification alignment, inspection coordination, and export documentation support for qualified buyers.",
      }),
      section("process", "Process", {
        eyebrow: "Our process",
        title: "Documentation-led trade execution",
        body: "Enquiry → qualification → offer → contract → inspection → shipment → delivery documentation.",
      }),
      section("global", "Global network", {
        title: "Sourced responsibly.\nDelivered globally.",
        body: "Our network of suppliers and logistics partners helps us deliver quality commodities reliably — with transparent communication and documentation discipline at every corridor.",
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
      "Finekarts Verification Services — corporate registration, supplier and buyer due diligence, credit assessment, supply-chain mapping and compliance screening.",
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
        title: "Frequently asked questions",
        description: "Plain-language answers about our process, buyer portal, and bulk trade programmes.",
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
        title: "Our team",
        description: "Experienced trade, logistics, and compliance professionals supporting qualified buyers.",
      }),
    ],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    path: "/testimonials",
    seoTitle: "Testimonials",
    seoDescription: "Approved client testimonials.",
    sections: [
      section("hero", "Hero", {
        title: "Testimonials",
        description: "Only CMS-approved testimonials appear on the public site.",
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
    title: "Privacy",
    path: "/privacy",
    seoTitle: "Privacy notice",
    seoDescription: "Finekarts privacy notice.",
    sections: [
      section("hero", "Hero", {
        title: "Privacy notice",
        description: "How Finekarts collects, uses, and protects personal information.",
      }),
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    path: "/terms",
    seoTitle: "Website terms",
    seoDescription: "Finekarts website terms of use.",
    sections: [
      section("hero", "Hero", {
        title: "Website terms of use",
        description: "Terms governing use of this website and marketing content.",
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
