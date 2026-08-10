import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getPackaging } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Packaging",
  description:
    "Dry, liquid, and unpackaged bulk packaging modes discussed in commodity trade — product compatibility varies.",
};

const MODE_LABELS = {
  dry: "Dry bulk",
  liquid: "Liquid bulk",
  unpackaged: "Unpackaged / vessel",
} as const;

export default function PackagingPage() {
  const packaging = getPackaging();
  const grouped = {
    dry: packaging.filter((p) => p.mode === "dry"),
    liquid: packaging.filter((p) => p.mode === "liquid"),
    unpackaged: packaging.filter((p) => p.mode === "unpackaged"),
  };

  return (
    <>
      <PageHero
        title="Packaging options"
        description="Finekarts discusses multiple packaging modes depending on product, corridor, and buyer facility constraints. Not every type is available for every product."
        primaryCta={{ href: "/trade#purchase-request", label: "Discuss in an RFQ →" }}
        secondaryCta={{ href: "/products", label: "View products" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <p className="max-w-2xl text-sm leading-relaxed text-[#666666]">
            Lists on this page are illustrative. Final packaging is confirmed contractually and may
            differ from marketing examples. See also{" "}
            <Link
              href="/products"
              className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
            >
              product pages
            </Link>{" "}
            for product-specific examples.
          </p>

          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((mode) => (
            <div key={mode} className="mt-14">
              <h2 className="text-2xl font-semibold text-[#001a3d]">{MODE_LABELS[mode]}</h2>
              <ul className="mt-6 border-t border-[#d5d0c8]">
                {grouped[mode].map((item, i) => (
                  <Reveal key={item.slug} delay={Math.min(i * 0.04, 0.15)}>
                    <li className="border-b border-[#d5d0c8] py-5">
                      <h3 className="font-semibold text-[#001a3d]">{item.name}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#555555]">
                        {item.description}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-14">
            <Link
              href="/trade#purchase-request"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Discuss packaging in an RFQ <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
