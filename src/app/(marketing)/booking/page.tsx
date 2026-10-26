import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { BuyerPortalGate } from "@/components/marketing/BuyerPortalGate";
import { getSite } from "@/lib/content/catalog";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  BOOKING_HERO_DEFAULTS,
  BOOKING_PORTAL_GATE_DEFAULTS,
  BOOKING_SCHEDULE_DEFAULTS,
  cmsMerged,
} from "@/lib/marketing/simple-pages-cms";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Request a trade desk consultation through the buyer portal. Preferred times are not confirmed until Finekarts staff responds.",
};

export default async function BookingPage() {
  const site = getSite();
  const cms = await getPublishedPage("booking");
  const sections = collectCmsSections(cms, ["schedule", "portal-gate"]);
  const schedule = cmsMerged(sections, "schedule", BOOKING_SCHEDULE_DEFAULTS);
  const gate = cmsMerged(sections, "portal-gate", BOOKING_PORTAL_GATE_DEFAULTS);

  return (
    <>
      <CmsPageHero
        pageSlug="booking"
        defaults={{
          title: BOOKING_HERO_DEFAULTS.title,
          description: BOOKING_HERO_DEFAULTS.description,
          primaryCta: {
            href: BOOKING_HERO_DEFAULTS.primaryCtaHref,
            label: BOOKING_HERO_DEFAULTS.primaryCtaLabel,
          },
          secondaryCta: {
            href: BOOKING_HERO_DEFAULTS.secondaryCtaHref,
            label: BOOKING_HERO_DEFAULTS.secondaryCtaLabel,
          },
        }}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-3xl font-semibold text-[var(--navy)] sm:text-4xl">
                {schedule.title}
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 text-base leading-relaxed text-[var(--stone)]">
                {schedule.body}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base leading-relaxed text-[var(--stone)]">
                {schedule.emailPrefix}{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-[var(--navy)] underline">
                  {site.email}
                </a>{" "}
                {schedule.phonePrefix}{" "}
                <a href={`tel:${site.phone}`} className="font-semibold text-[var(--navy)] underline">
                  {site.phoneDisplay}
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <Link
                href={schedule.resourcesHref}
                className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[var(--ocean)] transition hover:gap-3"
              >
                {schedule.resourcesLabel} <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.08} y={20}>
            <BuyerPortalGate
              title={gate.title}
              description={gate.description}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
