import {
  BANKING_CLAUSES,
  BANKING_CLAUSE_INTRO,
  BANKING_CLAUSE_SECTION_TITLE,
  PAYMENT_TERM_STRUCTURES,
  PAYMENT_TERMS_INTRO,
  PREFERRED_PAYMENT_STRUCTURE,
  SWIFT_INSTRUMENT_NOTE,
} from "@/lib/content/payment-terms";
import { Reveal } from "@/components/motion/Reveal";

function StarRating({ value, label }: { value: number; label: string }) {
  const filled = "★".repeat(value);
  const empty = "★".repeat(5 - value);
  return (
    <span
      className="inline-flex items-center gap-0.5 font-medium tracking-tight"
      aria-label={`${label}: ${value} out of 5`}
      title={`${value} / 5`}
    >
      <span className="text-[#c88e4a]">{filled}</span>
      <span className="text-[var(--line)]">{empty}</span>
    </span>
  );
}

export function PaymentTermsTable() {
  return (
    <>
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              SPA reference
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[var(--navy)] sm:text-4xl">
              Recommended banking clause for commodity SPA
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {BANKING_CLAUSE_INTRO} Not legal or banking advice.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--cream)]/40 p-6 sm:p-8">
              <h3 className="text-lg font-semibold uppercase tracking-wide text-[var(--navy)]">
                {BANKING_CLAUSE_SECTION_TITLE}
              </h3>
              <dl className="mt-6 space-y-6">
                {BANKING_CLAUSES.map((clause) => (
                  <div key={clause.title} className="border-t border-[var(--line)] pt-5 first:border-0 first:pt-0">
                    <dt className="text-sm font-semibold text-[var(--navy)]">{clause.title}</dt>
                    <dd className="mt-2 text-base leading-relaxed text-[var(--stone)]">{clause.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Payment structures
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-[var(--navy)] sm:text-4xl">
              Best structure for 12-month commodity contracts
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {PAYMENT_TERMS_INTRO} Not legal or banking advice.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto rounded-lg border border-[var(--line)] bg-white shadow-sm">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-[var(--line)] bg-[var(--cream)]/80 text-xs uppercase tracking-wide text-[var(--stone)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Structure</th>
                    <th className="px-4 py-3 font-semibold">Primary function</th>
                    <th className="px-4 py-3 font-semibold">Buyer protection</th>
                    <th className="px-4 py-3 font-semibold">Seller protection</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_TERM_STRUCTURES.map((row) => (
                    <tr
                      key={row.structure}
                      className={`border-b border-[var(--line)] last:border-0 ${
                        row.recommended ? "bg-[var(--cream)]/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-[var(--navy)]">
                        {row.structure}
                        {row.recommended ? (
                          <span className="ml-2 text-xs font-normal text-[#c88e4a]">Top ranked</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--stone)]">{row.primaryFunction}</td>
                      <td className="px-4 py-3.5">
                        <StarRating value={row.buyerProtection} label="Buyer protection" />
                      </td>
                      <td className="px-4 py-3.5">
                        <StarRating value={row.sellerProtection} label="Seller protection" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 rounded-lg border border-[#c88e4a]/30 bg-white p-6">
              <p className="text-base font-semibold text-[var(--navy)]">Preferred structure</p>
              <p className="mt-2 text-base leading-relaxed text-[var(--stone)]">
                {PREFERRED_PAYMENT_STRUCTURE}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-6 rounded-lg border border-[var(--line)] bg-white/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--navy)]">
                SWIFT vs banking instruments
              </p>
              <p className="mt-2 text-base leading-relaxed text-[var(--stone)]">
                {SWIFT_INSTRUMENT_NOTE}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
