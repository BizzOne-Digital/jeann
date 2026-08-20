import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { PartnerProfileCard } from "@/components/marketing/PartnerSections";
import { Reveal } from "@/components/motion/Reveal";
import { getPartners, PARTNERS_PAGE_INTRO } from "@/lib/content/partners-catalog";

export const metadata: Metadata = {
  title: "Verification partners",
  description:
    "Independent inspection, certification, and verification partners supporting transparent international commodity trade.",
};

export default function PartnersPage() {
  const partners = getPartners();

  return (
    <>
      <PageHero
        tone="light"
        title={PARTNERS_PAGE_INTRO.title}
        description={PARTNERS_PAGE_INTRO.lead}
        primaryCta={{ href: "#partners-list", label: "Browse partners →" }}
        secondaryCta={{ href: "/inspections", label: "Inspection overview" }}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {PARTNERS_PAGE_INTRO.note}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              Each profile below uses the <strong className="font-semibold text-[var(--navy)]">partner name</strong>, a
              short <strong className="font-semibold text-[var(--navy)]">intro</strong>, a{" "}
              <strong className="font-semibold text-[var(--navy)]">photo</strong>, and descriptive{" "}
              <strong className="font-semibold text-[var(--navy)]">text content</strong> — no logos required.
              Send updated copy and images to your administrator when ready.
            </p>
          </Reveal>

          <div id="partners-list" className="mt-12 space-y-10 scroll-mt-28">
            {partners.map((partner) => (
              <PartnerProfileCard key={partner.slug} partner={partner} />
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-lg border border-[var(--line)] bg-[var(--cream)] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--navy)]">Adding or updating partners</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--stone)]">
                For each company provide: name, intro line, photo file, and descriptive paragraphs.
                Place photos in{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-sm text-[var(--ocean)]">
                  public/images/partners/
                </code>{" "}
                and update{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-sm text-[var(--ocean)]">
                  src/lib/content/partners-catalog.ts
                </code>
                .
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Contact us
                </Link>
                <Link href="/resources" className="btn btn-secondary">
                  Trade resources
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
