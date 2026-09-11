import type { TestimonialLean } from "@/models";
import { clampRating } from "@/lib/content/testimonials-shared";

export type AdminTestimonialItem = {
  _id: string;
  quote: string;
  name: string;
  position: string;
  company: string;
  photo: string;
  rating: number;
  reviewedAt: string | null;
  status: "published" | "unpublished";
  isPlaceholder: boolean;
  createdAt: string | null;
};

function resolveName(doc: TestimonialLean): string {
  if (doc.name?.trim()) return doc.name.trim();
  return "Verified client";
}

function resolvePosition(doc: TestimonialLean): string {
  if (doc.position?.trim()) return doc.position.trim();
  if (doc.attribution?.trim()) return doc.attribution.trim();
  return "";
}

export function serializeTestimonial(doc: TestimonialLean): AdminTestimonialItem {
  return {
    _id: String(doc._id),
    quote: doc.quote,
    name: resolveName(doc),
    position: resolvePosition(doc),
    company: doc.company ?? "",
    photo: doc.photo ?? "",
    rating: clampRating(doc.rating),
    reviewedAt: doc.reviewedAt ? new Date(doc.reviewedAt).toISOString().slice(0, 10) : null,
    status: doc.status,
    isPlaceholder: doc.isPlaceholder,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : null,
  };
}
