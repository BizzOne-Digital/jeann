import { buildPageSection, joinLines } from "@/lib/content/page-registry-section";
import {
  FINEKARTS_DUE_DILIGENCE_LEAD,
  FINEKARTS_TRADER_ROLE,
  FINEKARTS_TRADE_SAFEGUARDS,
} from "@/lib/content/trader-positioning";
import { getCategoryCover } from "@/lib/content/product-images";
import { HOME_PAGE_ONLY_IMAGES } from "@/lib/content/home-page-images";
import { HOME_INSIGHTS_CARD_IMAGES } from "@/lib/content/home-images";
import { HOME_INSIGHTS_TEASER } from "@/lib/content/operational-insights-content";
import { HOMEPAGE_PACKAGING_TEASER } from "@/lib/content/packaging-images";
import { FOOD_SAFETY_MARKETS } from "@/lib/content/food-safety-agencies";
import { PRODUCER_PARTNERS_PRODUCT_LINES } from "@/lib/content/producer-partners-content";

const section = buildPageSection;

/** Home commodity cards (slug order as shown on the page). */
export const HOME_COMMODITY_SLUGS = [
  "edible-oils",
  "sugar",
  "rice-and-grains",
  "beans-and-pulses",
  "coffee",
  "spices",
] as const;

export const HOME_HERO_TRUST_LABELS = [
  "FOB & CIF",
  "Irrevocable LC · Revolving",
  "CIF & trade insurance",
] as const;

export const HOME_SOURCED_ITEMS = [
  {
    title: "Trusted Sourcing",
    text: "We partner with reputable producers who share our commitment to quality and integrity.",
  },
  {
    title: "Quality Coordination",
    text: "Rigorous quality checks and consistent standards across every shipment and origin.",
  },
  {
    title: "Global Logistics",
    text: "Coordinated freight and documentation with established logistics partners on programmes we sell.",
  },
] as const;

export const HOME_PROCESS_STEPS = [
  {
    title: "Submit Request",
    text: "Share product, quantity, destination, and preferred Incoterms through the RFQ form.",
  },
  {
    title: "Review & Quote",
    text: "Trade desk reviews fit, CIF or FOB structure, and bankable payment options.",
  },
  {
    title: "Contract & Documentation",
    text: "Agreed PSA/SPA and banking wording proceed only after mutual confirmation.",
  },
  {
    title: "Inspection & Delivery",
    text: "Quality and quantity confirmed before shipment when agreed; CIF insurance and documents align to the PSA.",
  },
] as const;

export const HOME_SHIPPING_TERMS = [
  {
    title: "FOB",
    text: "Free On Board — seller typically delivers on board at the named port of shipment; buyer arranges main carriage and insurance from that point.",
  },
  {
    title: "CIF",
    text: "Cost, Insurance and Freight — seller typically arranges carriage and minimum insurance to the named destination port, subject to contract wording.",
  },
] as const;

export const HOME_PACKAGING_BODY =
  "Featured transport modes below. All other packaging types — IBC totes, drums, jumbo bags, ISO tanks, bulk vessel, containerized cargo and more — are explained on the";

