import { Schema, model, models } from "mongoose";
import { seoSchema, type LeanDoc, type SeoFields } from "./shared";

export type PageStatus = "draft" | "published" | "archived";
export type PageBlockType =
  | "hero"
  | "richText"
  | "cta"
  | "image"
  | "faq"
  | "process"
  | "stats";

export interface PageHeroBlock {
  type: "hero";
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export interface PageRichTextBlock {
  type: "richText";
  content: string;
}

export interface PageCtaBlock {
  type: "cta";
  headline: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface PageImageBlock {
  type: "image";
  storageKey: string;
  alt?: string;
  caption?: string;
}

export interface PageFaqBlock {
  type: "faq";
  faqIds: string[];
}

export interface PageProcessBlock {
  type: "process";
  steps: { title: string; description?: string }[];
}

export interface PageStatsBlock {
  type: "stats";
  items: { label: string; value: string }[];
}

export type PageSection =
  | PageHeroBlock
  | PageRichTextBlock
  | PageCtaBlock
  | PageImageBlock
  | PageFaqBlock
  | PageProcessBlock
  | PageStatsBlock;

export interface IPage {
  slug: string;
  title: string;
  sections: PageSection[];
  seo?: SeoFields;
  status: PageStatus;
  locale: string;
}

export type PageLean = LeanDoc<IPage>;

const pageSectionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["hero", "richText", "cta", "image", "faq", "process", "stats"],
      required: true,
    },
    headline: { type: String },
    subheadline: { type: String },
    ctaLabel: { type: String },
    ctaHref: { type: String },
    backgroundImage: { type: String },
    content: { type: String },
    body: { type: String },
    buttonLabel: { type: String },
    buttonHref: { type: String },
    storageKey: { type: String },
    alt: { type: String },
    caption: { type: String },
    faqIds: [{ type: String }],
    steps: [
      {
        title: { type: String, required: true },
        description: { type: String },
      },
    ],
    items: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { _id: false },
);

const pageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    sections: [pageSectionSchema],
    seo: seoSchema,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    locale: { type: String, required: true, default: "en", trim: true },
  },
  { timestamps: true },
);

pageSchema.index({ slug: 1, locale: 1 }, { unique: true });
pageSchema.index({ status: 1, locale: 1 });

export const Page = models.Page ?? model<IPage>("Page", pageSchema);
