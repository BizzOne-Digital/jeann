import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/marketing/BookingForm";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getSite } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Request a trade desk consultation. Preferred times are not confirmed until Finekarts staff responds.",
};

export default function BookingPage() {
  const site = getSite();

  return (
    <>
      <PageHero
        title="Book a consultation"
        description="Request a conversation about RFQs, logistics, or supplier onboarding. A submitted request is not a confirmed appointment."
        primaryCta={{ href: "#booking-form", label: "Request a time →" }}
        secondaryCta={{ href: "/contact", label: "Contact the desk" }}
      />

      <section id="booking-form" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Trade desk
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
                Schedule a conversation
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-[#555555]">
                Include your timezone and a realistic time window. Our team may propose alternative
                slots based on availability and enquiry priority.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-sm leading-relaxed text-[#666666]">
                For urgent trade matters you may also email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
                >
                  {site.email}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${site.phone}`}
                  className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
                >
                  {site.phoneDisplay}
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mt-8 space-y-0 border-t border-[#d5d0c8]">
                {[
                  "Preferred times are requests only — confirmation comes from Finekarts staff.",
                  "RFQ and logistics discussions are handled by the trade desk.",
                  "Supplier onboarding conversations remain invitation-led after review.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-[#d5d0c8] py-4 text-sm leading-relaxed text-[#555555]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.22}>
              <Link
                href="/trade#purchase-request"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
              >
                Prefer to submit an RFQ instead? <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.08} y={20}>
            <div className="border border-[#e4e0d8] bg-white p-6 sm:p-8">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
