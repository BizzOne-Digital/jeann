import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  PRODUCT_QUALITY_COMPLIANCE,
  type ProductSpotlight,
} from "@/lib/content/product-quality-spotlights";

export function ProductQualitySpotlight({
  spotlights,
  variant = "navy",
}: {
  spotlights: readonly ProductSpotlight[];
  variant?: "navy" | "light";
}) {
  const isNavy = variant === "navy";

  return (
    <section
      className={
        isNavy
          ? "border-y border-[#0d2844] bg-[#001a3d] py-12 text-white lg:py-14"
          : "border-y border-[var(--line)] bg-[var(--mist)] py-12 lg:py-14"
      }
    >
      <div className="container-page">
        <Reveal variant="up">
          <p
            className={
              isNavy
                ? "text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase"
                : "text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase"
            }
          >
            {PRODUCT_QUALITY_COMPLIANCE.eyebrow}
          </p>
          <h2
            className={`mt-2 max-w-3xl text-2xl font-semibold sm:text-3xl ${
              isNavy ? "text-white" : "text-[#001a3d]"
            }`}
          >
            {PRODUCT_QUALITY_COMPLIANCE.title}
          </h2>
          <p
            className={`mt-3 max-w-3xl text-base leading-relaxed ${
              isNavy ? "text-white/82" : "text-[#555555]"
            }`}
          >
            {PRODUCT_QUALITY_COMPLIANCE.lead}
          </p>
          <ul
            className={`mt-5 max-w-3xl space-y-2 text-sm leading-relaxed ${
              isNavy ? "text-white/88" : "text-[#444444]"
            }`}
          >
            {PRODUCT_QUALITY_COMPLIANCE.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isNavy ? "bg-[#d4a84b]" : "bg-[#c88e4a]"}`}
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {spotlights.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  isNavy
                    ? "block rounded-md border border-white/12 bg-white/5 px-4 py-3 transition hover:border-[#d4a84b]/40"
                    : "block rounded-md border border-[var(--line)] bg-white px-4 py-3 transition hover:border-[#c88e4a]/35"
                }
              >
                <p className={`font-semibold ${isNavy ? "text-white" : "text-[#001a3d]"}`}>{item.name}</p>
                <p className={`mt-1 text-sm ${isNavy ? "text-white/78" : "text-[#555555]"}`}>{item.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className={`mt-6 text-sm ${isNavy ? "text-white/70" : "text-[#666666]"}`}>
          <Link href="/products" className="font-semibold underline underline-offset-4">
            Full catalog
          </Link>
          {" · "}
          <Link href="/inspections" className="font-semibold underline underline-offset-4">
            Inspection
          </Link>
        </p>
      </div>
    </section>
  );
}
