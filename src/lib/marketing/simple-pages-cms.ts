import { cmsField, cmsSection, type CmsSectionMap } from "@/lib/content/cms-field";
import { CAREERS_PAGE_IMAGES } from "@/lib/content/careers-page-images";
import {
  CAREERS_FORM,
  CAREERS_INTRO,
  CAREERS_PAGE_HERO,
  CAREERS_PORTAL_ACCOUNT,
} from "@/lib/content/careers-page-content";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";

/**
 * Defaults for the smaller marketing pages (team, testimonials, faq, booking, careers,
 * buyer-request, supplier-offer, cookies, buyer-terms). Both the admin registry and the
 * live pages import these constants so admin defaults always equal the frontend text.
 */

type Fields = Record<string, string>;

/** Merge CMS fields over defaults; blank CMS values fall back to the default. */
export function cmsMerged<T extends Fields>(
  cms: CmsSectionMap | undefined,
  sectionId: string,
  defaults: T,
): T {
  const fields = cmsSection(cms, sectionId);
  const out: Fields = {};
  for (const key of Object.keys(defaults)) out[key] = cmsField(fields, key, defaults[key]);
  return out as T;
}

/** Image field: CMS value (resolved) or the hardcoded fallback when blank. */
export function cmsImageSrc(value: string | undefined, fallback: string): string {
  const v = value?.trim();
  return v ? resolveImageSrc(v) : fallback;
}

/** One list item per line "Title | Body". Falls back when blank or malformed. */
export function parseTitleBodyRows(raw: string, fallback: string[][]): string[][] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return fallback;
  const rows = lines.map((l) => l.split("|").map((c) => c.trim()));
  return rows.every((r) => r.length === 2 && r[0] && r[1]) ? rows : fallback;
}

export const TEAM_HERO_DEFAULTS: Fields = {
  title: "Our team",
  description:
    "The people who lead trade programmes, logistics, compliance, and buyer relationships at Finekarts.",
  primaryCtaLabel: "Contact the trade desk →",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "About Finekarts",
  secondaryCtaHref: "/about",
};
export const TEAM_INTRO_DEFAULTS: Fields = {
  eyebrow: "Our team",
  title: "Team members",
  body: "Each profile shows photo, name, title, and department. Additional columns can be added from the admin team settings.",
};
export const TEAM_FOOTER_DEFAULTS: Fields = {
  careersLabel: "Careers",
  careersHref: "/careers",
  contactLabel: "Contact",
  contactHref: "/contact",
};

export const TESTIMONIALS_HERO_DEFAULTS: Fields = {
  title: "What counterparties say",
  description:
    "Verified buyers and trade partners share their experience working with Finekarts — company, role, photo and review in one place.",
  primaryCtaLabel: "Start a conversation →",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Trade resources",
  secondaryCtaHref: "/resources",
};
export const TESTIMONIALS_CTA_DEFAULTS: Fields = {
  prompt: "Interested in working with Finekarts?",
  linkLabel: "Contact the trade desk",
  linkHref: "/contact",
};

export const FAQ_HERO_DEFAULTS: Fields = {
  title: "Common questions",
  description:
    "Straight answers about how we trade. For deal-specific advice, contact the trade desk.",
  primaryCtaLabel: "Request a Quote →",
  primaryCtaHref: buyerQuoteHref(),
  secondaryCtaLabel: "Contact us",
  secondaryCtaHref: "/contact",
};
export const FAQ_CTA_DEFAULTS: Fields = {
  primaryLabel: "Request a Quote",
  primaryHref: buyerQuoteHref(),
  secondaryLabel: "Contact us",
  secondaryHref: "/contact",
};

