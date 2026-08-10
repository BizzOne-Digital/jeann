import { Schema, model, models } from "mongoose";
import { seoSchema, type LeanDoc, type SeoFields } from "./shared";

export type BlogPostStatus = "draft" | "published" | "archived";

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  authorName: string;
  categories: string[];
  tags: string[];
  seo?: SeoFields;
  status: BlogPostStatus;
  publishedAt?: Date;
  locale: string;
}

export type BlogPostLean = LeanDoc<IBlogPost>;

const blogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String },
    body: { type: String, required: true },
    coverImage: { type: String },
    authorName: { type: String, required: true, trim: true },
    categories: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    seo: seoSchema,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    locale: { type: String, required: true, default: "en", trim: true },
  },
  { timestamps: true },
);

blogPostSchema.index({ slug: 1, locale: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ categories: 1, status: 1 });

export const BlogPost = models.BlogPost ?? model<IBlogPost>("BlogPost", blogPostSchema);
