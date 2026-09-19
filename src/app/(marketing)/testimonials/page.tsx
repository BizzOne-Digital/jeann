import type { Metadata } from "next";
import { TestimonialsPageContent } from "@/components/marketing/TestimonialsPageContent";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("testimonials", {
    title: "Testimonials",
    description:
      "Client testimonials from verified counterparties working with Finekarts on global commodity trade.",
  });
}

export default function TestimonialsPage() {
  return <TestimonialsPageContent />;
}
