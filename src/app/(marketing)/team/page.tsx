import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { BoardDirectorsSection } from "@/components/marketing/TeamSections";
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
  description: "Finekarts board of directors — leadership name, position, and department.",
};

export default async function TeamPage() {
  const [members, cms] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedPage("team"),
  ]);
  const heroFields = getSectionFields(cms, "hero");
  const boardIntro = getSectionFields(cms, "board-intro");
  const hero = resolveMarketingHeroImage(heroFields, "team");
  const youtubeVideoId = resolveMarketingHeroYoutube(heroFields);
  const boardMembers = members.filter((m) => m.tier === "board");

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "Our leadership team")}
        description={cmsField(
          heroFields,
          "description",
          "Board members who oversee Finekarts trade programmes, governance, and strategic direction.",
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
            <p className="text-xs font-bold tracking-[0.2em] text-[#c88e4a] uppercase">
              Board of directors
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#001a3d] sm:text-3xl">
              {cmsField(boardIntro, "title", "Board members")}
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#555555]">
              {cmsField(
                boardIntro,
                "body",
                "Each board member is listed with their name, position, and the department they lead.",
              )}
            </p>
          </Reveal>

          <div className="mt-10">
            <BoardDirectorsSection members={members} />
          </div>

          <AnimatedSection
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#d5d0c8] pt-10 text-sm font-semibold text-[#666666]"
            delay={0.1}
          >
            <p>
              {boardMembers.length} board member{boardMembers.length === 1 ? "" : "s"} listed
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
