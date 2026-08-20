import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  PARTNER_CATEGORIES,
  type PartnerEntry,
} from "@/lib/content/partners-catalog";

function PartnerPhoto({ partner }: { partner: PartnerEntry }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-[var(--mist)] sm:aspect-[21/9]">
      {partner.photoSrc ? (
        <Image
          src={partner.photoSrc}
          alt={partner.photoAlt ?? `${partner.name} — partnership`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 960px"
        />
      ) : (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center border border-dashed border-[var(--line-strong)] bg-[var(--cream)] px-6 text-center">
          <p className="text-sm font-semibold text-[var(--navy)]">Partner photo</p>
          <p className="mt-1 text-xs text-[var(--stone)]">
            Upload to <code className="text-[var(--ocean)]">public/images/partners/{partner.slug}.jpg</code>
          </p>
        </div>
      )}
    </div>
  );
}

export function PartnerProfileCard({ partner }: { partner: PartnerEntry }) {
  return (
    <Reveal>
      <article
        id={partner.slug}
        className="scroll-mt-28 overflow-hidden rounded-lg border border-[var(--line)] bg-white"
      >
        <div className="border-b border-[var(--line)] bg-[var(--cream)]/60 px-6 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
            {PARTNER_CATEGORIES[partner.category]}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--navy)] sm:text-3xl">{partner.name}</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--stone)]">{partner.intro}</p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <PartnerPhoto partner={partner} />

          <div className="prose-trade mt-8 space-y-4 text-base leading-relaxed text-[var(--stone)]">
            {partner.content.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          {partner.website ? (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-semibold text-[var(--navy)] underline"
            >
              Visit {partner.name} website →
            </a>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

export function PartnersHomeTeaser({
  partners,
}: {
  partners: PartnerEntry[];
}) {
  const featured = partners.filter((p) => p.slug !== "more-partners").slice(0, 4);

  return (
    <section className="border-y border-[var(--line)] bg-[#0a1628] py-14 text-white lg:py-16">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a84b]">
            Verification partners
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">
            Recognized inspection & certification partners
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            Finekarts aligns with independent verification organizations so international buyers
            can confirm counterparties, cargo, and documentation with confidence.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((partner, i) => (
            <Reveal key={partner.slug} delay={i * 0.05}>
              <li>
                <Link
                  href={`/partners#${partner.slug}`}
                  className="group flex h-full flex-col rounded-md border border-white/12 bg-white/[0.04] p-5 transition hover:border-[#d4a84b]/45 hover:bg-white/[0.08]"
                >
                  <p className="text-lg font-semibold text-white group-hover:text-[#d4a84b]">
                    {partner.name}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{partner.intro}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#d4a84b]">
                    Read more →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <Link
            href="/partners"
            className="focus-ring mt-8 inline-flex items-center gap-2 rounded-sm border border-[#d4a84b]/60 px-5 py-2.5 text-sm font-semibold text-[#f5e6c8] transition hover:bg-[#d4a84b]/15"
          >
            View all partners & full profiles →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
