import type { TestimonialRating } from "@/lib/content/testimonials-shared";

export type SeedTestimonial = {
  quote: string;
  name: string;
  position: string;
  company: string;
  photo?: string;
  rating: TestimonialRating;
  reviewedAt?: string;
  status: "published" | "unpublished";
};

export const SEED_TESTIMONIALS: SeedTestimonial[] = [
  {
    quote:
      "Finekarts coordinated our first refined sunflower oil programme from enquiry through documentation. Each milestone was clear, and we always knew who owned the next step.",
    name: "James Whitfield",
    position: "Director of Procurement",
    company: "North Atlantic Foods Ltd",
    rating: 5,
    reviewedAt: "2025-11-12",
    status: "published",
  },
  {
    quote:
      "We needed structured packaging and inspection options for edible oils moving into the Mediterranean. The trade desk responded with practical routes rather than generic assurances.",
    name: "Sofia Marinelli",
    position: "Supply Chain Lead",
    company: "Mediterranean Oils Trading",
    rating: 5,
    reviewedAt: "2025-10-03",
    status: "published",
  },
  {
    quote:
      "Documentation tracking on our long-grain rice shipment was transparent from contract review through loading. That level of visibility is what we expect from a serious trade partner.",
    name: "Khalid Al-Rashid",
    position: "Import Manager",
    company: "Gulf Commodities Group",
    rating: 5,
    reviewedAt: "2025-09-18",
    status: "published",
  },
  {
    quote:
      "When our sugar enquiry moved quickly, Finekarts kept specifications, incoterms, and inspection routing aligned across parties. It reduced back-and-forth with our finance team.",
    name: "Elena Kowalska",
    position: "Commodity Buyer",
    company: "Central European Sweeteners",
    rating: 5,
    reviewedAt: "2025-08-22",
    status: "published",
  },
  {
    quote:
      "We have used Finekarts for beans across two seasons. Consistent communication and realistic availability updates have made repeat programmes straightforward.",
    name: "Amara Okafor",
    position: "Head of Sourcing",
    company: "West Africa Agro Imports",
    rating: 5,
    reviewedAt: "2025-07-06",
    status: "published",
  },
  {
    quote:
      "Their verification workflow gave our board confidence before we committed to a new palm oil corridor. Reports were structured, sourced, and easy to share internally.",
    name: "Henrik Lund",
    position: "Chief Operating Officer",
    company: "Nordic Edible Oils AB",
    rating: 5,
    reviewedAt: "2025-06-14",
    status: "published",
  },
];
