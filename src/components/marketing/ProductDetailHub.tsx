"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { YouTubeEmbed } from "@/components/marketing/YouTubeEmbed";
import {
  PRODUCT_PANEL_TITLES,
  PRODUCT_PILLARS,
  PRODUCT_RELATED_LINKS,
  type ProductDetailTabId,
  type ProductHubProps,
} from "@/lib/content/product-detail-shared";
import { cn } from "@/lib/utils/cn";

function PillarIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";
  if (type === "chart") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5M4 19h16M8 16V11M12 16V8M16 16v-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "box") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 3 8.5v7L12 21l9-5.5v-7L12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 12 21 8.5M12 12v9M12 12 3 8.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "image") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" />
        <path
          d="m5 17 4.5-4.5 3 3L15 13l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v6M12 8v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#001a3d]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[#555555]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpecList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5">
      <h3 className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#555555]">
        {items.map((item, index) => (
          <li key={`${title}-${item}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OverviewPanel({
  content,
  pillars,
  heroImage,
  heroImageAlt,
  youtubeUrl,
  videoTitle,
}: Pick<
  ProductHubProps,
  "content" | "pillars" | "heroImage" | "heroImageAlt" | "youtubeUrl" | "videoTitle"
>) {
  const highlights = content.highlights;

  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">{content.description}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((box) => (
          <article
            key={box.title}
            className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5 shadow-sm"
          >
            <h3 className="text-xs font-semibold tracking-[0.14em] text-[#c88e4a] uppercase">
              {box.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#444444]">{box.body}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <DetailList title="Typical applications" items={content.applications} />
        <DetailList title="Product characteristics" items={content.characteristics} />
      </div>

      {highlights.length > 0 ? (
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
            Why buyers enquire
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-[#d5d0c8] bg-white p-4 text-sm leading-relaxed text-[#444444]"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
            In the field
          </p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]">
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </div>
        {youtubeUrl ? (
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
              Video overview
            </p>
            <YouTubeEmbed youtubeInput={youtubeUrl} title={videoTitle ?? "Product overview video"} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SpecificationsPanel({ trade }: Pick<ProductHubProps, "trade">) {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        Illustrative only — contract specifications, certificates of analysis, and sales agreements
        supersede website content. Final grades and origins are confirmed per RFQ.
      </p>

      {trade.status === "pending_verification" ? (
        <aside className="rounded-lg border border-[#c88e4a]/35 bg-[#fff9ef] p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
            Pending verification
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#444444]">
            Example content on this page requires Finekarts admin verification before treating as
            confirmed trade specifications. Use for orientation only until your enquiry is reviewed.
          </p>
        </aside>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="table-scroll">
          <table className="w-full min-w-[280px] text-left text-sm">
            <tbody>
              <tr className="border-t border-[#d5d0c8]">
                <th className="py-4 pr-4 align-top font-medium text-[#888]">Grade summary</th>
                <td className="py-4 break-words text-[#333]">{trade.gradeSummary}</td>
              </tr>
              <tr className="border-t border-[#d5d0c8]">
                <th className="py-4 pr-4 align-top font-medium text-[#888]">Origin options</th>
                <td className="py-4 break-words text-[#333]">
                  {trade.originOptions.length > 0 ? trade.originOptions.join("; ") : "Per enquiry"}
                </td>
              </tr>
              <tr className="border-t border-[#d5d0c8]">
                <th className="py-4 pr-4 align-top font-medium text-[#888]">Incoterms discussed</th>
                <td className="py-4 break-words text-[#333]">
                  {trade.incotermOptions.length > 0
                    ? trade.incotermOptions.join(", ")
                    : "Negotiated per contract"}
                </td>
              </tr>
              <tr className="border-t border-[#d5d0c8]">
                <th className="py-4 pr-4 align-top font-medium text-[#888]">Availability</th>
                <td className="py-4 break-words text-[#333]">{trade.availabilityText}</td>
              </tr>
              <tr className="border-t border-[#d5d0c8]">
                <th className="py-4 pr-4 align-top font-medium text-[#888]">Minimum order</th>
                <td className="py-4 break-words text-[#333]">{trade.minOrderText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SpecList title="Packaging (examples)" items={trade.packaging} />
          <SpecList title="Inspection options" items={trade.inspectionOptions} />
          <SpecList title="Document categories" items={trade.documentCategories} />
        </div>
      </div>
    </div>
  );
}

function PackagingPanel({
  content,
  trade,
}: Pick<ProductHubProps, "content" | "trade">) {
  const packagingItems =
    content.packaging.length > 0 ? content.packaging : trade.packaging;

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        Packaging formats, loading windows, and Incoterms are agreed in writing before shipment.
        Bulk tank, flexitank, and container programmes are confirmed per transaction.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
            Availability
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#444444]">{trade.availabilityText}</p>
        </article>
        <article className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
            Minimum order
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#444444]">{trade.minOrderText}</p>
        </article>
      </div>

      <article className="rounded-lg border border-[#c88e4a]/35 bg-[#fff9ef] p-6">
        <h3 className="text-sm font-semibold text-[#001a3d]">Packaging options</h3>
        <p className="mt-3 text-sm text-[#555555]">
          {packagingItems.length > 0 ? packagingItems.join(" • ") : "Confirmed per RFQ"}
        </p>
        {content.note ? (
          <p className="mt-4 text-xs leading-relaxed text-[#777777]">{content.note}</p>
        ) : null}
      </article>

      {trade.incotermOptions.length > 0 ? (
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
            Incoterms typically discussed
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {trade.incotermOptions.map((term) => (
              <span
                key={term}
                className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d]"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
          Related trade services
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRODUCT_RELATED_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d] transition hover:border-[#c88e4a] hover:text-[#c88e4a]"
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryPanel({
  content,
  heroImage,
  heroImageAlt,
}: Pick<ProductHubProps, "content" | "heroImage" | "heroImageAlt">) {
  const gallery = content.images ?? [];
  const hasGallery = gallery.length > 0;

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        Reference photography for orientation. Final product appearance, colour, and packaging may
        vary by origin, season, and contract specification.
      </p>

      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]">
        <Image
          src={hasGallery ? gallery[0].src : heroImage}
          alt={hasGallery ? gallery[0].alt : heroImageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 900px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/70 via-transparent to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
            Illustrative only
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            Images support enquiry discussions — not a guarantee of exact shipment appearance.
          </p>
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.slice(1).map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TabPanel({
  activeTab,
  props,
}: {
  activeTab: ProductDetailTabId;
  props: ProductHubProps;
}) {
  if (activeTab === "overview") {
    return (
      <OverviewPanel
        content={props.content}
        pillars={props.pillars}
        heroImage={props.heroImage}
        heroImageAlt={props.heroImageAlt}
        youtubeUrl={props.youtubeUrl}
        videoTitle={props.videoTitle}
      />
    );
  }
  if (activeTab === "specifications") {
    return <SpecificationsPanel trade={props.trade} />;
  }
  if (activeTab === "packaging") {
    return <PackagingPanel content={props.content} trade={props.trade} />;
  }
  return (
    <GalleryPanel
      content={props.content}
      heroImage={props.heroImage}
      heroImageAlt={props.heroImageAlt}
    />
  );
}

export function ProductDetailHub(props: ProductHubProps) {
  const { productName, categoryName, categorySlug, content } = props;
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>("overview");
  const reduce = useReducedMotion();

  const selectTab = useCallback((id: ProductDetailTabId) => {
    setActiveTab(id);
    const el = document.getElementById("product-detail-hub");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const panel = PRODUCT_PANEL_TITLES[activeTab];

  return (
    <>
      <section className="border-b border-[#d5d0c8] bg-white py-12 lg:py-16">
        <div className="container-page">
          <nav className="text-sm text-[#666666]" aria-label="Breadcrumb">
            <Link href="/products" className="transition hover:text-[#c88e4a]">
              Products
            </Link>
            <span className="mx-2 text-[#ccc]">/</span>
            <Link href={`/products/${categorySlug}`} className="transition hover:text-[#c88e4a]">
              {categoryName}
            </Link>
            <span className="mx-2 text-[#ccc]">/</span>
            <span className="text-[#001a3d]">{productName}</span>
          </nav>

          <p className="mt-8 text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            {content.grade}
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {content.subtitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555]">
            Explore applications, trade specifications, packaging options, and reference photography
            for this grade — structured like our trade resources library.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_PILLARS.map((pillar) => {
              const active = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => selectTab(pillar.id)}
                  className={cn(
                    "focus-ring group flex h-full flex-col rounded-lg border p-5 text-left transition",
                    active
                      ? "border-[#001a3d] bg-[#001a3d] text-white shadow-md"
                      : "border-[#d5d0c8] bg-[#f9f8f5] hover:border-[#c88e4a] hover:shadow-sm",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full transition",
                      active
                        ? "bg-[#d4a84b] text-[#001a3d]"
                        : "bg-white text-[#1b3a5c] group-hover:text-[#c88e4a]",
                    )}
                  >
                    <PillarIcon type={pillar.icon} />
                  </span>
                  <span className="mt-4 text-base font-semibold">{pillar.title}</span>
                  <span
                    className={cn(
                      "mt-2 flex-1 text-sm leading-relaxed",
                      active ? "text-white/80" : "text-[#666666]",
                    )}
                  >
                    {pillar.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="product-detail-hub" className="scroll-mt-24 bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="sticky top-[4.5rem] z-10 -mx-1 mb-8 overflow-x-auto border-b border-[#d5d0c8] bg-[#f3f1ec]/95 px-1 pb-px backdrop-blur-sm">
            <div className="flex min-w-max gap-1">
              {PRODUCT_PILLARS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "focus-ring border-b-2 px-4 py-3 text-sm font-semibold transition",
                    activeTab === tab.id
                      ? "border-[#c88e4a] text-[#001a3d]"
                      : "border-transparent text-[#888] hover:text-[#001a3d]",
                  )}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {panel.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{panel.title}</h2>

            <div className="mt-8">
              {reduce ? (
                <TabPanel activeTab={activeTab} props={props} />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TabPanel activeTab={activeTab} props={props} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductDetailEnquiryCta({
  productName,
  quoteHref,
}: {
  productName: string;
  quoteHref: string;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="rounded-lg border border-[#d5d0c8] bg-[#001a3d] p-8 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              Next step
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Request a quotation for {productName}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Include destination, quantity, packaging preference, and target Incoterm. Submission
              does not guarantee supply or pricing.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Link
              href={quoteHref}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:bg-[#c4983f]"
            >
              Request Quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60"
            >
              Contact us
            </Link>
            <Link
              href="/register/buyer"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60"
            >
              Buyer sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
