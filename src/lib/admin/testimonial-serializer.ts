import type { TestimonialLean } from "@/models";

export type AdminTestimonialItem = {
  _id: string;
  quote: string;
  attribution: string;
  company: string;
  status: "published" | "unpublished";
  isPlaceholder: boolean;
  createdAt: string | null;
};

export function serializeTestimonial(doc: TestimonialLean): AdminTestimonialItem {
  return {
    _id: String(doc._id),
    quote: doc.quote,
    attribution: doc.attribution,
    company: doc.company ?? "",
    status: doc.status,
    isPlaceholder: doc.isPlaceholder,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : null,
  };
}
