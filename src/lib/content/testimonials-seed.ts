export type SeedTestimonial = {
  quote: string;
  attribution: string;
  company: string;
  status: "published" | "unpublished";
};

export const SEED_TESTIMONIALS: SeedTestimonial[] = [
  {
    quote:
      "Finekarts coordinated our first refined sunflower oil programme from enquiry through documentation. Each milestone was clear, and we always knew who owned the next step.",
    attribution: "Director of Procurement",
    company: "North Atlantic Foods Ltd",
    status: "published",
  },
  {
    quote:
      "We needed structured packaging and inspection options for edible oils moving into the Mediterranean. The trade desk responded with practical routes rather than generic assurances.",
    attribution: "Supply Chain Lead",
    company: "Mediterranean Oils Trading",
    status: "published",
  },
  {
    quote:
      "Documentation tracking on our long-grain rice shipment was transparent from contract review through loading. That level of visibility is what we expect from a serious trade partner.",
    attribution: "Import Manager",
    company: "Gulf Commodities Group",
    status: "published",
  },
  {
    quote:
      "When our sugar enquiry moved quickly, Finekarts kept specifications, incoterms, and inspection routing aligned across parties. It reduced back-and-forth with our finance team.",
    attribution: "Commodity Buyer",
    company: "Central European Sweeteners",
    status: "published",
  },
  {
    quote:
      "We have used Finekarts for beans across two seasons. Consistent communication and realistic availability updates have made repeat programmes straightforward.",
    attribution: "Head of Sourcing",
    company: "West Africa Agro Imports",
    status: "published",
  },
];