export const HOME_DEFAULTS = {
  traderNotice: {
    title: "Finekarts is a bulk commodity trader",
    body: FINEKARTS_TRADER_ROLE,
    body2: FINEKARTS_DUE_DILIGENCE_LEAD,
  },
  commodities: { title: "Products we sell", ctaLabel: "View All Products →" },
  sourced: {
    title: "Sourced Responsibly.\nDelivered Globally.",
    body: "As a bulk commodity trader, we work with established producers and logistics partners to fulfil PSAs reliably — inspection and insurance are coordinated where contracts require them.",
    ctaLabel: "Resources & documents",
  },
  foodSafety: {
    eyebrow: "Food safety & standards",
    title:
      "Countries we trade most — shipments aligned with destination food safety requirements",
  },
  process: { title: "A Clear Path From Request to Delivery" },
  shipping: {
    title: "Shipping Terms Built Around Your Trade",
    primaryCtaLabel: "CIF coordination →",
    secondaryCtaLabel: "Trade assurance →",
  },
  partners: {
    eyebrow: "Origin partnerships",
    title: "Producers & manufacturers on export programmes",
    body: "Finekarts structures bulk commodity sales to international buyers. Established farms, processors, and manufacturers with scale and quality discipline can explore programmes with the trade desk.",
    cardLinkLabel: "View specifications →",
    ctaLabel: "Producer & manufacturer partnerships →",
  },
  packaging: {
    title: "Packaging for Every Commodity",
    ctaLabel: "View packaging options →",
    bodyLinkLabel: "full packaging page",
  },
  cta: {
    title: "Ready to Source Your Next Commodity?",
    body: "Tell us what you need, where it is going, and your preferred trade terms.",
    primaryCtaLabel: "Buyer portal sign in",
    secondaryCtaLabel: "Live chat",
  },
  insights: { cardLinkLabel: "Read guide" },
  testimonial: {
    eyebrow: "Client Perspective",
    linkLabel: "Read more testimonials →",
  },
} as const;

/**
 * "Title: text" lines (or "Title | text" when sep is "|") parsed by index.
 * Missing / unparseable lines fall back to the default at that index.
 */
export function parseTitleText<T extends { title: string; text: string }>(
  raw: string[],
  defaults: readonly T[],
  sep = ":",
): { title: string; text: string }[] {
  return defaults.map((d, i) => {
    const line = raw[i];
    if (!line) return d;
    const idx = line.indexOf(sep);
    if (idx === -1) return d;
    return { title: line.slice(0, idx).trim(), text: line.slice(idx + sep.length).trim() };
  });
}

