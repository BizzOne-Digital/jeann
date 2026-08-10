import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Shipping documents",
  description:
    "Overview of shipping and trade document categories. Required sets vary by product, corridor, and bank.",
};

const CATEGORIES = [
  {
    title: "Commercial documents",
    items: ["Commercial invoice", "Packing list", "Proforma invoice (pre-shipment)"],
    note: "Invoice and packing details must align with LC or contract wording when documentary credit is used.",
  },
  {
    title: "Transport documents",
    items: ["Bill of lading", "Sea waybill", "Charter party references (bulk)"],
    note: "Title and negotiability depend on document type and bank requirements.",
  },
  {
    title: "Origin and compliance",
    items: ["Certificate of origin", "Phytosanitary certificate", "Health or veterinary certificates"],
    note: "Corridor-specific; not every product requires every certificate.",
  },
  {
    title: "Quality and quantity",
    items: ["Certificate of analysis", "Certificate of weight and quantity", "Inspection certificates"],
    note: "Inspection agency, scope, and sampling rules are agreed per transaction.",
  },
];

export default function ShippingDocumentsPage() {
  return (
    <>
      <PageHero
        title="Shipping document overview"
        description="Document checklists are configurable — not universally mandatory. Banks, customs, and buyers may require different sets."
        primaryCta={{ href: "/trade#purchase-request", label: "Discuss documents in an RFQ →" }}
        secondaryCta={{ href: "/insights", label: "Read insights" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <p className="max-w-2xl text-sm leading-relaxed text-[#666666]">
            Finekarts coordinates expectations during transaction setup. Final requirements are
            confirmed in contract and any Letter of Credit. Read{" "}
            <Link
              href="/insights/document-checklists-are-route-specific"
              className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
            >
              why checklists are route-specific
            </Link>
            .
          </p>

          <div className="mt-12 grid gap-0 border-t border-[#d5d0c8] md:grid-cols-2">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.05}>
                <div
                  className={`border-b border-[#d5d0c8] py-8 md:px-6 ${i % 2 === 0 ? "md:border-r" : ""}`}
                >
                  <h2 className="text-xl font-semibold text-[#001a3d]">{cat.title}</h2>
                  <ul className="mt-4 space-y-2 text-sm text-[#555555]">
                    {cat.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-[#888]">{cat.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-[#666666]">
            Product pages list example document categories for each commodity. Those lists are
            starting points for discussion — not guarantees that every document will be issued or
            accepted without amendment.
          </p>
        </div>
      </section>
    </>
  );
}
