import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";

export const ABOUT_STORY = {
  eyebrow: "Finekarts Incorporated",
  title: "Global distribution for bulk agricultural commodities",
  lead:
    "We purchase from farmers, manufacturers, and verified origin programmes — then distribute bulk cargoes to qualified buyers with specification, inspection, logistics, and documentation discipline.",
  boxes: [
    {
      title: "Quality",
      body: "Grades and claims stated only when verified against supplier documentation and agreed inspection scope.",
    },
    {
      title: "Transparency",
      body: "Clear communication on workable structures, corridors, and documentation from enquiry through contract.",
    },
    {
      title: "Discipline",
      body: "Contracts, banking wording, and shipment milestones follow agreed PSA/SPA — not informal promises.",
    },
  ],
} as const;

export const ABOUT_STATS = [
  {
    value: "6+",
    label: "Commodity families",
    detail: "Oils, sugar, rice, beans & related programmes",
  },
  {
    value: "FOB · CIF",
    label: "Trade structures",
    detail: "Risk transfer per signed Incoterms",
  },
  {
    value: "3rd party",
    label: "Inspection ready",
    detail: "Agency and scope are deal-specific",
  },
  {
    value: "Global",
    label: "Trade corridors",
    detail: "Origin-to-destination coordination",
  },
] as const;

export const ABOUT_PILLARS = [
  {
    id: "story",
    title: "Who we are",
    summary: "Distributor model, procurement discipline, and bulk buyer programmes.",
    icon: "team",
    accent: { main: "#1b3a5c", light: "#eef2f7", ring: "#1b3a5c" },
  },
  {
    id: "capabilities",
    title: "Capabilities",
    summary: "Specification, inspection coordination, Incoterms, and documentation.",
    icon: "layers",
    accent: { main: "#1b7a4a", light: "#edf7f1", ring: "#1b7a4a" },
  },
  {
    id: "process",
    title: "How we work",
    summary: "Enquiry, quote, contract, and delivery milestones in sequence.",
    icon: "route",
    accent: { main: "#c88e4a", light: "#fdf6ec", ring: "#c88e4a" },
  },
  {
    id: "global",
    title: "Global reach",
    summary: "Supplier network, logistics partners, and destination corridors.",
    icon: "globe",
    accent: { main: "#1e4d8f", light: "#eef3fa", ring: "#1e4d8f" },
  },
] as const;

export type AboutTabId = (typeof ABOUT_PILLARS)[number]["id"];

export const ABOUT_HUB_INTRO =
  "Explore who we are, what we coordinate, and how programmes move from enquiry to delivery.";

export const ABOUT_PANEL_TITLES: Record<
  AboutTabId,
  { eyebrow: string; title: string }
> = {
  story: {
    eyebrow: "Who we are",
    title: "We buy from origin. We sell to bulk buyers.",
  },
  capabilities: {
    eyebrow: "What we coordinate",
    title: "Procurement and distribution programmes",
  },
  process: {
    eyebrow: "How we work",
    title: "A clear path from request to delivery",
  },
  global: {
    eyebrow: "Global reach",
    title: "Sourced responsibly. Delivered globally.",
  },
};

export const ABOUT_CAPABILITY_CARDS = [
  {
    title: "Specification alignment",
    body:
      "Edible oils, sugar, rice & grains, beans, coffee, and related programmes — grades and packaging matched to corridor and buyer requirements.",
    image: AGRICULTURE_IMAGES.greenGrainField,
  },
  {
    title: "Inspection coordination",
    body:
      "Third-party inspection when agreed in contract. Agency, scope, and sampling points are transaction-specific — never assumed.",
    image: AGRICULTURE_IMAGES.combineHarvest,
  },
  {
    title: "FOB & CIF structures",
    body:
      "Structures commonly discussed with industrial buyers and refiners. Risk transfer follows the signed Incoterms and contract wording.",
    image: AGRICULTURE_IMAGES.grainSilos,
  },
  {
    title: "Documentation discipline",
    body:
      "Contracts, shipping papers, and bank-facing checklists aligned before negotiation instruments are presented.",
    image: AGRICULTURE_IMAGES.tractorPlowing,
  },
] as const;

export const ABOUT_PROCESS_STEPS = [
  {
    n: "01",
    title: "Submit request",
    text: "Share product, quantity, destination, and preferred Incoterms through the RFQ form.",
  },
  {
    n: "02",
    title: "Review & quote",
    text: "Trade desk reviews fit against available inventory, procurement programmes, and workable logistics structures.",
  },
  {
    n: "03",
    title: "Contract & docs",
    text: "Agreed PSA/SPA and banking wording proceed only after mutual confirmation.",
  },
  {
    n: "04",
    title: "Inspection & delivery",
    text: "Inspection, packaging, and shipment milestones follow the signed contract.",
  },
] as const;

export const ABOUT_CORRIDORS = [
  "Brazil",
  "India",
  "Vietnam",
  "Thailand",
  "Indonesia",
  "UAE",
  "Turkey",
  "EU",
  "West Africa",
  "East Africa",
] as const;

export const ABOUT_QUICK_LINKS = [
  { href: "/products", label: "Product catalogue" },
  { href: "/inspections", label: "Inspection coordination" },
  { href: "/resources", label: "How we trade" },
  { href: "/partners", label: "Partner network" },
] as const;
