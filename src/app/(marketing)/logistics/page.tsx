import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import {
  LogisticsFullBleedBand,
  LogisticsPairedStack,
  LogisticsPhotoBackdropSection,
  LogisticsPairedRow,
  LogisticsSplitPanel,
} from "@/components/marketing/LogisticsVisuals";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { TraderRoleNotice } from "@/components/marketing/TraderRoleNotice";
import { Reveal } from "@/components/motion/Reveal";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import {
  LOGISTICS_PAGE_SECTION_IMAGES,
  LOGISTICS_SHIP_TRUCK_BAND,
} from "@/lib/content/logistics-images";
import { LOGISTICS_HERO } from "@/lib/content/logistics-content";
import { getPublishedPage } from "@/lib/content/page-content";
import { buildLogisticsContent, LOGISTICS_CMS_SECTION_IDS } from "@/lib/marketing/logistics-cms";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("logistics", {
    title: "Trade logistics coordination",
    description:
      "Finekarts is a bulk commodity trader that coordinates FOB and CIF shipping, documentation, and tracking with carriers and forwarders — not a freight operator.",
  });
}

export default async function LogisticsPage() {
  const cmsPage = await getPublishedPage("logistics");
  const cms = collectCmsSections(cmsPage, [...LOGISTICS_CMS_SECTION_IDS]);
  const content = buildLogisticsContent(cms);
  const story = content.story;

  return (
    <>
      <CmsPageHero
        pageSlug="logistics"
        defaults={{
          title: LOGISTICS_HERO.title,
          description: LOGISTICS_HERO.description,
          primaryCta: LOGISTICS_HERO.primaryCta,
          secondaryCta: LOGISTICS_HERO.secondaryCta,
        }}
      />

      <section className="bg-white marketing-section pt-0">
        <div className="container-page -mt-4">
          <TraderRoleNotice />
        </div>
      </section>

      <MarketingStorySection
        eyebrow={story.eyebrow}
        title={story.title}
        lead={story.lead}
        boxes={story.boxes}
        imageSrc={story.imageSrc}
        imageAlt={story.imageAlt}
        youtubeUrl={story.youtubeUrl}
        videoTitle="Logistics overview"
        variant="reversed"
        background="cream"
      />

      <section id="incoterms" className="bg-[var(--mist)] marketing-section">
        <div className="container-page">
          <LogisticsSplitPanel image={LOGISTICS_PAGE_SECTION_IMAGES.globalCoverage} reversed>
            <div>
              <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
                {content.globalCoverage.title}
              </h2>
              <p className="mt-3 text-base text-[#555555]">{content.globalCoverage.lead}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.globalCoverage.incoterms.map((term) => (
                  <span
                    key={term}
                    className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d]"
                  >
                    {term}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#555555]">{content.globalCoverage.note}</p>
            </div>
          </LogisticsSplitPanel>

          <div className="mt-10">
            <p className="text-sm font-semibold text-[#001a3d]">
              <Link
                href={content.incotermsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c88e4a] underline decoration-[#c88e4a]/40 underline-offset-4 hover:text-[#a86f2e]"
              >
                FOB, CIF &amp; DDP — ICC Incoterms® 2020
              </Link>
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.fobCifTerms.map((term) => (
                <article key={term.code} className="marketing-box h-full rounded-lg p-6 sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                    {term.code}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{term.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#555555]">{term.summary}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-[#001a3d]">
            {content.incotermsPrimaryNote}
          </p>
        </div>
      </section>

      <LogisticsFullBleedBand image={LOGISTICS_SHIP_TRUCK_BAND} />

      <section className="bg-white marketing-section">
        <div className="container-page">
          <LogisticsPairedStack
            rows={[
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.realTimeTrackingPrimary,
                content: (
                  <article>
                    <h2 className="text-2xl font-semibold text-[#001a3d]">{content.tracking.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.tracking.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {content.tracking.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#555555]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-[#555555]">{content.tracking.note}</p>
                  </article>
                ),
              },
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.realTimeTrackingSecondary,
                boxed: true,
                content: (
                  <article>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.eta.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.eta.lead}</p>
                    <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
                      {content.eta.flow}
                    </p>
                    <p className="mt-4 text-sm text-[#555555]">{content.eta.note}</p>
                    <p className="mt-6 text-sm font-semibold text-[#c88e4a]">{content.eta.goal}</p>
                  </article>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className="bg-[var(--mist)] marketing-section">
        <div className="container-page">
          <LogisticsSplitPanel image={LOGISTICS_PAGE_SECTION_IMAGES.portToPort} reversed>
            <div>
              <h2 className="text-2xl font-semibold text-[#001a3d]">{content.portChain.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.portChain.lead}</p>
              <ol className="mt-8 space-y-3">
                {content.portChain.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071525] text-xs font-semibold text-[#d4a84b]">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm text-[#555555]">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-[#555555]">{content.portChain.note}</p>
            </div>
          </LogisticsSplitPanel>
        </div>
      </section>

      <LogisticsFullBleedBand
        image={LOGISTICS_PAGE_SECTION_IMAGES.bleedSecondary}
        heightClass="h-40 sm:h-48 lg:h-56"
      />

      <section className="bg-white marketing-section">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{content.shippingModesIntro.title}</h2>
          <p className="mt-3 max-w-3xl text-sm text-[#555555]">
            {content.shippingModesIntro.description}
          </p>
          {(() => {
            const [bulkVessel, ...otherModes] = content.shippingModes;
            const surfaces = [
              "bg-white",
              "bg-[#f9f8f5]",
              "bg-[#eef3f7]",
              "bg-[#faf6f0]",
              "bg-[#f5f0e8]",
              "bg-[#f0f4f8]",
            ];
            return (
              <>
                {bulkVessel ? (
                  <div className="mt-10">
                    <LogisticsPairedRow
                      image={LOGISTICS_PAGE_SECTION_IMAGES.bulkVesselMode}
                      reversed
                      boxed
                    >
                      <h3 className="font-semibold text-[#001a3d]">{bulkVessel.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#555555]">{bulkVessel.text}</p>
                    </LogisticsPairedRow>
                  </div>
                ) : null}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherModes.map((mode, index) => (
                    <Reveal key={mode.title} delay={index * 0.03}>
                      <article
                        className={`h-full rounded-lg border border-[#e8e4dc] p-5 sm:p-6 shadow-sm ${surfaces[(index + 1) % surfaces.length]}`}
                      >
                        <h3 className="font-semibold text-[#001a3d]">{mode.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#555555]">{mode.text}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      <section className="bg-[var(--mist)] marketing-section">
        <div className="container-page">
          <LogisticsPairedRow image={LOGISTICS_PAGE_SECTION_IMAGES.documentation}>
            <div>
              <h2 className="text-2xl font-semibold text-[#001a3d]">{content.documentation.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.documentation.lead}</p>
              <p className="mt-4 text-sm font-medium text-[#001a3d]">{content.documentation.intro}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {content.documentation.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#555555]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[#555555]">{content.documentation.note}</p>
            </div>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <LogisticsPairedStack
            rows={[
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.coordinationPrimary,
                reversed: true,
                boxed: true,
                content: (
                  <article>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.coordination.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.coordination.lead}</p>
                    <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
                      {content.coordination.parties}
                    </p>
                    <p className="mt-4 text-sm text-[#555555]">{content.coordination.note}</p>
                  </article>
                ),
              },
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.coordinationSecondary,
                reversed: true,
                content: (
                  <article>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.reliability.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.reliability.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {content.reliability.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#555555]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-[#001a3d]">
                      {content.reliability.commitment}
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-[#777777]">
                      {content.reliability.disclaimer}
                    </p>
                  </article>
                ),
              },
            ]}
          />
        </div>
      </section>

      <LogisticsPhotoBackdropSection image={LOGISTICS_PAGE_SECTION_IMAGES.contractToCargo}>
        <h2 className="text-2xl font-semibold sm:text-3xl">{content.contractBand.title}</h2>
        <p className="mt-3 max-w-3xl text-sm text-white/75">
          {content.contractBand.lead}
        </p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.contractCargoSteps.map((step) => (
            <li
              key={step.step}
              className="rounded-lg border border-white/15 bg-[#071525]/45 p-5 shadow-lg backdrop-blur-md"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
                {String(step.step).padStart(2, "0")} — {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{step.text}</p>
            </li>
          ))}
        </ol>
      </LogisticsPhotoBackdropSection>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <LogisticsSplitPanel image={LOGISTICS_PAGE_SECTION_IMAGES.closing} reversed>
            <div>
              <h2 className="text-2xl font-semibold text-[#001a3d]">{content.closing.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.closing.lead}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555]">{content.closing.body}</p>
              <p className="mt-6 text-lg font-semibold text-[#001a3d]">{content.closing.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.closing.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-[#777777]">{content.incotermsDisclaimer}</p>
            </div>
          </LogisticsSplitPanel>
        </div>
      </section>

      <section
        id="request-quote"
        className="relative overflow-hidden bg-[#071525] py-16 text-white lg:py-20"
      >
        <div className="container-page relative">
          <h2 className="text-2xl font-semibold sm:text-3xl">{content.cta.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{content.cta.lead}</p>
          <p className="mt-4 text-sm text-white/70">Include: {content.cta.fields.join(" · ")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              Buyer portal — submit request <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact trade desk
            </Link>
            <Link
              href="/resources"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Trade documents
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
