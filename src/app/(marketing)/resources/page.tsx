import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
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
  const intro = getSectionFields(cms, "intro");

  return (
    <>
      <CmsPageHero
        pageSlug="resources"
        tone="dark"
        defaults={{
          title: "Resources",
          description:
            "Educational reference for trade documents, terminology, and process notes. Purchase requests and consultations are submitted through the buyer portal after sign-in.",
          primaryCta: { href: "/login", label: "Buyer portal sign-in →" },
          secondaryCta: { href: "/register/buyer", label: "Register as buyer" },
        }}
      />

      <PaymentTermsTable />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {cmsField(
                intro,
                "body",
                "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
              )} See also{" "}
              <Link href="/logistics" className="font-semibold text-[var(--navy)] underline">
                Logistics
              </Link>
              ,{" "}
              <Link href="/inspections" className="font-semibold text-[var(--navy)] underline">
                Inspections
              </Link>
              , and{" "}
              <Link href="/insights" className="font-semibold text-[var(--navy)] underline">
                Insights
              </Link>
              .
            </p>
          </Reveal>

          <LegalDocumentsPanel category="trade" title="Legal & trade documents (PDF)" />

          <Reveal>
            <h2 className="mt-12 text-2xl font-semibold text-[var(--navy)]">Downloadable references</h2>
            <ul className="mt-6 divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {DOWNLOADS.map((file) => (
                <li key={file.href} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-[var(--ink)]">{file.title}</p>
                    <p className="mt-1 text-base text-[var(--stone)]">{file.note}</p>
                  </div>
                  <a href={file.href} download className="btn btn-secondary mt-2 w-fit shrink-0 sm:mt-0">
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-12 space-y-12">
            {DOCUMENT_GROUPS.map((group, gi) => (
              <div key={group.title}>
                <Reveal delay={gi * 0.04}>
                  <h2 className="text-2xl font-semibold text-[var(--navy)]">{group.title}</h2>
                </Reveal>
                <ul className="mt-6 divide-y divide-[var(--line)] border-t border-[var(--line)]">
                  {group.items.map((item, i) => (
                    <Reveal key={item.name} delay={0.05 + i * 0.03}>
                      <li className="py-5">
                        <p className="text-base font-semibold text-[var(--ink)]">{item.name}</p>
                        <p className="mt-1.5 text-base leading-relaxed text-[var(--stone)]">{item.note}</p>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-lg border border-[var(--line)] bg-[var(--cream)] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--navy)]">Submit an enquiry</h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--stone)]">
                Signed-in buyers can submit purchase requests, book consultations, and message the
                trade desk from the buyer portal.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/login" className="btn btn-primary">
                  Sign in
                </Link>
                <Link href="/register/buyer" className="btn btn-secondary">
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
