import type { Metadata } from "next";
import { TestimonialsPageContent } from "@/components/marketing/TestimonialsPageContent";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client testimonials from verified counterparties working with Finekarts on global commodity trade.",
};

export default function TestimonialsAtTermsPage() {
  return <TestimonialsPageContent />;
}
