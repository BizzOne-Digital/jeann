"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  GLOBAL_VERIFICATION_NETWORK,
  REAL_TIME_INTELLIGENCE,
  VERIFICATION_FRAMEWORK_STEPS,
  VERIFICATION_HUB_INTRO,
  VERIFICATION_PILLARS,
  VERIFICATION_REPORT_SECTIONS,
  VERIFICATION_SERVICES,
  type VerificationPillarId,
  type VerificationService,
} from "@/lib/content/verification-content";
import { cn } from "@/lib/utils/cn";

const PANEL_TITLES: Record<VerificationPillarId, { eyebrow: string; title: string }> = {
  registration: {
    eyebrow: "Legal standing",
    title: "Corporate registration, government records, and trade licenses",
  },
  counterparties: {
    eyebrow: "Who you trade with",
    title: "Supplier, manufacturer, distributor, and buyer verification",
  },
  risk: {
    eyebrow: "Commercial risk",
    title: "Credit, supply chain, facilities, certifications, and framework",
  },
  compliance: {
    eyebrow: "Regulatory & reporting",
    title: "Sanctions screening, commodity proof, and structured reports",
  },
};

const SERVICE_BY_NUMBER = new Map(VERIFICATION_SERVICES.map((service) => [service.n, service]));

function PillarIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";
  if (type === "document") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "users") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
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
        d="m9 12 2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PanelPhoto({
  src,
  alt,
  caption,
  eyebrow,
}: {
  src: string;
  alt: string;
  caption: string;
  eyebrow?: string;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 420px" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/85 via-[#001a3d]/25 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">{eyebrow}</p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-white/90">{caption}</p>
      </div>
    </div>
  );
}

