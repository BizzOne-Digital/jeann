import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  DISPUTE_CTA,
  DISPUTE_DISCLAIMER,
  DISPUTE_DOCUMENTATION,
  DISPUTE_FAIRNESS,
  DISPUTE_PARTNERS,
  DISPUTE_PAYMENTS,
  DISPUTE_PROCESS_STEPS,
  DISPUTE_QUALITY_SAFETY,
  DISPUTE_RESPONSIBILITIES,
} from "@/lib/content/dispute-resolution-content";

function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <Reveal variant="blur-up">
      <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">{eyebrow}</p>
      <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{lead}</p>
    </Reveal>
  );
}

export function DisputeResolutionSections() {
  return (
    <>
      <section className="bg-white marketing-section">
        <div className="container-page">
          <SectionHeader
            eyebrow={DISPUTE_FAIRNESS.eyebrow}
            title={DISPUTE_FAIRNESS.title}
            lead={DISPUTE_FAIRNESS.lead}
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-[#555555]">
            {DISPUTE_FAIRNESS.paragraphs.map((p) => (
              <Reveal key={p.slice(0, 40)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {DISPUTE_PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06} bounce>
                <article className="h-full marketing-box rounded-lg p-6 shadow-sm">
                  <p className="text-sm font-semibold text-[#1b3a5c]">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <SectionHeader
            eyebrow={DISPUTE_RESPONSIBILITIES.eyebrow}
            title={DISPUTE_RESPONSIBILITIES.title}
            lead={DISPUTE_RESPONSIBILITIES.lead}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="marketing-box h-full rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#001a3d]">Seller (Finekarts) — typical duties</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#555555]">
                  {DISPUTE_RESPONSIBILITIES.sellerPoints.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="marketing-box h-full rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#001a3d]">Buyer — typical duties</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#555555]">
                  {DISPUTE_RESPONSIBILITIES.buyerPoints.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="mt-8 rounded-lg border border-[#d5d0c8] bg-white/80 p-5 text-sm leading-relaxed text-[#555555]">
              {DISPUTE_RESPONSIBILITIES.riskTransferNote}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <SectionHeader
            eyebrow={DISPUTE_QUALITY_SAFETY.eyebrow}
            title={DISPUTE_QUALITY_SAFETY.title}
            lead={DISPUTE_QUALITY_SAFETY.lead}
          />
          <ul className="mt-8 space-y-3 text-base leading-relaxed text-[#555555]">
            {DISPUTE_QUALITY_SAFETY.bullets.map((item, i) => (
              <Reveal key={item.slice(0, 40)} delay={i * 0.05}>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#001a3d] text-white marketing-section">
        <div className="container-page">
          <Reveal variant="blur-up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              {DISPUTE_DOCUMENTATION.eyebrow}
            </p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-white sm:text-3xl">
              {DISPUTE_DOCUMENTATION.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">{DISPUTE_DOCUMENTATION.lead}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80">{DISPUTE_DOCUMENTATION.body}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/logistics"
                className="focus-ring inline-flex items-center marketing-btn-primary px-5 py-2.5 text-sm font-semibold"
              >
                CIF & logistics →
              </Link>
              <Link
                href="/resources#resources-hub"
                className="focus-ring inline-flex items-center rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Trade documents
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <SectionHeader
            eyebrow={DISPUTE_PARTNERS.eyebrow}
            title={DISPUTE_PARTNERS.title}
            lead={DISPUTE_PARTNERS.lead}
          />
          <Reveal>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#555555]">{DISPUTE_PARTNERS.body}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/partners" className="text-sm font-semibold text-[#1b3a5c] hover:text-[#c88e4a]">
                Verification partners →
              </Link>
              <Link href="/inspections" className="text-sm font-semibold text-[#1b3a5c] hover:text-[#c88e4a]">
                Inspection overview →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <SectionHeader
            eyebrow={DISPUTE_PAYMENTS.eyebrow}
            title={DISPUTE_PAYMENTS.title}
            lead={DISPUTE_PAYMENTS.lead}
          />
          <ul className="mt-8 space-y-3 text-base leading-relaxed text-[#555555]">
            {DISPUTE_PAYMENTS.bullets.map((item, i) => (
              <Reveal key={item.slice(0, 40)} delay={i * 0.05}>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1b3a5c]" aria-hidden />
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.12}>
            <Link
              href={DISPUTE_PAYMENTS.resourcesHref}
              className="mt-8 inline-flex text-sm font-semibold text-[#1b3a5c] hover:text-[#c88e4a]"
            >
              Compare payment structures on Resources →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <Reveal>
            <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-2xl font-semibold text-[#001a3d]">{DISPUTE_CTA.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555555]">{DISPUTE_CTA.lead}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={DISPUTE_CTA.primary.href}
                  className="focus-ring inline-flex items-center marketing-btn-primary px-6 py-3 text-sm font-semibold"
                >
                  {DISPUTE_CTA.primary.label}
                </Link>
                <Link
                  href={DISPUTE_CTA.secondary.href}
                  className="focus-ring inline-flex items-center rounded-md border border-[#d5d0c8] px-6 py-3 text-sm font-semibold text-[#001a3d] transition hover:border-[#1b3a5c]"
                >
                  {DISPUTE_CTA.secondary.label}
                </Link>
              </div>
              <p className="mt-8 border-t border-[#ebe7e0] pt-6 text-xs leading-relaxed text-[#888]">
                {DISPUTE_DISCLAIMER}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
