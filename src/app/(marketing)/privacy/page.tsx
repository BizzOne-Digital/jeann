import type { Metadata } from "next";
import { CareerApplicationForm } from "@/components/marketing/CareerApplicationForm";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getCareerFormPrefill } from "@/lib/auth/career-prefill";
import { getSession } from "@/lib/auth/session";
import { cmsField } from "@/lib/content/cms-field";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Finekarts Incorporated. Submit your application and resume for trade, logistics, procurement, and operations roles.",
};

export default async function CareersPage() {
  const session = await getSession();
  const prefill = session ? await getCareerFormPrefill(session) : undefined;
  const cms = await getPublishedPage("privacy");
  const heroFields = getEffectiveSectionFields(cms, "hero");
  const hero = resolveMarketingHeroImage(heroFields, "careers");

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "Careers at Finekarts")}
        brand="Join our team"
        description={cmsField(
          heroFields,
          "description",
          "We are building disciplined global commodity trade programmes. Share your background and upload your resume — signed-in visitors can submit with pre-filled contact details.",
        )}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={resolveMarketingHeroYoutube(heroFields)}
        primaryCta={{
          href: cmsField(heroFields, "primaryCtaHref", "#career-application"),
          label: cmsField(heroFields, "primaryCtaLabel", "Apply now →"),
        }}
        secondaryCta={{
          href: cmsField(heroFields, "secondaryCtaHref", "/contact"),
          label: cmsField(heroFields, "secondaryCtaLabel", "General enquiry"),
        }}
      />

      <section id="career-application" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Open applications
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl">
                Tell us about your experience
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#555555]">
                Finekarts coordinates bulk agricultural commodity programmes for qualified international
                buyers. We review applications for trade operations, procurement, logistics, compliance,
                and business development roles.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="mt-6 space-y-3 text-sm text-[#555555]">
                {[
                  "Trade desk and procurement experience in commodities",
                  "Documentation, banking, or compliance backgrounds",
                  "Logistics and shipment coordination",
                  "Multilingual candidates with international market exposure",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <CareerApplicationForm prefill={prefill} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
