import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";

export type ProductDetailTabId = "overview" | "specifications" | "packaging" | "gallery";

export type ProductDetailContent = {
  grade: string;
  subtitle: string;
  description: string;
  applications: string[];
  characteristics: string[];
  packaging: string[];
  note?: string;
  highlights: string[];
  images?: { src: string; alt: string }[];
};

export type ProductTradeSpecs = {
  gradeSummary: string;
  originOptions: string[];
  incotermOptions: string[];
  packaging: string[];
  inspectionOptions: string[];
  documentCategories: string[];
  availabilityText: string;
  minOrderText: string;
  status: "draft" | "pending_verification" | "published";
};

export const PRODUCT_PILLARS: {
  id: ProductDetailTabId;
  title: string;
  summary: string;
  icon: "info" | "chart" | "box" | "image";
}[] = [
  {
    id: "overview",
    title: "Product overview",
    summary: "Applications, characteristics, and why buyers enquire on this grade.",
    icon: "info",
  },
  {
    id: "specifications",
    title: "Specifications",
    summary: "Example grade summary, origins, Incoterms, and document categories.",
    icon: "chart",
  },
  {
    id: "packaging",
    title: "Packaging & logistics",
    summary: "Packaging formats, MOQ, availability, and related trade services.",
    icon: "box",
  },
  {
    id: "gallery",
    title: "Gallery",
    summary: "Product reference images and field photography.",
    icon: "image",
  },
];

export const PRODUCT_RELATED_LINKS = [
  { href: "/packaging", label: "Packaging options" },
  { href: "/logistics", label: "Logistics & freight" },
  { href: "/inspections", label: "Inspection services" },
  { href: "/verification", label: "Quality verification" },
  { href: "/resources", label: "Trade resources" },
] as const;

export const PRODUCT_PANEL_TITLES: Record<
  ProductDetailTabId,
  { eyebrow: string; title: string }
> = {
  overview: {
    eyebrow: "Grade profile",
    title: "Applications, characteristics, and buyer highlights",
  },
  specifications: {
    eyebrow: "Trade reference",
    title: "Example specifications for enquiry discussions",
  },
  packaging: {
    eyebrow: "Supply chain",
    title: "Packaging, availability, and related services",
  },
  gallery: {
    eyebrow: "Visual reference",
    title: "Product and field photography",
  },
};

export type ProductHubProps = {
  productName: string;
  categoryName: string;
  categorySlug: string;
  content: ProductDetailContent;
  trade: ProductTradeSpecs;
  pillars: MarketingContentBox[];
  heroImage: string;
  heroImageAlt: string;
  quoteHref: string;
  youtubeUrl?: string;
  videoTitle?: string;
};
