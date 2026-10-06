/** `/partners` — origin capacity & manufacturing programmes (not inspection-firm listings). */

export const PRODUCER_PARTNERS_HERO = {
  title: "Partner with Finekarts on export programmes",
  lead:
    "Finekarts sells bulk agricultural and food commodities to qualified international buyers. We work with established farms, aggregators, processors, and manufacturers who can meet contract specifications, regulatory expectations, and volume commitments — without advertising individual supplier identities on this site.",
  note:
    "This page is for producers and manufacturers exploring structured export or tolling relationships. Buyer purchase requests use the buyer portal; inspection firm overviews live under Inspections.",
} as const;

export const PRODUCER_PARTNERS_INTRO = {
  eyebrow: "Origin & processing partnerships",
  title: "Scale, consistency, and documentation discipline",
  lead:
    "We look for partners who can align crop years, crushing or refining runs, storage, and loading windows with buyer PSAs. Programmes succeed when quality is repeatable, paperwork is bankable, and independent verification can be appointed where the contract requires it.",
} as const;

export const PRODUCER_PARTNERS_PILLARS = [
  {
    title: "Volume & specification fit",
    body:
      "Programmes are sized to parcel, vessel lot, or annual envelope. Share grades, moisture bands, packaging, and corridor so the desk can match you to active buyer demand.",
  },
  {
    title: "Regulatory readiness",
    body:
      "Destination food-safety, phytosanitary, and labeling rules flow into the PSA. Partners maintain records and processes that support import clearance — not marketing claims on this site.",
  },
  {
    title: "Commercial structure",
    body:
      "Incoterms, payment instruments, and inspection scope are agreed before cargo moves. Finekarts is the seller on export contracts we sign with buyers; origin relationships are managed privately.",
  },
] as const;

export const PRODUCER_PARTNERS_PRODUCT_LINES = [
  { label: "Sugar & sweeteners", href: "/products/sugar" },
  { label: "Edible oils", href: "/products/edible-oils" },
  { label: "Coffee", href: "/products/coffee" },
  { label: "Rice & grains", href: "/products/rice-and-grains" },
  { label: "Beans & pulses", href: "/products/beans-and-pulses" },
  { label: "Spices", href: "/products/spices" },
] as const;

export const PRODUCER_PARTNERS_CTA = {
  title: "Introduce your programme to the trade desk",
  lead:
    "Share commodity, annual or spot volume, origin, certifications, and loading options. Initial supplier conversations are reviewed privately — portal access is invitation-only after diligence.",
  primary: { href: "/supplier-offer", label: "Supplier enquiry →" },
  secondary: { href: "/contact", label: "Contact trade desk" },
  inspections: { href: "/inspections", label: "Inspection & verification context" },
} as const;
