import type { Metadata } from "next";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  BUYER_TERMS_CONFIDENTIALITY_DEFAULTS,
  BUYER_TERMS_DOCUMENTS_DEFAULTS,
  BUYER_TERMS_HERO_DEFAULTS,
  BUYER_TERMS_INTRO_DEFAULTS,
  BUYER_TERMS_NON_BINDING_DEFAULTS,
  BUYER_TERMS_REPRESENTATIONS_DEFAULTS,
  cmsMerged,
  LEGAL_NOTICE_DEFAULTS,
} from "@/lib/marketing/simple-pages-cms";

export const metadata: Metadata = {
  title: "Buyer terms",
  description: "Terms for purchase requests and buyer portal use on the Finekarts website.",
};

export default async function BuyerTermsPage() {
  const cms = await getPublishedPage("buyer-terms");
  const sections = collectCmsSections(cms, [
    "notice",
    "intro",
    "non-binding",
    "representations",
    "confidentiality",
    "documents",
  ]);
  const notice = cmsMerged(sections, "notice", LEGAL_NOTICE_DEFAULTS);
  const intro = cmsMerged(sections, "intro", BUYER_TERMS_INTRO_DEFAULTS);
  const nonBinding = cmsMerged(sections, "non-binding", BUYER_TERMS_NON_BINDING_DEFAULTS);
  const representations = cmsMerged(sections, "representations", BUYER_TERMS_REPRESENTATIONS_DEFAULTS);
  const confidentiality = cmsMerged(sections, "confidentiality", BUYER_TERMS_CONFIDENTIALITY_DEFAULTS);
  const documents = cmsMerged(sections, "documents", BUYER_TERMS_DOCUMENTS_DEFAULTS);

  return (
    <>
      <CmsPageHero
        pageSlug="buyer-terms"
        defaults={{
          title: BUYER_TERMS_HERO_DEFAULTS.title,
          description: BUYER_TERMS_HERO_DEFAULTS.description,
        }}
      />
      <article className="bg-[#f3f1ec] marketing-section">
        <div className="container-narrow">
          <LegalPageBody
            banner={<LegalReviewBanner title={notice.title} body={notice.body} />}
            footer={<LegalDocumentsPanel category="buyer" title={documents.title} />}
          >
            <p>{intro.body}</p>
            <div>
              <h2 className="display text-xl text-navy">{nonBinding.title}</h2>
              <p>{nonBinding.body}</p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">{representations.title}</h2>
              <p>{representations.body}</p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">{confidentiality.title}</h2>
              <p>{confidentiality.body}</p>
            </div>
          </LegalPageBody>
        </div>
      </article>
    </>
  );
}
