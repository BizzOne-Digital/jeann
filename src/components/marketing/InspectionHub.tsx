"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { MediaFieldPair } from "@/components/marketing/MediaFieldPair";
import { INSPECTIONS_STORY } from "@/lib/content/marketing-pages";
import { HERO_PAGE_OVERLAY_HORIZONTAL } from "@/lib/marketing/hero-layout";
import {
  COMMODITY_INSPECTION_CATEGORIES,
  DOCUMENTARY_TRADE,
  INSPECTION_HUB_INTRO,
  INSPECTION_PILLARS,
  INSPECTION_NETWORK,
  INSPECTION_PROCESS_STEPS,
  INSPECTION_SERVICES,
  ORIGIN_DESTINATION,
  WHY_INDEPENDENT_INSPECTION,
  type InspectionTabId,
} from "@/lib/content/inspections-content";
import { cn } from "@/lib/utils/cn";

const GALLERY_MOSAIC = [
  {
    src: "/images/inspections/warehouse-sack-sampling.png",
    alt: "Inspector sampling agricultural sacks in a warehouse",
    className: "col-span-2 row-span-2",
  },
  {
    src: "/images/inspections/sgs-laboratory-grain-sampling.png",
    alt: "SGS inspector handling a grain sample in a laboratory",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/images/inspections/cargo-inspector-loading.png",
    alt: "Cargo inspector supervising vessel loading",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/images/inspections/green-coffee-warehouse-inspection.png",
    alt: "Green coffee beans in burlap sacks stacked in a warehouse",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/images/inspections/sampling-grain.png",
    alt: "Inspector sampling bulk grain at port",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/images/inspections/sugar-bags-hold.png",
    alt: "Quantity verification of bagged sugar in vessel hold",
    className: "col-span-2 row-span-1",
  },
] as const;

const PANEL_TITLES: Record<InspectionTabId, { eyebrow: string; title: string }> = {
  services: {
    eyebrow: "Transaction lifecycle",
    title: "Six professional inspection services",
  },
  commodities: {
    eyebrow: "By product",
    title: "Inspection across major commodity categories",
  },
  process: {
    eyebrow: "How it works",
    title: "Process, evidence, and field gallery",
  },
  network: {
    eyebrow: "Coverage",
    title: "Origin, destination, partners, and documentary trade",
  },
};

function PillarIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";
  if (type === "clipboard") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6ZM14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6ZM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2ZM14 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (type === "flow") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 6h16M4 12h10M4 18h6m8-6v6m0-6l3 3m-3-3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.4 3.6 5.6 3.6 9s-1.4 6.6-3.6 9c-2.2-2.4-3.6-5.6-3.6-9s1.4-6.6 3.6-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="divide-y divide-[#e4e0d8] marketing-box rounded-lg">
      {INSPECTION_SERVICES.map((service, i) => {
        const open = openIndex === i;
        return (
          <div key={service.n}>
            <button
              type="button"
              className="focus-ring flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#c88e4a] uppercase">
                  Service {service.n}
                </p>
                <span className="mt-1 block text-sm font-semibold text-[#001a3d] sm:text-base">
                  {service.title}
                </span>
              </div>
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition",
                  open
                    ? "border-[#c88e4a] bg-[#c88e4a] text-[#001a3d]"
                    : "border-[#d5d0c8] text-[#888]",
                )}
                aria-hidden
              >
                {open ? "−" : "+"}
              </span>
            </button>
            {reduce ? (
              <div className={cn("space-y-3 px-5 pb-5 sm:px-6", open ? "" : "hidden")}>
                <p className="text-sm leading-relaxed text-[#555555]">{service.summary}</p>
                {"body" in service && service.body ? (
                  <p className="text-sm leading-relaxed text-[#555555]">{service.body}</p>
                ) : null}
                {service.intro && service.items.length > 0 ? (
                  <p className="text-xs font-medium text-[#001a3d]">{service.intro}</p>
                ) : null}
                {service.items.length > 0 ? (
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-2 text-xs text-[#666666]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {service.note ? (
                  <p className="text-xs leading-relaxed text-[#888888]">{service.note}</p>
                ) : null}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 px-5 pb-5 sm:px-6">
                      <p className="text-sm leading-relaxed text-[#555555]">{service.summary}</p>
                      {"body" in service && service.body ? (
                        <p className="text-sm leading-relaxed text-[#555555]">{service.body}</p>
                      ) : null}
                      {service.intro && service.items.length > 0 ? (
                        <p className="text-xs font-medium text-[#001a3d]">{service.intro}</p>
                      ) : null}
                      {service.items.length > 0 ? (
                        <ul className="grid gap-1.5 sm:grid-cols-2">
                          {service.items.map((item) => (
                            <li key={item} className="flex gap-2 text-xs text-[#666666]">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {service.note ? (
                        <p className="text-xs leading-relaxed text-[#888888]">{service.note}</p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ServicesPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-12">
      <div className="grid h-full min-h-[280px] grid-rows-2 gap-4 sm:min-h-[360px] lg:gap-6">
        <div className="relative min-h-0 overflow-hidden rounded-lg border border-[#d5d0c8]">
          <Image
            src="/images/inspections/warehouse-sack-sampling.png"
            alt="Inspector sampling agricultural sacks in a warehouse with a probe"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/85 via-[#001a3d]/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">In the field</p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              Sampling, identity checks, and quantity verification at warehouse and port.
            </p>
          </div>
        </div>
        <div className="relative min-h-0 overflow-hidden rounded-lg border border-[#d5d0c8]">
          <Image
            src="/images/inspections/green-coffee-warehouse-inspection.png"
            alt="Green coffee beans in burlap sacks for origin inspection"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Scope by service</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Finekarts coordinates independent third-party inspection across the transaction lifecycle.
          Expand each service for full scope.
        </p>
        <div className="mt-6">
          <ServicesAccordion />
        </div>
      </div>
    </div>
  );
}

function CommoditiesPanel() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        Specifications are established according to commodity, contract, origin, destination, and
        regulatory requirements. Select a category to view products.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMODITY_INSPECTION_CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group relative flex aspect-[4/3] overflow-hidden rounded-xl bg-[#e4e0d8] shadow-sm transition duration-300 hover:shadow-lg"
          >
            <Image
              src={cat.image}
              alt={cat.imageAlt}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/90 via-[#071525]/35 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-5">
              <h3 className="text-lg font-semibold text-white transition group-hover:text-[#d4a84b]">
                {cat.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/75">{cat.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#d4a84b]">
                View products <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProcessPanel() {
  return (
    <div className="space-y-10">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INSPECTION_PROCESS_STEPS.map((step) => (
          <li
            key={step.step}
            className="rounded-lg border border-[#e4e0d8] bg-[#f9f8f5] p-4"
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#c88e4a] uppercase">
              Step {step.step}
            </p>
            <h3 className="mt-1.5 text-sm font-semibold text-[#001a3d]">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#666666]">{step.text}</p>
          </li>
        ))}
      </ol>

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Why independent?</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_INDEPENDENT_INSPECTION.map((item) => (
            <article key={item.title} className="marketing-box rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#001a3d]">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#555555]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Field gallery</p>
        <div className="mt-4 grid auto-rows-[110px] grid-cols-2 gap-2 sm:auto-rows-[130px] sm:grid-cols-4 lg:auto-rows-[150px]">
          {GALLERY_MOSAIC.map((img) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-lg bg-[#e4e0d8] ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetworkPanel() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="relative min-h-[280px] overflow-hidden rounded-xl">
          <Image
            src="/images/inspections/warehouse-bulk-inspection.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#071525]/78" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <h3 className="text-lg font-semibold text-white">{ORIGIN_DESTINATION.origin.title}</h3>
            <p className="mt-2 text-sm text-white/80">{ORIGIN_DESTINATION.origin.intro}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ORIGIN_DESTINATION.origin.places.map((place) => (
                <li
                  key={place}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90"
                >
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="relative min-h-[280px] overflow-hidden rounded-xl">
          <Image
            src="/images/inspections/cargo-inspector-loading.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#071525]/78" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <h3 className="text-lg font-semibold text-white">{ORIGIN_DESTINATION.destination.title}</h3>
            <p className="mt-2 text-sm text-white/80">{ORIGIN_DESTINATION.destination.intro}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ORIGIN_DESTINATION.destination.places.map((place) => (
                <li
                  key={place}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90"
                >
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm text-[#555555]">{INSPECTION_NETWORK.lead}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {INSPECTION_NETWORK.organizations.map((org) => (
              <span
                key={org}
                className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-semibold text-[#001a3d] shadow-sm"
              >
                {org}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#777777]">{INSPECTION_NETWORK.selectionNote}</p>
        </div>

        <article className="marketing-box rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#001a3d]">{DOCUMENTARY_TRADE.title}</h3>
          <p className="mt-2 text-sm text-[#555555]">{DOCUMENTARY_TRADE.lead}</p>
          <ul className="mt-4 space-y-2">
            {DOCUMENTARY_TRADE.contractItems.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-[#555555]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#777777]">{DOCUMENTARY_TRADE.note}</p>
        </article>
      </div>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
        <strong>Important:</strong> {INSPECTION_NETWORK.disclaimer}
      </p>
    </div>
  );
}

export function InspectionHub() {
  const [activeTab, setActiveTab] = useState<InspectionTabId>("services");
  const reduce = useReducedMotion();
  const story = INSPECTIONS_STORY;

  const selectTab = useCallback((id: InspectionTabId) => {
    setActiveTab(id);
    const el = document.getElementById("inspection-hub");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const panel = PANEL_TITLES[activeTab];

  return (
    <>
      {/* Visual opener — objective over warehouse field photography */}
      <section className="relative overflow-hidden py-12 text-white lg:py-16">
        <Image
          src={story.showcaseImageSrc!}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          aria-hidden
        />
        <div className="absolute inset-0" style={{ background: HERO_PAGE_OVERLAY_HORIZONTAL }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/92 via-[#071525]/72 to-[#071525]/55" />
        <div className="absolute inset-0 bg-[#071525]/25" />

        <div className="container-page relative">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">{story.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">{story.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{story.lead}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {story.boxes.map((box) => (
              <article
                key={box.title}
                className="rounded-xl border border-white/15 bg-[#071525]/45 p-5 shadow-lg backdrop-blur-md"
              >
                <h3 className="text-xs font-semibold tracking-[0.14em] text-[#d4a84b] uppercase">
                  {box.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{box.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d5d0c8] bg-white py-10 lg:py-12">
        <div className="container-page">
          <MediaFieldPair
            imageSrc={story.imageSrc}
            imageAlt={story.imageAlt}
            youtubeUrl={story.youtubeUrl}
            videoTitle="Inspection overview"
          />
        </div>
      </section>

      {/* Pillar picker — mirrors Resources */}
      <section className="border-b border-[#d5d0c8] bg-white py-12 lg:py-16">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            Inspection hub
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {INSPECTION_HUB_INTRO}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSPECTION_PILLARS.map((pillar) => {
              const active = activeTab === pillar.id;
              const accent = pillar.accent;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => selectTab(pillar.id)}
                  className={cn(
                    "focus-ring group flex h-full flex-col rounded-lg border-2 p-5 text-left transition shadow-sm",
                    active ? "text-white shadow-md" : "hover:shadow-md",
                  )}
                  style={
                    active
                      ? { borderColor: accent.main, backgroundColor: accent.main }
                      : { borderColor: accent.ring, backgroundColor: accent.light }
                  }
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full transition",
                      active ? "bg-white/20 text-white" : "bg-white text-[#1b3a5c]",
                    )}
                    style={active ? undefined : { color: accent.main }}
                  >
                    <PillarIcon type={pillar.icon} />
                  </span>
                  <span className="mt-4 text-base font-semibold">{pillar.title}</span>
                  <span
                    className={cn(
                      "mt-2 flex-1 text-sm leading-relaxed",
                      active ? "text-white/85" : "text-[#555555]",
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

      {/* Tabbed panel */}
      <section id="inspection-hub" className="scroll-mt-24 bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="sticky top-[4.5rem] z-10 -mx-1 mb-8 overflow-x-auto border-b border-[#d5d0c8] bg-[#f3f1ec]/95 px-1 pb-px backdrop-blur-sm">
            <div className="flex min-w-max gap-1">
              {INSPECTION_PILLARS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "focus-ring border-b-2 px-4 py-3 text-sm font-semibold transition",
                    activeTab === tab.id
                      ? "text-[#001a3d]"
                      : "border-transparent text-[#888] hover:text-[#001a3d]",
                  )}
                  style={activeTab === tab.id ? { borderColor: tab.accent.main } : undefined}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          <div className="marketing-box rounded-xl p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {panel.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{panel.title}</h2>

            <div className="mt-8">
              {reduce ? (
                <>
                  {activeTab === "services" ? <ServicesPanel /> : null}
                  {activeTab === "commodities" ? <CommoditiesPanel /> : null}
                  {activeTab === "process" ? <ProcessPanel /> : null}
                  {activeTab === "network" ? <NetworkPanel /> : null}
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {activeTab === "services" ? <ServicesPanel /> : null}
                    {activeTab === "commodities" ? <CommoditiesPanel /> : null}
                    {activeTab === "process" ? <ProcessPanel /> : null}
                    {activeTab === "network" ? <NetworkPanel /> : null}
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