export const BOOKING_HERO_DEFAULTS: Fields = {
  title: "Book a consultation",
  description:
    "Request a conversation about RFQs, logistics, or qualification. A submitted request is not a confirmed appointment.",
  primaryCtaLabel: "Sign in to book →",
  primaryCtaHref: "/login",
  secondaryCtaLabel: "Register",
  secondaryCtaHref: "/register/buyer",
};
export const BOOKING_SCHEDULE_DEFAULTS: Fields = {
  title: "Schedule a conversation",
  body: "Include your timezone and a realistic time window. Our team may propose alternative slots based on availability and enquiry priority.",
  emailPrefix: "Email",
  phonePrefix: "or call",
  resourcesLabel: "Browse resources first",
  resourcesHref: "/resources",
};
export const BOOKING_PORTAL_GATE_DEFAULTS: Fields = {
  title: "Consultation booking",
  description:
    "Signed-in buyers can request a consultation from the buyer portal. Staff confirms appointments — calendar integration is optional.",
};

export const CAREERS_HERO_DEFAULTS: Fields = {
  eyebrow: CAREERS_PAGE_HERO.eyebrow,
  title: CAREERS_PAGE_HERO.title,
  description: CAREERS_PAGE_HERO.description,
  primaryCtaLabel: CAREERS_PAGE_HERO.primaryCta.label,
  primaryCtaHref: CAREERS_PAGE_HERO.primaryCta.href,
  secondaryCtaLabel: CAREERS_PAGE_HERO.secondaryCta.label,
  secondaryCtaHref: CAREERS_PAGE_HERO.secondaryCta.href,
};
export const CAREERS_INTRO_DEFAULTS: Fields = {
  eyebrow: CAREERS_PAGE_HERO.eyebrow,
  title: CAREERS_INTRO.title,
  lead: CAREERS_INTRO.lead,
  image: CAREERS_PAGE_IMAGES.interview.src,
};
/** Pillar cards: one per line, "Title | Body". */
export const CAREERS_PILLARS_DEFAULTS: Fields = {
  cardItems: CAREERS_INTRO.pillars.map((p) => `${p.title} | ${p.body}`).join("\n"),
};
export const CAREERS_APPLICATION_DEFAULTS: Fields = {
  eyebrow: "Application",
  title: CAREERS_FORM.title,
  portalEyebrow: "Step 1",
  portalTitle: CAREERS_PORTAL_ACCOUNT.title,
  portalLead: CAREERS_PORTAL_ACCOUNT.lead,
  signedInNote: "Complete the questionnaire below and upload your dossier.",
};
export const CAREERS_EQUAL_OPPORTUNITY_DEFAULTS: Fields = {
  eyebrow: "Equal opportunity",
  body: "Finekarts welcomes applications from qualified professionals. All submissions are reviewed confidentially by HR and hiring managers.",
};

export const BUYER_REQUEST_HERO_DEFAULTS: Fields = {
  title: "Buyer purchase request",
  description:
    "Qualified buyers submit RFQs for listed commodities and on-demand volumes through the secure buyer portal. Registration and trade-desk qualification are required before programmes proceed.",
  primaryCtaLabel: "Register your company →",
  primaryCtaHref: "/register/buyer",
  secondaryCtaLabel: "Buyer sign in",
  secondaryCtaHref: "/login",
};
export const BUYER_REQUEST_STEPS_DEFAULTS: Fields = {
  title: "How buyer requests work",
  stepItems: [
    "Register your buyer organization and accept the current terms.",
    "Finekarts reviews your company (CIS/KYB may be requested).",
    "After approval, sign in to the buyer portal.",
    "Submit a purchase request with product, grade, quantity (MT), destination port, FOB or CIF, contract duration, and ICC-aligned payment terms (for example Irrevocable LC at sight).",
    "The trade desk qualifies your enquiry — submission is not a binding contract.",
  ].join("\n"),
};
export const BUYER_REQUEST_FORM_CARD_DEFAULTS: Fields = {
  title: "Edible oils programme form",
  body: "Approved buyers can specify grade, monthly MT volume, destination, 12- or 24-month contracts, and agreed payment structures from our published programme options.",
  primaryLabel: "Open request form (sign-in required)",
  primaryHref: "/portal/buyer/new-request",
  secondaryLabel: "Payment & document resources",
  secondaryHref: "/resources",
};
export const BUYER_REQUEST_DISCLAIMER_DEFAULTS: Fields = {
  body: "Finekarts does not guarantee availability, pricing, financing, or shipment based on a website submission alone. Binding terms appear only in signed PSA/SPA and banking instruments.",
};

