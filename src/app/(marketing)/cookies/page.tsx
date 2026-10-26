import type { Metadata } from "next";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  cmsMerged,
  COOKIES_ANALYTICS_DEFAULTS,
  COOKIES_ESSENTIAL_DEFAULTS,
  COOKIES_HERO_DEFAULTS,
  COOKIES_INTRO_DEFAULTS,
  COOKIES_PREFERENCES_DEFAULTS,
  LEGAL_NOTICE_DEFAULTS,
} from "@/lib/marketing/simple-pages-cms";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "How Finekarts uses cookies and similar technologies on the website and buyer portal.",
};

export default async function CookiesPage() {
  const cms = await getPublishedPage("cookies");
  const sections = collectCmsSections(cms, [
    "notice",
    "intro",
    "essential",
    "analytics",
    "preferences",
  ]);
  const notice = cmsMerged(sections, "notice", LEGAL_NOTICE_DEFAULTS);
  const intro = cmsMerged(sections, "intro", COOKIES_INTRO_DEFAULTS);
  const essential = cmsMerged(sections, "essential", COOKIES_ESSENTIAL_DEFAULTS);
  const analytics = cmsMerged(sections, "analytics", COOKIES_ANALYTICS_DEFAULTS);
  const preferences = cmsMerged(sections, "preferences", COOKIES_PREFERENCES_DEFAULTS);

  return (
    <>
      <CmsPageHero
        pageSlug="cookies"
        defaults={{
          title: COOKIES_HERO_DEFAULTS.title,
          description: COOKIES_HERO_DEFAULTS.description,
        }}
      />
      <article className="bg-[#f3f1ec] marketing-section">
        <div className="container-narrow">
          <LegalPageBody banner={<LegalReviewBanner title={notice.title} body={notice.body} />}>
            <p>{intro.body}</p>
            <div>
              <h2 className="display text-xl text-navy">{essential.title}</h2>
              <p>{essential.body}</p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">{analytics.title}</h2>
              <p>{analytics.body}</p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">{preferences.title}</h2>
              <p>{preferences.body}</p>
            </div>
          </LegalPageBody>
        </div>
      </article>
    </>
  );
}
