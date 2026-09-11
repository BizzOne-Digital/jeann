import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_TESTIMONIALS } from "@/lib/content/testimonials-seed";
import {
  clampRating,
  type TestimonialRating,
} from "@/lib/content/testimonials-shared";
import type { TestimonialLean } from "@/models";

export type PublicTestimonial = {
  id: string;
  quote: string;
  name: string;
  position: string;
  company: string;
  photo: string;
  rating: TestimonialRating;
  reviewedAt: string | null;
};

function resolveName(doc: Pick<TestimonialLean, "name">): string {
  if (doc.name?.trim()) return doc.name.trim();
  return "Verified client";
}

function resolvePosition(doc: Pick<TestimonialLean, "position" | "attribution">): string {
  if (doc.position?.trim()) return doc.position.trim();
  if (doc.attribution?.trim()) return doc.attribution.trim();
  return "";
}

function mapDoc(doc: TestimonialLean): PublicTestimonial {
  return {
    id: String(doc._id),
    quote: doc.quote,
    name: resolveName(doc),
    position: resolvePosition(doc),
    company: doc.company ?? "",
    photo: doc.photo ?? "",
    rating: clampRating(doc.rating),
    reviewedAt: doc.reviewedAt ? new Date(doc.reviewedAt).toISOString() : null,
  };
}

function fromSeed(): PublicTestimonial[] {
  return SEED_TESTIMONIALS.filter((item) => item.status === "published").map((item, index) => ({
    id: `seed-${index}`,
    quote: item.quote,
    name: item.name,
    position: item.position,
    company: item.company,
    photo: item.photo ?? "",
    rating: item.rating,
    reviewedAt: item.reviewedAt ? new Date(item.reviewedAt).toISOString() : null,
  }));
}

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  if (!isMongoConfigured()) return fromSeed();
  const conn = await tryConnectMongo();
  if (!conn) return fromSeed();

  const { Testimonial } = await import("@/models");
  const docs = await Testimonial.find({
    status: "published",
    isPlaceholder: false,
  })
    .sort({ reviewedAt: -1, createdAt: -1 })
    .lean();

  if (docs.length === 0) return fromSeed();

  return docs.map(mapDoc);
}

export function getPublishedTestimonialsSync(): PublicTestimonial[] {
  return fromSeed();
}

export function getTestimonialSummary(testimonials: PublicTestimonial[]) {
  if (testimonials.length === 0) {
    return { count: 0, averageRating: 0 };
  }

  const total = testimonials.reduce((sum, item) => sum + item.rating, 0);
  return {
    count: testimonials.length,
    averageRating: Math.round((total / testimonials.length) * 10) / 10,
  };
}
