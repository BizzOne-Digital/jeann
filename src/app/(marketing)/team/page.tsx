import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { TeamRosterSection } from "@/components/marketing/TeamSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Reveal } from "@/components/motion/Reveal";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  getPublishedTeamFieldDefinitions,
  getPublishedTeamMembers,
} from "@/lib/content/team-catalog";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import {
  cmsMerged,
  TEAM_FOOTER_DEFAULTS,
  TEAM_HERO_DEFAULTS,
  TEAM_INTRO_DEFAULTS,
} from "@/lib/marketing/simple-pages-cms";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("team", {
    title: "Team",
    description: "Finekarts leadership and trade desk — photo, name, title, and department.",
  });
}

export default async function TeamPage() {
  const [members, fieldDefinitions, cms] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedTeamFieldDefinitions(),
    getPublishedPage("team"),
  ]);
  const sections = collectCmsSections(cms, ["hero", "board-intro", "footer-links"]);
  const heroFields = sections.hero;
  const heroText = cmsMerged(sections, "hero", TEAM_HERO_DEFAULTS);
  const intro = cmsMerged(sections, "board-intro", TEAM_INTRO_DEFAULTS);
  const footer = cmsMerged(sections, "footer-links", TEAM_FOOTER_DEFAULTS);
  const hero = resolveMarketingHeroImage(heroFields, "team");
  const youtubeVideoId = resolveMarketingHeroYoutube(heroFields);

  return (
    <>
      <PageHero
        title={heroText.title}
        description={heroText.description}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={youtubeVideoId}
        primaryCta={{
          href: heroText.primaryCtaHref,
          label: heroText.primaryCtaLabel,
        }}
        secondaryCta={{
          href: heroText.secondaryCtaHref,
          label: heroText.secondaryCtaLabel,
        }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-[#c88e4a] uppercase">{intro.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold text-[#001a3d] sm:text-3xl">
              {intro.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#555555]">
              {intro.body}
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
              <Link href={footer.careersHref} className="font-bold text-[#c88e4a] underline">
                {footer.careersLabel}
              </Link>
              {" · "}
              <Link href={footer.contactHref} className="font-bold text-[#c88e4a] underline">
                {footer.contactLabel}
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
