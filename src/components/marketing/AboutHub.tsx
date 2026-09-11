"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { cmsField } from "@/lib/content/cms-field";
import {
  ABOUT_CAPABILITY_CARDS,
  ABOUT_CORRIDORS,
  ABOUT_HUB_INTRO,
  ABOUT_PANEL_TITLES,
  ABOUT_PILLARS,
  ABOUT_PROCESS_STEPS,
  ABOUT_QUICK_LINKS,
  ABOUT_STATS,
  ABOUT_STORY,
  type AboutTabId,
} from "@/lib/content/about-content";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { cn } from "@/lib/utils/cn";

function PillarIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";
  if (type === "team") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 20v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1M13 20v-1a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "layers") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 3 8l9 5 9-5-9-5Zm0 7L3 15l9 5 9-5-9-5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "route") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h4l2-7 4 14 2-7h2"
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
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3a15 15 0 0 1 4 18M12 3a15 15 0 0 0-4 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AboutHubCms = {
  whoWeAre?: Record<string, string>;
  capabilities?: Record<string, string>;
  process?: Record<string, string>;
  global?: Record<string, string>;
};

function StoryPanel({
  teamStrategy,
  teamCollaboration,
  cms,
}: {
  teamStrategy: string;
  teamCollaboration: string;
  cms?: Record<string, string>;
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-[#e4e0d8] shadow-md">
          <Image
            src={teamStrategy}
            alt="Finekarts trade team reviewing commodity programme strategy"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/50 via-transparent to-transparent" />
        </div>
        <div>
          <p className="text-sm leading-relaxed text-[#555555]">
            {cmsField(
              cms,
              "body",
              "Finekarts Incorporated connects trusted suppliers with qualified buyers worldwide. We specialize in the sourcing, quality coordination, and logistics of bulk agricultural commodities with integrity and professionalism.",
            )}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#555555]">
            {cmsField(
              cms,
              "body2",
              "From origin to destination, our team ensures reliable execution, transparent communication, and consistent value at every step — without inventing volumes, certifications, or guarantees.",
            )}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
          >
            Discover products <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {ABOUT_STORY.boxes.map((box) => (
          <article
            key={box.title}
            className="rounded-xl border border-[#d5d0c8] bg-gradient-to-br from-white to-[#f9f8f5] p-5 shadow-sm"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#001a3d] text-xs font-bold text-[#d4a84b]">
              {box.title.charAt(0)}
            </span>
            <h3 className="mt-3 text-base font-semibold text-[#001a3d]">{box.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#555555]">{box.body}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e4e0d8]">
          <Image
            src={teamCollaboration}
            alt="Finekarts team collaborating on buyer and supplier programmes"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-[#d5d0c8] bg-[#001a3d] p-6 text-white sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
            Buyer & supplier programmes
          </p>
          <p className="mt-3 text-lg font-semibold leading-snug">
            Relationships begin with enquiry and diligence — no deal exists until contractual documents are agreed.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-[#d4a84b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
          >
            Contact the desk <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CapabilitiesPanel({ cms }: { cms?: Record<string, string> }) {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        {cmsField(
          cms,
          "body",
          "We source bulk agricultural commodities for industrial buyers, refiners, and distributors. Origins, grades, and sustainability claims are stated only when verified. Packaging and logistics modes — container, flexitank, ISO tank, or vessel — apply only where product and corridor allow.",
        )}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {ABOUT_CAPABILITY_CARDS.map((card) => (
          <article
            key={card.title}
            className="group overflow-hidden rounded-xl border border-[#d5d0c8] bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#e4e0d8]">
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/70 via-[#071525]/20 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">
                {card.title}
              </h3>
            </div>
            <p className="p-5 text-sm leading-relaxed text-[#555555]">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProcessPanel({ cms }: { cms?: Record<string, string> }) {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-[#555555]">
        {cmsField(
          cms,
          "body",
          "Our role is to align specifications, inspection, logistics, and documentation — not to guarantee outcomes.",
        )}
      </p>

      <div className="overflow-hidden rounded-xl bg-[#071525] p-6 text-white sm:p-8 lg:p-10">
        <div className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          <div className="pointer-events-none absolute top-9 right-[10%] left-[10%] hidden h-px bg-white/15 md:block" />
          {ABOUT_PROCESS_STEPS.map((step) => (
            <div key={step.n} className="relative text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#d4a84b] bg-[#0a1628] text-sm font-bold text-[#d4a84b] md:mx-0">
                {step.n}
              </div>
              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={buyerQuoteHref()}
          className="inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
        >
          Submit an RFQ <span aria-hidden>→</span>
        </Link>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 rounded-md border border-[#d5d0c8] px-5 py-2.5 text-sm font-semibold text-[#001a3d] transition hover:bg-[#f3f1ec]"
        >
          Trade resources
        </Link>
      </div>
    </div>
  );
}

function GlobalPanel({
  home3,
  cms,
}: {
  home3: string;
  cms?: Record<string, string>;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border border-[#d5d0c8] bg-white p-4 shadow-sm lg:max-w-none">
        <Image
          src={home3}
          alt="Global commodity sourcing and logistics network"
          fill
          className="object-contain object-center p-2"
          sizes="(max-width: 1024px) 90vw, 420px"
        />
      </div>

      <div>
        <p className="text-sm leading-relaxed text-[#555555]">
          {cmsField(
            cms,
            "body",
            "Our network of suppliers and logistics partners helps us deliver quality commodities reliably — with transparent communication and documentation discipline at every corridor.",
          )}
        </p>

        <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
          Key corridors
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ABOUT_CORRIDORS.map((place) => (
            <li
              key={place}
              className="rounded-full border border-[#d5d0c8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#001a3d] shadow-sm"
            >
              {place}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
          Explore further
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {ABOUT_QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-3 text-sm font-semibold text-[#001a3d] transition hover:border-[#c88e4a] hover:bg-white"
              >
                {link.label}
                <span className="text-[#c88e4a]" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AboutHub({
  teamStrategy,
  teamCollaboration,
  home3,
  cms,
}: {
  teamStrategy: string;
  teamCollaboration: string;
  home3: string;
  cms: AboutHubCms;
}) {
  const [activeTab, setActiveTab] = useState<AboutTabId>("story");
  const reduce = useReducedMotion();
  const story = ABOUT_STORY;
  const panel = ABOUT_PANEL_TITLES[activeTab];

  const selectTab = useCallback((id: AboutTabId) => {
    setActiveTab(id);
    document.getElementById("about-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const panelCms =
    activeTab === "story"
      ? cms.whoWeAre
      : activeTab === "capabilities"
        ? cms.capabilities
        : activeTab === "process"
          ? cms.process
          : cms.global;

  const panelTitle =
    activeTab === "story"
      ? cmsField(cms.whoWeAre, "title", panel.title)
      : activeTab === "capabilities"
        ? cmsField(cms.capabilities, "title", panel.title)
        : activeTab === "process"
          ? cmsField(cms.process, "title", panel.title)
          : cmsField(cms.global, "title", panel.title);

  const panelEyebrow =
    activeTab === "story"
      ? cmsField(cms.whoWeAre, "eyebrow", panel.eyebrow)
      : activeTab === "capabilities"
        ? cmsField(cms.capabilities, "eyebrow", panel.eyebrow)
        : activeTab === "process"
          ? cmsField(cms.process, "eyebrow", panel.eyebrow)
          : cmsField(cms.global, "eyebrow", panel.eyebrow);

  return (
    <>
      <section className="bg-[#071525] py-12 text-white lg:py-16">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            {story.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {story.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            {story.lead}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {story.boxes.map((box) => (
              <article
                key={box.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <h3 className="text-xs font-semibold tracking-[0.14em] text-[#d4a84b] uppercase">
                  {box.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{box.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-white/10 bg-gradient-to-r from-[#001a3d] via-[#0c2544] to-[#001a3d] py-10 lg:py-12"
        aria-label="Company highlights"
      >
        <div className="container-page grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-2xl font-bold tracking-tight text-[#d4a84b] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[#d5d0c8] bg-white py-12 lg:py-16">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            About hub
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {ABOUT_HUB_INTRO}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PILLARS.map((pillar) => {
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

      <section id="about-hub" className="scroll-mt-24 bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="sticky top-[4.5rem] z-10 -mx-1 mb-8 overflow-x-auto border-b border-[#d5d0c8] bg-[#f3f1ec]/95 px-1 pb-px backdrop-blur-sm">
            <div className="flex min-w-max gap-1">
              {ABOUT_PILLARS.map((tab) => (
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
              {panelEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold whitespace-pre-line text-[#001a3d] sm:text-3xl">
              {panelTitle}
            </h2>

            <div className="mt-8">
              {reduce ? (
                <>
                  {activeTab === "story" ? (
                    <StoryPanel
                      teamStrategy={teamStrategy}
                      teamCollaboration={teamCollaboration}
                      cms={panelCms}
                    />
                  ) : null}
                  {activeTab === "capabilities" ? <CapabilitiesPanel cms={panelCms} /> : null}
                  {activeTab === "process" ? <ProcessPanel cms={panelCms} /> : null}
                  {activeTab === "global" ? <GlobalPanel home3={home3} cms={panelCms} /> : null}
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
                    {activeTab === "story" ? (
                      <StoryPanel
                        teamStrategy={teamStrategy}
                        teamCollaboration={teamCollaboration}
                        cms={panelCms}
                      />
                    ) : null}
                    {activeTab === "capabilities" ? <CapabilitiesPanel cms={panelCms} /> : null}
                    {activeTab === "process" ? <ProcessPanel cms={panelCms} /> : null}
                    {activeTab === "global" ? <GlobalPanel home3={home3} cms={panelCms} /> : null}
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