/** Registry sections for the homepage, in page top-to-bottom order. */
export function homeRegistrySections() {
  const d = HOME_DEFAULTS;
  const commodityCards = HOME_COMMODITY_SLUGS.map((slug) => getCategoryCover(slug));
  const partnerLines = PRODUCER_PARTNERS_PRODUCT_LINES.slice(0, 4);

  return [
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
      // One trust badge per line (icons are fixed).
      bullets: joinLines([...HOME_HERO_TRUST_LABELS]),
    }),
    section("trader-notice", "Trader role notice", {
      title: d.traderNotice.title,
      body: d.traderNotice.body,
      body2: d.traderNotice.body2,
    }),
    section("connection", "Who we are", {
      eyebrow: "Who we are",
      title: "Selling bulk commodities with trust at the centre",
      body:
        "Finekarts Incorporated is a distributor: every product listed on this site is offered for sale to qualified bulk buyers. We are not a marketplace and we do not connect unrelated buyers with unrelated sellers.",
      body2:
        "Origin relationships stay private. What we publish is how we trade — using independent verification, inspection, carriers, and marine insurance where contracts require them, not selling those capabilities as Finekarts-branded services.",
      ctaLabel: "Discover Finekarts",
      image1: "/images/home-1.png",
      image2: "/images/home-2.png",
      youtubeVideoId: "",
    }),
    section("commodities", "Products we sell", {
      title: d.commodities.title,
      ctaLabel: d.commodities.ctaLabel,
      // One product name per line, in card order (left to right).
      items: joinLines(commodityCards.map((c) => c.shortName)),
      image1: commodityCards[0].image,
      image2: commodityCards[1].image,
      image3: commodityCards[2].image,
      image4: commodityCards[3].image,
      image5: commodityCards[4].image,
      image6: commodityCards[5].image,
    }),
    section("sourced", "Sourced responsibly", {
      title: d.sourced.title,
      body: d.sourced.body,
      // One card per line: "Title: text"
      items: joinLines(HOME_SOURCED_ITEMS.map((i) => `${i.title}: ${i.text}`)),
      ctaLabel: d.sourced.ctaLabel,
      image: "/images/home/responsible-sourcing-aerial.jpg",
    }),
    section("logistics-image-band", "Logistics image band", {
      image: HOME_PAGE_ONLY_IMAGES.logisticsBand.src,
      imageAlt: HOME_PAGE_ONLY_IMAGES.logisticsBand.alt,
    }),
    section("food-safety", "Food safety & standards", {
      eyebrow: d.foodSafety.eyebrow,
      title: d.foodSafety.title,
      // One market per line: "Country: note"
      items: joinLines(FOOD_SAFETY_MARKETS.map((m) => `${m.country}: ${m.note}`)),
    }),
    section("process", "Request to delivery steps", {
      title: d.process.title,
      // One step per line: "Title: text"
      items: joinLines(HOME_PROCESS_STEPS.map((s) => `${s.title}: ${s.text}`)),
    }),
    section("shipping", "Shipping terms", {
      title: d.shipping.title,
      // One term per line: "FOB: text"
      items: joinLines(HOME_SHIPPING_TERMS.map((t) => `${t.title}: ${t.text}`)),
      primaryCtaLabel: d.shipping.primaryCtaLabel,
      secondaryCtaLabel: d.shipping.secondaryCtaLabel,
      image: HOME_PAGE_ONLY_IMAGES.shippingTerms.src,
      imageAlt: HOME_PAGE_ONLY_IMAGES.shippingTerms.alt,
    }),
    section("partners-teaser", "Origin partnerships", {
      eyebrow: d.partners.eyebrow,
      title: d.partners.title,
      body: d.partners.body,
      // One product-line card label per line (4 cards, links are fixed)
      items: joinLines(partnerLines.map((l) => l.label)),
      cardLinkLabel: d.partners.cardLinkLabel,
      ctaLabel: d.partners.ctaLabel,
    }),
    section("packaging", "Packaging for every commodity", {
      title: d.packaging.title,
      ctaLabel: d.packaging.ctaLabel,
      body: HOME_PACKAGING_BODY,
      bodyLinkLabel: d.packaging.bodyLinkLabel,
      // One packaging card name per line (5 cards)
      items: joinLines(HOMEPAGE_PACKAGING_TEASER.map((p) => p.name)),
      image1: HOMEPAGE_PACKAGING_TEASER[0].image,
      image2: HOMEPAGE_PACKAGING_TEASER[1].image,
      image3: HOMEPAGE_PACKAGING_TEASER[2].image,
      image4: HOMEPAGE_PACKAGING_TEASER[3].image,
      image5: HOMEPAGE_PACKAGING_TEASER[4].image,
    }),
    section("cta-banner", "Ready CTA", {
      title: d.cta.title,
      body: d.cta.body,
      primaryCtaLabel: d.cta.primaryCtaLabel,
      secondaryCtaLabel: d.cta.secondaryCtaLabel,
      image: HOME_PAGE_ONLY_IMAGES.readyCta.src,
      imageAlt: HOME_PAGE_ONLY_IMAGES.readyCta.alt,
    }),
    section("insights", "Insights", {
      eyebrow: HOME_INSIGHTS_TEASER.eyebrow,
      title: HOME_INSIGHTS_TEASER.title,
      ctaLabel: HOME_INSIGHTS_TEASER.viewAllLabel,
      // One card per line: "Title | excerpt"
      items: joinLines(HOME_INSIGHTS_TEASER.cards.map((c) => `${c.title} | ${c.excerpt}`)),
      cardLinkLabel: d.insights.cardLinkLabel,
      image1: HOME_INSIGHTS_CARD_IMAGES[0].src,
      image2: HOME_INSIGHTS_CARD_IMAGES[1].src,
      image3: HOME_INSIGHTS_CARD_IMAGES[2].src,
    }),
    section("testimonial", "Client perspective teaser", {
      eyebrow: d.testimonial.eyebrow,
      linkLabel: d.testimonial.linkLabel,
    }),
  ];
}
