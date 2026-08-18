import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { BuyerPortalGate } from "@/components/marketing/BuyerPortalGate";
import { getSite } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Request a trade desk consultation through the buyer portal. Preferred times are not confirmed until Finekarts staff responds.",
};

export default function BookingPage() {
  const site = getSite();

  return (
    <>
      <PageHero
        tone="light"
        title="Book a consultation"
        description="Request a conversation about RFQs, logistics, or qualification. A submitted request is not a confirmed appointment."
        primaryCta={{ href: "/login", label: "Sign in to book →" }}
        secondaryCta={{ href: "/register/buyer", label: "Register" }}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-3xl font-semibold text-[var(--navy)] sm:text-4xl">
                Schedule a conversation
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 text-base leading-relaxed text-[var(--stone)]">
                Include your timezone and a realistic time window. Our team may propose alternative
                slots based on availability and enquiry priority.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base leading-relaxed text-[var(--stone)]">
                Email{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-[var(--navy)] underline">
                  {site.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${site.phone}`} className="font-semibold text-[var(--navy)] underline">
                  {site.phoneDisplay}
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <Link
                href="/resources"
                className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[var(--ocean)] transition hover:gap-3"
              >
                Browse resources first <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.08} y={20}>
            <BuyerPortalGate
              title="Consultation booking"
              description="Signed-in buyers can request a consultation from the buyer portal. Staff confirms appointments — calendar integration is optional."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