export const SUPPLIER_OFFER_HERO_DEFAULTS: Fields = {
  title: "Supplier trade offer",
  description:
    "Finekarts is a distributor selling to qualified buyers. Origin supply is private — supplier portal access is invitation-only after diligence.",
  primaryCtaLabel: "Contact trade desk →",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Sign in",
  secondaryCtaHref: "/login",
};
export const SUPPLIER_OFFER_INVITATION_DEFAULTS: Fields = {
  title: "Invitation-only suppliers",
  body: "We do not advertise open supplier registration on this site. Established origin relationships are managed privately. If Finekarts invites your organization to a programme, you will receive secure onboarding instructions by email.",
};
export const SUPPLIER_OFFER_ENQUIRY_DEFAULTS: Fields = {
  title: "Submit initial enquiry",
  body: "Optional initial messages are reviewed by the trade desk. They do not grant portal access or confirm a supply relationship.",
};
export const SUPPLIER_OFFER_SEE_ALSO_DEFAULTS: Fields = {
  intro: "For bulk buyer programmes, see",
  productsLabel: "products we sell",
  productsHref: "/products",
  joinText: "or",
  assuranceLabel: "trade assurance",
  assuranceHref: "/dispute-resolution",
};

export const LEGAL_NOTICE_TITLE = "Important notice";
export function legalNoticeBody(version = "2026"): string {
  return `Version ${version}. This summary is for general information on the Finekarts website. It is not legal advice — binding terms appear in counsel-reviewed contracts and instruments signed by the parties.`;
}
export const LEGAL_NOTICE_DEFAULTS: Fields = {
  title: LEGAL_NOTICE_TITLE,
  body: legalNoticeBody("2026"),
};

export const COOKIES_HERO_DEFAULTS: Fields = {
  title: "Cookie policy",
  description:
    "How Finekarts may use cookies and similar technologies on the marketing site and authenticated portals.",
};
export const COOKIES_INTRO_DEFAULTS: Fields = {
  body: "This notice explains how Finekarts may use cookies and similar technologies on the marketing site and authenticated portals.",
};
export const COOKIES_ESSENTIAL_DEFAULTS: Fields = {
  title: "Essential cookies",
  body: "Session and security cookies may be used to maintain sign-in state, CSRF protection, and basic site functionality.",
};
export const COOKIES_ANALYTICS_DEFAULTS: Fields = {
  title: "Analytics",
  body: "Analytics cookies, if enabled after review, would help understand aggregate site usage. Details will be updated before any non-essential tracking is activated.",
};
export const COOKIES_PREFERENCES_DEFAULTS: Fields = {
  title: "Managing preferences",
  body: "Browser settings can limit cookies. Restricting essential cookies may affect portal functionality.",
};

export const BUYER_TERMS_HERO_DEFAULTS: Fields = {
  title: "Buyer terms",
  description:
    "Terms that apply when qualified buyers submit purchase requests or use buyer portal features.",
};
export const BUYER_TERMS_INTRO_DEFAULTS: Fields = {
  body: "These terms apply when buyers submit purchase requests or use buyer portal features. Binding trade terms appear in the signed PSA/SPA and banking instruments — not in this summary alone.",
};
export const BUYER_TERMS_NON_BINDING_DEFAULTS: Fields = {
  title: "Non-binding enquiries",
  body: "Submitting an RFQ or purchase request does not guarantee acceptance, pricing, supply, financing, inspection outcomes, or shipment.",
};
export const BUYER_TERMS_REPRESENTATIONS_DEFAULTS: Fields = {
  title: "Representations",
  body: "Buyers represent that enquiry information is provided in good faith and that they have authority to conduct trade discussions for their organization.",
};
export const BUYER_TERMS_CONFIDENTIALITY_DEFAULTS: Fields = {
  title: "Confidentiality",
  body: "Mutual confidentiality for non-public deal terms may be addressed in separate NDAs or contract documents where appropriate.",
};
export const BUYER_TERMS_DOCUMENTS_DEFAULTS: Fields = {
  title: "Download buyer terms (PDF)",
};
