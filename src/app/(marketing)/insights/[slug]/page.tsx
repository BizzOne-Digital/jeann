import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { InsightArticleBody } from "@/components/marketing/InsightArticleBody";
import { InsightRelated, InsightsCta } from "@/components/marketing/InsightSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getInsightCover } from "@/lib/content/insight-images";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { getPublishedInsight, getPublishedInsights } from "@/lib/content/insights-catalog";
import { SEED_INSIGHTS } from "@/lib/content/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SEED_INSIGHTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedInsight(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedInsight(slug);
  if (!post) notFound();

  const cover = getInsightCover(post.slug);
  const paragraphs = post.body.includes("\n\n") ? post.body.split("\n\n") : [post.body];
  const allPosts = await getPublishedInsights();

  return (
    <>
      <PageHero
        title={post.title}
        description={post.excerpt}
        imageSrc={cover}
        imageAlt=""
        primaryCta={{ href: buyerQuoteHref(), label: "Request a Quote →" }}
        secondaryCta={{ href: "/insights", label: "All insights" }}
      />

      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <AnimatedSection y={16}>
            <nav className="text-sm text-[#666666]">
              <Link href="/insights" className="transition hover:text-[#c88e4a]">
                Insights
              </Link>
              <span className="mx-2 text-[#ccc]">/</span>
              <span className="text-[#001a3d]">{post.category}</span>
            </nav>
            </AnimatedSection>

            <AnimatedSection delay={0.06} y={16}>
            <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
              {post.category} · {formatDate(post.publishedAt)}
            </p>
            </AnimatedSection>

            <AnimatedSection delay={0.08} y={20}>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-[#e4e0d8] lg:hidden">
              <Image src={cover} alt="" fill className="object-cover" sizes="100vw" />
            </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1} y={16}>
            <aside className="mt-8 border-l-2 border-[#d4a84b] bg-white/70 px-5 py-4 text-sm leading-relaxed text-[#555555]">
              Educational content only — not legal, regulatory, tax, or shipping advice. Confirm
              Incoterms, contracts, and document requirements with qualified advisers for your
              transaction.
            </aside>
            </AnimatedSection>

            <InsightArticleBody paragraphs={paragraphs} />

            <AnimatedSection className="mt-12 flex flex-wrap gap-3 border-t border-[#d5d0c8] pt-10" delay={0.08}>
            <div className="flex flex-wrap gap-3">
              <Link
                href={buyerQuoteHref()}
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
              >
                Request a Quote <span aria-hidden>→</span>
              </Link>
              <Link
                href="/insights"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#001a3d]/25 px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:border-[#001a3d]"
              >
                All insights
              </Link>
            </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="hidden lg:block" delay={0.12} y={24}>
            <div className="sticky top-28 space-y-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e0d8]">
                <Image
                  src={cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
              </div>
              <div className="border-t border-[#d5d0c8] pt-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
                  Topics
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[#555555]">
                  <li>
                    <Link href="/resources" className="transition hover:text-[#c88e4a]">
                      Trade resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/packaging" className="transition hover:text-[#c88e4a]">
                      Packaging options
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="transition hover:text-[#c88e4a]">
                      Shipping documents
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="transition hover:text-[#c88e4a]">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </article>

      <InsightRelated posts={allPosts} currentSlug={post.slug} />
      <InsightsCta />
    </>
  );
}