function ServiceAccordion({ services }: { services: VerificationService[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="divide-y divide-[#e4e0d8] marketing-box rounded-lg">
      {services.map((service, i) => {
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
                <ServiceBody service={service} />
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
                      <ServiceBody service={service} />
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

function ServiceBody({ service }: { service: VerificationService }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-[#555555]">{service.summary}</p>
      {service.body ? <p className="text-sm leading-relaxed text-[#555555]">{service.body}</p> : null}
      {service.sections ? (
        <ul className="space-y-2">
          {service.sections.map((section) => (
            <li key={section.title} className="text-sm text-[#555555]">
              <span className="font-medium text-[#001a3d]">{section.title}:</span> {section.text}
            </li>
          ))}
        </ul>
      ) : null}
      {service.intro && service.items && service.items.length > 0 ? (
        <>
          <p className="text-xs font-medium text-[#001a3d]">{service.intro}</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {service.items.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-[#666666]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {service.note ? <p className="text-xs leading-relaxed text-[#888888]">{service.note}</p> : null}
    </>
  );
}

function servicesForPillar(pillarId: VerificationPillarId) {
  const pillar = VERIFICATION_PILLARS.find((item) => item.id === pillarId)!;
  return pillar.serviceNumbers
    .map((n) => SERVICE_BY_NUMBER.get(n))
    .filter((service): service is VerificationService => Boolean(service));
}

function RegistrationPanel() {
  const pillar = VERIFICATION_PILLARS[0];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <PanelPhoto
          src={pillar.image}
          alt={pillar.imageAlt}
          eyebrow="Global coverage"
          caption={GLOBAL_VERIFICATION_NETWORK.lead}
        />
        <div className="flex flex-wrap gap-2">
          {GLOBAL_VERIFICATION_NETWORK.regions.map((region) => (
            <span
              key={region}
              className="rounded-full border border-[#d5d0c8] bg-white px-3 py-1.5 text-xs font-medium text-[#001a3d]"
            >
              {region}
            </span>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-[#777777]">{GLOBAL_VERIFICATION_NETWORK.note}</p>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Scope by service</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Expand each service for registration, government records, and import/export licensing scope.
        </p>
        <div className="mt-6">
          <ServiceAccordion services={servicesForPillar("registration")} />
        </div>
      </div>
    </div>
  );
}

function CounterpartiesPanel() {
  const pillar = VERIFICATION_PILLARS[1];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <PanelPhoto
          src={pillar.image}
          alt={pillar.imageAlt}
          eyebrow="Trade desk"
          caption="Counterparty diligence coordinated by our trade desk and verification partners."
        />
        <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-amber-900 uppercase">Intelligence note</p>
          <p className="mt-3 text-sm leading-relaxed text-amber-950">{REAL_TIME_INTELLIGENCE.lead}</p>
          <p className="mt-3 text-xs leading-relaxed text-amber-900">{REAL_TIME_INTELLIGENCE.disclaimer}</p>
        </aside>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Scope by service</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{REAL_TIME_INTELLIGENCE.note}</p>
        <div className="mt-6">
          <ServiceAccordion services={servicesForPillar("counterparties")} />
        </div>
      </div>
    </div>
  );
}

function RiskPanel() {
  const pillar = VERIFICATION_PILLARS[2];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <PanelPhoto
          src={pillar.image}
          alt={pillar.imageAlt}
          eyebrow="Operations"
          caption="Facility, credit, supply-chain, and certification checks before you commit."
        />
        <div className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
            Six-step framework
          </p>
          <ol className="mt-4 space-y-3">
            {VERIFICATION_FRAMEWORK_STEPS.map((step) => (
              <li key={step.step} className="flex gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#071525] text-[10px] font-bold text-[#d4a84b]">
                  {step.step}
                </span>
                <div>
                  <p className="font-semibold text-[#001a3d]">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#555555]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Scope by service</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Credit, supply chain, physical presence, and certification verification services.
        </p>
        <div className="mt-6">
          <ServiceAccordion services={servicesForPillar("risk")} />
        </div>
      </div>
    </div>
  );
}

function CompliancePanel() {
  const pillar = VERIFICATION_PILLARS[3];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <PanelPhoto
          src={pillar.image}
          alt={pillar.imageAlt}
          eyebrow="Structured reporting"
          caption="Findings compiled into a clear report your legal and banking teams can review."
        />
        <div className="rounded-lg border border-[#d5d0c8] bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">Report sections</p>
          <ol className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
            {VERIFICATION_REPORT_SECTIONS.map((section, index) => (
              <li key={section.title} className="flex gap-3 text-sm">
                <span className="shrink-0 font-bold tabular-nums text-[#c88e4a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium text-[#001a3d]">{section.title}</p>
                  <p className="text-xs text-[#666666]">{section.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">Scope by service</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Sanctions screening, commodity availability, and independent inspection coordination.
        </p>
        <div className="mt-6">
          <ServiceAccordion services={servicesForPillar("compliance")} />
        </div>
      </div>
    </div>
  );
}

export function VerificationHub() {
  const [activeTab, setActiveTab] = useState<VerificationPillarId>("registration");
  const reduce = useReducedMotion();
  const panel = PANEL_TITLES[activeTab];

  const selectTab = useCallback((id: VerificationPillarId) => {
    setActiveTab(id);
    document.getElementById("verification-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <section id="our-services" className="scroll-mt-24 border-b border-[#d5d0c8] bg-white py-12 lg:py-16">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            Due diligence library
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            Pick a topic to explore — registration, counterparties, risk, or compliance
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555]">{VERIFICATION_HUB_INTRO}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VERIFICATION_PILLARS.map((pillar) => {
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

      <section id="verification-hub" className="scroll-mt-24 bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="sticky top-[4.5rem] z-10 -mx-1 mb-8 overflow-x-auto border-b border-[#d5d0c8] bg-[#f3f1ec]/95 px-1 pb-px backdrop-blur-sm">
            <div className="flex min-w-max gap-1">
              {VERIFICATION_PILLARS.map((tab) => (
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
                  {activeTab === "registration" ? <RegistrationPanel /> : null}
                  {activeTab === "counterparties" ? <CounterpartiesPanel /> : null}
                  {activeTab === "risk" ? <RiskPanel /> : null}
                  {activeTab === "compliance" ? <CompliancePanel /> : null}
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
                    {activeTab === "registration" ? <RegistrationPanel /> : null}
                    {activeTab === "counterparties" ? <CounterpartiesPanel /> : null}
                    {activeTab === "risk" ? <RiskPanel /> : null}
                    {activeTab === "compliance" ? <CompliancePanel /> : null}
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
