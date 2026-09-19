import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { TeamRosterSection } from "@/components/marketing/TeamSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Reveal } from "@/components/motion/Reveal";
import { cmsField } from "@/lib/content/cms-field";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import {
  getPublishedTeamFieldDefinitions,
  getPublishedTeamMembers,
} from "@/lib/content/team-catalog";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";

export const metadata: Metadata = {
  title: "Team",
  description: "Finekarts leadership and trade desk — photo, name, title, and department.",
};

export default async function TeamPage() {
  const [members, fieldDefinitions, cms] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedTeamFieldDefinitions(),
    getPublishedPage("team"),
  ]);
  const heroFields = getEffectiveSectionFields(cms, "hero");
  const boardIntro = getEffectiveSectionFields(cms, "board-intro");
  const hero = resolveMarketingHeroImage(heroFields, "team");
  const youtubeVideoId = resolveMarketingHeroYoutube(heroFields);

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "Our team")}
        description={cmsField(
          heroFields,
          "description",
          "The people who lead trade programmes, logistics, compliance, and buyer relationships at Finekarts.",
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

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-[#c88e4a] uppercase">Our team</p>
            <h2 className="mt-3 text-2xl font-bold text-[#001a3d] sm:text-3xl">
              {cmsField(boardIntro, "title", "Team members")}
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#555555]">
              {cmsField(
                boardIntro,
                "body",
                "Each profile shows photo, name, title, and department. Additional columns can be added from the admin team settings.",
              )}
            </p>
          </Reveal>

          <div className="mt-10">
            <TeamRosterSection members={members} fieldDefinitions={fieldDefinitions} />
          </div>

          <AnimatedSection
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#d5d0c8] pt-10 text-sm font-semibold text-[#666666]"
            delay={0.1}
          >
            <p>
              {members.length} team member{members.length === 1 ? "" : "s"} listed
            </p>
            <p>
              <Link href="/privacy" className="font-bold text-[#c88e4a] underline">
                Careers
              </Link>
              {" · "}
              <Link href="/contact" className="font-bold text-[#c88e4a] underline">
                Contact
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
