"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import {
  BANKING_CLAUSES,
  BANKING_CLAUSE_INTRO,
  BANKING_CLAUSE_SECTION_TITLE,
  PAYMENT_TERM_STRUCTURES,
  PAYMENT_TERMS_INTRO,
  PREFERRED_PAYMENT_STRUCTURE,
  SWIFT_INSTRUMENT_NOTE,
} from "@/lib/content/payment-terms";
import {
  RESOURCES_DOCUMENT_GROUPS,
  RESOURCES_DOWNLOADS,
  RESOURCES_PILLARS,
  RESOURCES_RELATED_LINKS,
  type ResourcesTabId,
} from "@/lib/content/resources-content";
import { cn } from "@/lib/utils/cn";

function ProtectionBar({ value, label }: { value: number; label: string }) {
  const pct = (value / 5) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-[#888]">{label}</span>
        <span className="tabular-nums text-[#001a3d]">{value}/5</span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#ebe7e0]"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label={`${label}: ${value} out of 5`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1b3a5c] to-[#c88e4a]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ClauseAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="divide-y divide-[#e4e0d8] rounded-lg border border-[#d5d0c8] bg-white">
      {BANKING_CLAUSES.map((clause, i) => {
        const open = openIndex === i;
        return (
          <div key={clause.title}>
            <button
              type="button"
              className="focus-ring flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="text-sm font-semibold text-[#001a3d] sm:text-base">{clause.title}</span>
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
              <div className={cn("px-5 pb-5 sm:px-6", open ? "" : "hidden")}>
                <p className="text-sm leading-relaxed text-[#555555]">{clause.body}</p>
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
                    <p className="px-5 pb-5 text-sm leading-relaxed text-[#555555] sm:px-6">
                      {clause.body}
                    </p>
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

function PillarIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";
  if (type === "bank") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 9.5 12 4l9 5.5M5 10v8M9 10v8M15 10v8M19 10v8M4 20h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
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
  if (type === "folder") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BankingPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8]">
          <Image
            src="/images/home-2.png"
            alt="International trade and commodity documentation"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/80 via-[#001a3d]/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
              Illustrative only
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              Adapt all SPA banking wording to jurisdiction, bank requirements, and your commercial
              schedule.
            </p>
          </div>
        </div>
        <aside className="rounded-lg border border-[#c88e4a]/35 bg-[#fff9ef] p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
            Preferred approach
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#444444]">{PREFERRED_PAYMENT_STRUCTURE}</p>
        </aside>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
          {BANKING_CLAUSE_SECTION_TITLE}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          {BANKING_CLAUSE_INTRO} Not legal or banking advice.
        </p>
        <div className="mt-6">
          <ClauseAccordion />
        </div>
      </div>
    </div>
  );
}

function PaymentsPanel() {
  const [showAll, setShowAll] = useState(false);
  const recommended = PAYMENT_TERM_STRUCTURES.filter((row) => row.recommended);
  const alternatives = PAYMENT_TERM_STRUCTURES.filter((row) => !row.recommended);

  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">
        {PAYMENT_TERMS_INTRO} Not legal or banking advice.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {recommended.map((row) => (
          <article
            key={row.id}
            className="relative overflow-hidden rounded-lg border border-[#c88e4a]/40 bg-white p-6 shadow-sm"
          >
            <span className="absolute top-0 right-0 rounded-bl-lg bg-[#c88e4a] px-3 py-1 text-[10px] font-bold tracking-wide text-[#001a3d] uppercase">
              Top ranked
            </span>
            <h3 className="pr-20 text-lg font-semibold text-[#001a3d]">{row.structure}</h3>
            <p className="mt-1 text-sm text-[#666666]">{row.primaryFunction}</p>
            <p className="mt-1 text-xs font-medium text-[#888]">{row.iccCode}</p>
            <div className="mt-5 space-y-3 border-t border-[#ebe7e0] pt-4">
              <ProtectionBar value={row.buyerProtection} label="Buyer protection" />
              <ProtectionBar value={row.sellerProtection} label="Seller protection" />
            </div>
          </article>
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#1b3a5c] px-4 py-2.5 text-sm font-semibold text-[#1b3a5c] transition hover:bg-[#1b3a5c] hover:text-white"
        >
          {showAll ? "Hide alternative structures" : "View alternative structures"}
          <span aria-hidden>{showAll ? "↑" : "↓"}</span>
        </button>

        {showAll ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {alternatives.map((row) => (
              <article
                key={row.id}
                className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5"
              >
                <h4 className="font-semibold text-[#001a3d]">{row.structure}</h4>
                <p className="mt-1 text-xs text-[#888]">{row.iccCode}</p>
                <p className="mt-2 text-sm text-[#666666]">{row.primaryFunction}</p>
                <div className="mt-4 space-y-2">
                  <ProtectionBar value={row.buyerProtection} label="Buyer" />
                  <ProtectionBar value={row.sellerProtection} label="Seller" />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <article className="rounded-lg border border-[#d5d0c8] bg-white p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#001a3d] uppercase">
          SWIFT vs banking instruments
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{SWIFT_INSTRUMENT_NOTE}</p>
      </article>
    </div>
  );
}

function DocumentsPanel({ introBody }: { introBody: string }) {
  const [activeGroup, setActiveGroup] = useState(RESOURCES_DOCUMENT_GROUPS[0].id);
  const group =
    RESOURCES_DOCUMENT_GROUPS.find((g) => g.id === activeGroup) ?? RESOURCES_DOCUMENT_GROUPS[0];

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-[#555555]">{introBody}</p>

      <div className="flex flex-wrap gap-2">
        {RESOURCES_RELATED_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d] transition hover:border-[#c88e4a] hover:text-[#c88e4a]"
          >
            {item.label} →
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <nav className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {RESOURCES_DOCUMENT_GROUPS.map((g) => {
            const active = g.id === activeGroup;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroup(g.id)}
                className={cn(
                  "focus-ring shrink-0 rounded-lg border px-4 py-3 text-left text-sm font-medium transition lg:w-full",
                  active
                    ? "border-[#001a3d] bg-[#001a3d] text-white"
                    : "border-[#d5d0c8] bg-white text-[#001a3d] hover:border-[#c88e4a]",
                )}
              >
                {g.title}
              </button>
            );
          })}
        </nav>

        <div className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-[#001a3d]">{group.title}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="rounded-md border border-[#ebe7e0] bg-[#f9f8f5] p-4"
              >
                <p className="text-sm font-semibold text-[#001a3d]">{item.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#666666]">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DownloadsPanel() {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-[#555555]">
        Starter checklists and PDFs for internal review. Contract teams should confirm final document
        sets with counsel and the issuing bank.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {RESOURCES_DOWNLOADS.map((file) => (
          <article
            key={file.href}
            className="flex flex-col justify-between rounded-lg border border-[#d5d0c8] bg-white p-6 shadow-sm"
          >
            <div>
              <span className="inline-flex rounded-full bg-[#f3f1ec] px-3 py-1 text-xs font-semibold text-[#1b3a5c]">
                {file.type}
              </span>
              <p className="mt-4 text-lg font-semibold text-[#001a3d]">{file.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#666666]">{file.note}</p>
            </div>
            <a
              href={file.href}
              download
              className="focus-ring mt-6 inline-flex w-fit items-center rounded-md bg-[#1b3a5c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13293d]"
            >
              Download file
            </a>
          </article>
        ))}
      </div>

      <LegalDocumentsPanel category="trade" title="Legal & trade documents (PDF)" />
    </div>
  );
}

const PANEL_TITLES: Record<ResourcesTabId, { eyebrow: string; title: string }> = {
  banking: {
    eyebrow: "SPA reference",
    title: "Recommended banking clause for commodity SPA",
  },
  payments: {
    eyebrow: "Payment structures",
    title: "Best structure for 12-month commodity contracts",
  },
  documents: {
    eyebrow: "Document overview",
    title: "What buyers typically review",
  },
  downloads: {
    eyebrow: "Downloads",
    title: "Printable references",
  },
};

export function ResourcesHub({ introBody }: { introBody: string }) {
  const [activeTab, setActiveTab] = useState<ResourcesTabId>("banking");
  const reduce = useReducedMotion();

  const selectTab = useCallback((id: ResourcesTabId) => {
    setActiveTab(id);
    const el = document.getElementById("resources-hub");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const panel = PANEL_TITLES[activeTab];

  return (
    <>
      <section className="border-b border-[#d5d0c8] bg-white py-12 lg:py-16">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            Resource library
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            Pick a topic to explore — banking, payments, documents, or downloads
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCES_PILLARS.map((pillar) => {
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
                      ? {
                          borderColor: accent.main,
                          backgroundColor: accent.main,
                        }
                      : {
                          borderColor: accent.ring,
                          backgroundColor: accent.light,
                        }
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

      <section id="resources-hub" className="scroll-mt-24 bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="sticky top-[4.5rem] z-10 -mx-1 mb-8 overflow-x-auto border-b border-[#d5d0c8] bg-[#f3f1ec]/95 px-1 pb-px backdrop-blur-sm">
            <div className="flex min-w-max gap-1">
              {RESOURCES_PILLARS.map((tab) => (
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
                  style={
                    activeTab === tab.id
                      ? { borderColor: tab.accent.main }
                      : undefined
                  }
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
                <>
                  {activeTab === "banking" ? <BankingPanel /> : null}
                  {activeTab === "payments" ? <PaymentsPanel /> : null}
                  {activeTab === "documents" ? <DocumentsPanel introBody={introBody} /> : null}
                  {activeTab === "downloads" ? <DownloadsPanel /> : null}
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
                    {activeTab === "banking" ? <BankingPanel /> : null}
                    {activeTab === "payments" ? <PaymentsPanel /> : null}
                    {activeTab === "documents" ? <DocumentsPanel introBody={introBody} /> : null}
                    {activeTab === "downloads" ? <DownloadsPanel /> : null}
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
