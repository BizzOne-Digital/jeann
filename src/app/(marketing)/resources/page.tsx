import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import { PageHero } from "@/components/marketing/PageHero";
import { PaymentTermsTable } from "@/components/marketing/PaymentTermsTable";
import { Reveal } from "@/components/motion/Reveal";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Trade documents, banking clauses, payment structures, and educational resources for qualified buyers. RFQs are submitted through the buyer portal after sign-in.",
};

const DOWNLOADS = [
  {
    title: "Commercial document checklist",
    href: "/docs/commercial-document-checklist.txt",
    note: "Plain-text starter list for buyer–seller document discussions.",
  },
];

const DOCUMENT_GROUPS = [
  {
    title: "Commercial documents",
    items: [
      { name: "Commercial invoice", note: "Seller's billing document — must align with contract and LC wording when documentary credit is used." },
      { name: "Packing list", note: "Details packages, weights, and marks. Must match invoice and transport documents." },
      { name: "Proforma invoice", note: "Often used pre-shipment for buyer approval or LC opening — not a demand for payment unless agreed." },
    ],
  },
  {
    title: "Transport documents",
    items: [
      { name: "Bill of lading", note: "Key ocean transport document. Negotiability and title depend on type and bank requirements." },
      { name: "Sea waybill", note: "Non-negotiable transport document — common where title transfer follows contract." },
      { name: "Charter party references", note: "Bulk vessel programmes may reference charter terms alongside BL or survey reports." },
    ],
  },
  {
    title: "Origin & compliance",
    items: [
      { name: "Certificate of origin", note: "Corridor-specific — confirms declared origin for customs and banking." },
      { name: "Phytosanitary certificate", note: "Required for many agricultural imports — scope varies by destination." },
      { name: "Health / veterinary certificates", note: "Product and corridor dependent." },
    ],
  },
  {
    title: "Quality & quantity",
    items: [
      { name: "Certificate of analysis", note: "Laboratory results against contractual specifications." },
      { name: "Certificate of weight & quantity", note: "Independent determination of loaded quantity." },
      { name: "Inspection certificates", note: "Issued by mutually agreed independent inspection companies — see Inspections." },
    ],
  },
  {
    title: "Negotiation instruments (educational)",
    items: [
      { name: "LOI — Letter of Intent", note: "Non-binding expression of interest for further negotiation." },
      { name: "SCO / FCO", note: "Indicative corporate offers — binding effect depends on wording and jurisdiction." },
      { name: "PSA / SPA", note: "Purchase and sale agreement defining specs, price mechanics, delivery, and remedies." },
      { name: "Letter of Credit (LC)", note: "Bank instrument — type and document compliance are negotiated per deal." },
    ],
  },
];

export default async function ResourcesPage() {
  const cms = await getPublishedPage("resources");
  const hero = getSectionFields(cms, "hero");
  const intro = getSectionFields(cms, "intro");

  return (
    <>
      <PageHero
        tone="light"
        title={cmsField(hero, "title", "Resources")}
        brand="Trade reference"
        description={cmsField(
          hero,
          "description",
          "Educational reference for trade documents, terminology, and process notes. Purchase requests and consultations are submitted through the buyer portal after sign-in.",
        )}
        primaryCta={{
          href: cmsField(hero, "primaryCtaHref", "/login"),
          label: cmsField(hero, "primaryCtaLabel", "Buyer portal sign-in →"),
        }}
        secondaryCta={{
          href: cmsField(hero, "secondaryCtaHref", "/register/buyer"),
          label: cmsField(hero, "secondaryCtaLabel", "Register as buyer"),
        }}
      />

      <PaymentTermsTable />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Document overview</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">
              {cmsField(
                intro,
                "body",
                "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
              )}{" "}
              See also{" "}
              <Link href="/logistics" className="font-semibold text-[#1b3a5c] underline">
                Logistics
              </Link>
              ,{" "}
              <Link href="/inspections" className="font-semibold text-[#1b3a5c] underline">
                Inspections
              </Link>
              , and{" "}
              <Link href="/insights" className="font-semibold text-[#1b3a5c] underline">
                Insights
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <LegalDocumentsPanel category="trade" title="Legal & trade documents (PDF)" />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f4f6f8] py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Downloadable references</h2>
          </Reveal>
          <ul className="mt-6 divide-y divide-[#d5d0c8] border-t border-[#d5d0c8] bg-white">
            {DOWNLOADS.map((file, i) => (
              <Reveal key={file.href} delay={i * 0.04}>
                <li className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-[#001a3d]">{file.title}</p>
                    <p className="mt-1 text-sm text-[#666666]">{file.note}</p>
                  </div>
                  <a
                    href={file.href}
                    download
                    className="focus-ring mt-2 inline-flex w-fit shrink-0 items-center rounded-md border border-[#1b3a5c] px-4 py-2.5 text-sm font-semibold text-[#1b3a5c] transition hover:bg-[#1b3a5c] hover:text-white sm:mt-0"
                  >
                    Download
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page space-y-14">
          {DOCUMENT_GROUPS.map((group, gi) => (
            <div key={group.title}>
              <Reveal delay={gi * 0.04}>
                <h2 className="text-xl font-semibold text-[#001a3d] sm:text-2xl">{group.title}</h2>
              </Reveal>
              <ul className="mt-6 divide-y divide-[#d5d0c8] border-t border-[#d5d0c8]">
                {group.items.map((item, i) => (
                  <Reveal key={item.name} delay={0.05 + i * 0.03}>
                    <li className="py-5">
                      <p className="text-base font-semibold text-[#001a3d]">{item.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#666666]">{item.note}</p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f6f8] py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <div className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[#001a3d]">Submit an enquiry</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#666666]">
                Signed-in buyers can submit purchase requests, book consultations, and message the
                trade desk from the buyer portal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="focus-ring inline-flex items-center rounded-md bg-[#1b3a5c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#13293d]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register/buyer"
                  className="focus-ring inline-flex items-center rounded-md border border-[#1b3a5c] px-6 py-3 text-sm font-semibold text-[#1b3a5c] transition hover:bg-[#1b3a5c] hover:text-white"
                >
                  Register
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
