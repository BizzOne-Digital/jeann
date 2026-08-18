import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client testimonials appear on Finekarts only when explicitly approved through the CMS.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="What counterparties say"
        description="We publish testimonials only after CMS approval. There are no fabricated quotes on this site."
        primaryCta={{ href: "/contact", label: "Start a conversation →" }}
        secondaryCta={{ href: "/resources", label: "Trade resources" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <div className="border border-[#d5d0c8] bg-white px-6 py-14 text-center sm:px-10">
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              No approved testimonials published
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#666666]">
              When verified counterparties provide approved statements, they will appear here with
              attribution controlled by admin — not marketing filler.
            </p>
            <Link
              href="/contact"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Start a conversation <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
