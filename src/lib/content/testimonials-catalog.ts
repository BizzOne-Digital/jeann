import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_TESTIMONIALS } from "@/lib/content/testimonials-seed";

export type PublicTestimonial = {
  id: string;
  quote: string;
  attribution: string;
  company: string;
};

function fromSeed(): PublicTestimonial[] {
  return SEED_TESTIMONIALS.filter((item) => item.status === "published").map((item, index) => ({
    id: `seed-${index}`,
    quote: item.quote,
    attribution: item.attribution,
    company: item.company,
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
    .sort({ createdAt: -1 })
    .lean();

  if (docs.length === 0) return fromSeed();

  return docs.map((doc) => ({
    id: String(doc._id),
    quote: doc.quote,
    attribution: doc.attribution,
    company: doc.company ?? "",
  }));
}

export function getPublishedTestimonialsSync(): PublicTestimonial[] {
  return fromSeed();
}
