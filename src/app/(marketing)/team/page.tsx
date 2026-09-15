import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { BoardDirectorsSection, TeamGrid } from "@/components/marketing/TeamSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Reveal } from "@/components/motion/Reveal";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import { getPublishedTeamMembers } from "@/lib/content/team-catalog";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";

export const metadata: Metadata = {
  title: "Team",
  description: "Finekarts trade desk leadership and operations team.",
};

export default async function TeamPage() {
  const [members, cms] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedPage("team"),
  ]);
  const heroFields = getSectionFields(cms, "hero");
  const boardIntro = getSectionFields(cms, "board-intro");
  const operationsIntro = getSectionFields(cms, "operations-intro");
  const hero = resolveMarketingHeroImage(heroFields, "team");
  const youtubeVideoId = resolveMarketingHeroYoutube(heroFields);

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "People behind the trade desk")}
        description={cmsField(
          heroFields,
          "description",
          "Our operations, logistics, and compliance leads support qualified buyer and supplier programmes.",
        )}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={youtubeVideoId}
        primaryCta={{
          href: cmsField(heroFields, "primaryCtaHref", "/contact"),
          label: cmsField(heroFields, "primaryCtaLabel", "Contact the trade desk →"),
        }}
        secondaryCta={{
          href: cmsField(heroFields, "secondaryCtaHref", "/about"),
          label: cmsField(heroFields, "secondaryCtaLabel", "About Finekarts"),
        }}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-bold text-[#001a3d] sm:text-3xl">
              {cmsField(boardIntro, "title", "Board of directors")}
            </h2>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-[#555555]">
              {cmsField(
                boardIntro,
                "body",
                "Governance and strategic oversight — name, position, and department for each board member.",
              )}
            </p>
          </Reveal>
          <div className="mt-10">
            <BoardDirectorsSection members={members} />
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-bold text-[#001a3d] sm:text-3xl">
              {cmsField(operationsIntro, "title", "Trade desk & operations")}
            </h2>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-[#555555]">
              {cmsField(
                operationsIntro,
                "body",
                "Day-to-day coordination across sourcing, documentation, logistics, and buyer support.",
              )}
            </p>
          </Reveal>
          <div className="mt-10">
            <TeamGrid members={members} />
          </div>
          {members.length > 0 ? (
            <AnimatedSection className="mt-10 text-center text-sm font-semibold text-[#666666]" delay={0.12}>
              Want to work with us?{" "}
              <Link href="/privacy" className="font-bold text-[#c88e4a] underline">
                View careers
              </Link>
              {" · "}
              <Link href="/contact" className="font-bold text-[#c88e4a] underline">
                Contact the trade desk
              </Link>
            </AnimatedSection>
          ) : null}
        </div>
      </section>
    </>
  );
}
