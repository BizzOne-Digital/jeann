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
  {
    quote:
      "Our canola oil programme required tight coordination between inspection, load port and banking presentation. Finekarts kept each party aligned without overpromising on timelines.",
    name: "Priya Sharma",
    position: "Trading Manager",
    company: "Indo-Pacific Oils Pvt Ltd",
    rating: 5,
    reviewedAt: "2025-05-28",
    status: "published",
  },
  {
    quote:
      "We appreciated honest feedback when a corridor was not workable for our parcel size. That saved us weeks compared with brokers who only push volume.",
    name: "Michael Torres",
    position: "Procurement Director",
    company: "Andean Food Ingredients SA",
    rating: 5,
    reviewedAt: "2025-04-15",
    status: "published",
  },
  {
    quote:
      "Flexitank and documentation for a soybean oil shipment were explained clearly before we signed. The team understood both supplier constraints and our buyer requirements.",
    name: "Yuki Tanaka",
    position: "Import Operations Lead",
    company: "Tokyo Grain & Oil Trading",
    rating: 5,
    reviewedAt: "2025-03-22",
    status: "published",
  },
  {
    quote:
      "Finekarts supported our first ICUMSA sugar enquiry with realistic packaging options and inspection scope. We knew what was confirmed versus what still needed supplier verification.",
    name: "Claire Dubois",
    position: "Commodity Analyst",
    company: "Société Sucrière Atlantique",
    rating: 4,
    reviewedAt: "2025-02-10",
    status: "published",
  },
  {
    quote:
      "Shipment updates and document checklists were shared proactively during a delayed vessel window. Communication stayed professional when schedules slipped.",
    name: "David Osei",
    position: "Logistics Coordinator",
    company: "Accra Commodities Hub",
    rating: 5,
    reviewedAt: "2025-01-19",
    status: "published",
  },
  {
    quote:
      "We use Finekarts for due diligence on new counterparties before larger contracts. Reports are detailed enough for our compliance team without unnecessary jargon.",
    name: "Anna Bergström",
    position: "Risk & Compliance Officer",
    company: "Baltic Bulk Trading AB",
    rating: 5,
    reviewedAt: "2024-12-08",
    status: "published",
  },
];
