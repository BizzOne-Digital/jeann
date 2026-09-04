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
      <span className="text-[#d5d0c8]">{empty}</span>
    </span>
  );
}

export function PaymentTermsSection() {
  const recommended = PAYMENT_TERM_STRUCTURES.filter((row) => row.recommended);
  const alternatives = PAYMENT_TERM_STRUCTURES.filter((row) => !row.recommended);

  return (
    <>
      <section id="banking" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                SPA reference
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
                Recommended banking clause for commodity SPA
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#555555]">
                {BANKING_CLAUSE_INTRO} Not legal or banking advice.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <p className="mt-10 text-sm font-semibold tracking-[0.16em] text-[#888] uppercase">
              {BANKING_CLAUSE_SECTION_TITLE}
            </p>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {BANKING_CLAUSES.map((clause, i) => (
              <Reveal key={clause.title} delay={0.04 + i * 0.03}>
                <article className="flex h-full flex-col rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-[#001a3d]">{clause.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#555555]">{clause.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="payment-structures" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Payment structures
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
                Best structure for 12-month commodity contracts
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#555555]">
                {PAYMENT_TERMS_INTRO} Not legal or banking advice.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <h3 className="mt-12 text-sm font-semibold tracking-[0.16em] text-[#888] uppercase">
              Top-ranked structures
            </h3>
          </Reveal>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {recommended.map((row, i) => (
              <Reveal key={row.structure} delay={0.05 + i * 0.03}>
                <article className="relative overflow-hidden rounded-lg border border-[#c88e4a]/40 bg-white p-6 shadow-sm">
                  <span className="absolute top-0 right-0 rounded-bl-md bg-[#c88e4a] px-3 py-1 text-xs font-semibold text-[#001a3d]">
                    Top ranked
                  </span>
                  <h4 className="pr-24 text-lg font-semibold text-[#001a3d]">{row.structure}</h4>
                  <p className="mt-2 text-sm text-[#666666]">{row.primaryFunction}</p>
                  <p className="mt-1 text-xs font-medium text-[#888]">{row.iccCode}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-[#ebe7e0] pt-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-[#888] uppercase">
                        Buyer protection
                      </dt>
                      <dd className="mt-1.5">
                        <StarRating value={row.buyerProtection} label="Buyer protection" />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-[#888] uppercase">
                        Seller protection
                      </dt>
                      <dd className="mt-1.5">
                        <StarRating value={row.sellerProtection} label="Seller protection" />
                      </dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <h3 className="mt-12 text-sm font-semibold tracking-[0.16em] text-[#888] uppercase">
              Alternative structures
            </h3>
          </Reveal>
          <div className="mt-5 overflow-x-auto rounded-lg border border-[#d5d0c8] bg-white shadow-sm">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="border-b border-[#d5d0c8] bg-[#f9f8f5] text-xs tracking-wide text-[#888] uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Structure</th>
                  <th className="px-4 py-3 font-semibold">Primary function</th>
                  <th className="px-4 py-3 font-semibold">ICC / rules</th>
                  <th className="px-4 py-3 font-semibold">Buyer</th>
                  <th className="px-4 py-3 font-semibold">Seller</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((row) => (
                  <tr key={row.structure} className="border-b border-[#ebe7e0] last:border-0">
                    <td className="px-4 py-3.5 font-semibold text-[#001a3d]">{row.structure}</td>
                    <td className="px-4 py-3.5 text-[#555555]">{row.primaryFunction}</td>
                    <td className="px-4 py-3.5 text-xs text-[#888]">{row.iccCode}</td>
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

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Reveal delay={0.12}>
              <article className="rounded-lg border border-[#c88e4a]/30 bg-white p-6">
                <p className="text-sm font-semibold tracking-[0.12em] text-[#c88e4a] uppercase">
                  Preferred structure
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#555555]">
                  {PREFERRED_PAYMENT_STRUCTURE}
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.14}>
              <article className="rounded-lg border border-[#d5d0c8] bg-white p-6">
                <p className="text-sm font-semibold tracking-[0.12em] text-[#001a3d] uppercase">
                  SWIFT vs banking instruments
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#555555]">{SWIFT_INSTRUMENT_NOTE}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/** @deprecated Use PaymentTermsSection */
export function PaymentTermsTable() {
  return <PaymentTermsSection />;
}
