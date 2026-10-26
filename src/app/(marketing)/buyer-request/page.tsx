import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsLines } from "@/lib/content/cms-field";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  BUYER_REQUEST_DISCLAIMER_DEFAULTS,
  BUYER_REQUEST_FORM_CARD_DEFAULTS,
  BUYER_REQUEST_HERO_DEFAULTS,
  BUYER_REQUEST_STEPS_DEFAULTS,
  cmsMerged,
} from "@/lib/marketing/simple-pages-cms";

export const metadata: Metadata = {
  title: "Buyer Purchase Request",
  description:
    "Submit a structured purchase request for bulk agricultural commodities through the Finekarts buyer portal after registration and approval.",
};

export default async function BuyerRequestPage() {
  const cms = await getPublishedPage("buyer-request");
  const sections = collectCmsSections(cms, ["steps", "form-card", "disclaimer"]);
  const stepsText = cmsMerged(sections, "steps", BUYER_REQUEST_STEPS_DEFAULTS);
  const steps = cmsLines(sections.steps, "stepItems", BUYER_REQUEST_STEPS_DEFAULTS.stepItems.split("\n"));
  const card = cmsMerged(sections, "form-card", BUYER_REQUEST_FORM_CARD_DEFAULTS);
  const disclaimer = cmsMerged(sections, "disclaimer", BUYER_REQUEST_DISCLAIMER_DEFAULTS);
  return (
    <>
      <CmsPageHero
        pageSlug="buyer-request"
        tone="dark"
        defaults={{
          title: BUYER_REQUEST_HERO_DEFAULTS.title,
          description: BUYER_REQUEST_HERO_DEFAULTS.description,
          primaryCta: {
            href: BUYER_REQUEST_HERO_DEFAULTS.primaryCtaHref,
            label: BUYER_REQUEST_HERO_DEFAULTS.primaryCtaLabel,
          },
          secondaryCta: {
            href: BUYER_REQUEST_HERO_DEFAULTS.secondaryCtaHref,
            label: BUYER_REQUEST_HERO_DEFAULTS.secondaryCtaLabel,
          },
        }}
      />

      <section className="bg-white marketing-section">
        <div className="container-page max-w-3xl space-y-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[var(--navy)]">{stepsText.title}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-[var(--stone)]">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--cream)]/50 p-6">
              <h3 className="font-semibold text-[var(--navy)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--stone)]">
                {card.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={card.primaryHref} className="btn btn-primary">
                  {card.primaryLabel}
                </Link>
                <Link href={card.secondaryHref} className="btn btn-secondary">
                  {card.secondaryLabel}
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm text-[var(--stone)]">
              {disclaimer.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
