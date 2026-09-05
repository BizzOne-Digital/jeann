import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";
import { TeamGrid } from "@/components/marketing/TeamSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getPublishedTeamMembers } from "@/lib/content/team-catalog";

export const metadata: Metadata = {
  title: "Team",
  description: "Finekarts trade desk leadership and operations team.",
};

export default async function TeamPage() {
  const members = await getPublishedTeamMembers();

  const hero = getPageHeroImage("team");

  return (
    <>
      <PageHero
        title="People behind the trade desk"
        description="Our operations, logistics, and compliance leads support qualified buyer and supplier programmes."
        imageSrc={hero.src}
        imageAlt={hero.alt}
        primaryCta={{ href: "/contact", label: "Contact the trade desk →" }}
        secondaryCta={{ href: "/about", label: "About Finekarts" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <TeamGrid members={members} />
          {members.length > 0 ? (
            <AnimatedSection className="mt-10 text-center text-sm text-[#666666]" delay={0.12}>
              Want to work with us?{" "}
              <Link href="/contact" className="font-semibold text-[#c88e4a] underline">
                Contact the trade desk
              </Link>
            </AnimatedSection>
          ) : null}
        </div>
      </section>
    </>
  );
}
