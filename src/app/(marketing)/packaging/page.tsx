import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getPackagingCatalog } from "@/lib/content/packaging-catalog";
import { buyerPortalHref } from "@/lib/marketing/cta-links";

export const metadata: Metadata = {
  title: "Packaging",
  description:
    "Dry, liquid, and unpackaged bulk packaging modes for commodity trade — advantages, compatibility, and selection in buyer RFQs.",
};

const MODE_LABELS = {
  dry: "Dry bulk",
  liquid: "Liquid bulk",
  unpackaged: "Unpackaged / vessel",
} as const;

export default async function PackagingPage() {
  const packaging = await getPackagingCatalog();
  const grouped = {
    dry: packaging.filter((p) => p.mode === "dry"),
    liquid: packaging.filter((p) => p.mode === "liquid"),
    unpackaged: packaging.filter((p) => p.mode === "unpackaged"),
  };

  return (
    <>
      <PageHero
        tone="light"
        title="Packaging options"
        description="Finekarts discusses multiple packaging modes depending on product, corridor, and buyer facility constraints. Not every type is available for every product."
        primaryCta={{ href: buyerPortalHref("/portal/buyer/new-request"), label: "Select in buyer RFQ →" }}
        secondaryCta={{ href: "/products", label: "View products" }}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <p className="max-w-2xl text-base leading-relaxed text-[var(--stone)]">
            Packaging types below are managed in the platform catalogue — admins can add or remove
            options over time. Signed-in buyers choose packaging per line item in purchase requests.
          </p>

          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((mode) => (
            <div key={mode} className="mt-14">
              <h2 className="text-2xl font-semibold text-[var(--navy)]">{MODE_LABELS[mode]}</h2>
              <ul className="mt-6 divide-y divide-[var(--line)] border-t border-[var(--line)]">
                {grouped[mode].map((item, i) => (
                  <Reveal key={item.slug} delay={Math.min(i * 0.04, 0.15)}>
                    <li className="py-6" id={item.slug}>
                      <h3 className="text-lg font-semibold text-[var(--navy)]">{item.name}</h3>
                      <p className="mt-2 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
                        {item.description}
                      </p>
                      {item.advantages.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {item.advantages.map((adv) => (
                            <li key={adv} className="flex gap-2 text-base text-[var(--stone)]">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                              {adv}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-14">
            <Link href={buyerPortalHref("/portal/buyer/new-request")} className="btn btn-primary">
              Sign in to submit RFQ with packaging
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
