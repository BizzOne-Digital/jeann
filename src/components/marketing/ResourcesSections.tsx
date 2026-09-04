import Link from "next/link";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import { Reveal } from "@/components/motion/Reveal";

const QUICK_LINKS = [
  {
    id: "banking",
    label: "Banking & SPA",
    description: "Illustrative PSA wording for LC, SBLC, and related instruments.",
  },
  {
    id: "payment-structures",
    label: "Payment structures",
    description: "How common 12-month commodity programmes are ranked.",
  },
  {
    id: "documents",
    label: "Trade documents",
    description: "Commercial, transport, origin, and quality certificates.",
  },
  {
    id: "downloads",
    label: "Downloads",
    description: "Checklists and counsel-approved PDF references.",
  },
] as const;

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
    icon: "01",
    items: [
      {
        name: "Commercial invoice",
        note: "Seller's billing document — must align with contract and LC wording when documentary credit is used.",
      },
      {
        name: "Packing list",
        note: "Details packages, weights, and marks. Must match invoice and transport documents.",
      },
      {
        name: "Proforma invoice",
        note: "Often used pre-shipment for buyer approval or LC opening — not a demand for payment unless agreed.",
      },
    ],
  },
  {
    title: "Transport documents",
    icon: "02",
    items: [
      {
        name: "Bill of lading",
        note: "Key ocean transport document. Negotiability and title depend on type and bank requirements.",
      },
      {
        name: "Sea waybill",
        note: "Non-negotiable transport document — common where title transfer follows contract.",
      },
      {
        name: "Charter party references",
        note: "Bulk vessel programmes may reference charter terms alongside BL or survey reports.",
      },
    ],
  },
  {
    title: "Origin & compliance",
    icon: "03",
    items: [
      {
        name: "Certificate of origin",
        note: "Corridor-specific — confirms declared origin for customs and banking.",
      },
      {
        name: "Phytosanitary certificate",
        note: "Required for many agricultural imports — scope varies by destination.",
      },
      {
        name: "Health / veterinary certificates",
        note: "Product and corridor dependent.",
      },
    ],
  },
  {
    title: "Quality & quantity",
    icon: "04",
    items: [
      {
        name: "Certificate of analysis",
        note: "Laboratory results against contractual specifications.",
      },
      {
        name: "Certificate of weight & quantity",
        note: "Independent determination of loaded quantity.",
      },
      {
        name: "Inspection certificates",
        note: "Issued by mutually agreed independent inspection companies — see Inspections.",
      },
    ],
  },
  {
    title: "Negotiation instruments",
    icon: "05",
    items: [
      {
        name: "LOI — Letter of Intent",
        note: "Non-binding expression of interest for further negotiation.",
      },
      {
        name: "SCO / FCO",
        note: "Indicative corporate offers — binding effect depends on wording and jurisdiction.",
      },
      {
        name: "PSA / SPA",
        note: "Purchase and sale agreement defining specs, price mechanics, delivery, and remedies.",
      },
      {
        name: "Letter of Credit (LC)",
        note: "Bank instrument — type and document compliance are negotiated per deal.",
      },
    ],
  },
];

const RELATED_LINKS = [
  { href: "/logistics", label: "Logistics" },
  { href: "/inspections", label: "Inspections" },
  { href: "/shipping-documents", label: "Shipping documents" },
  { href: "/insights", label: "Insights" },
];

export function ResourcesQuickNav() {
  return (
    <section className="border-b border-[#d5d0c8] bg-[#001a3d] py-10 text-white lg:py-12">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            On this page
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Jump to a topic</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link, i) => (
            <Reveal key={link.id} delay={i * 0.05}>
              <a
                href={`#${link.id}`}
                className="group flex h-full flex-col rounded-lg border border-white/15 bg-white/5 p-5 transition hover:border-[#d4a84b]/50 hover:bg-white/10"
              >
                <span className="text-sm font-semibold text-[#d4a84b] group-hover:text-[#e8c06a]">
                  {link.label}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-white/75">{link.description}</span>
                <span className="mt-4 text-xs font-semibold tracking-wide text-white/90 uppercase group-hover:text-[#d4a84b]">
                  View section →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResourcesDocumentOverview({ introBody }: { introBody: string }) {
  return (
    <section id="documents" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Document overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
              What buyers typically review
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">{introBody}</p>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2">
            {RELATED_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d] transition hover:border-[#c88e4a] hover:text-[#c88e4a]"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {DOCUMENT_GROUPS.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.04}>
              <article className="flex h-full flex-col rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001a3d] text-xs font-bold text-[#d4a84b]"
                    aria-hidden
                  >
                    {group.icon}
                  </span>
                  <h3 className="pt-1.5 text-lg font-semibold text-[#001a3d]">{group.title}</h3>
                </div>
                <ul className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <li key={item.name} className="border-t border-[#e4e0d8] pt-4 first:border-0 first:pt-0">
                      <p className="text-sm font-semibold text-[#001a3d]">{item.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#666666]">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <LegalDocumentsPanel category="trade" title="Legal & trade documents (PDF)" />
        </Reveal>
      </div>
    </section>
  );
}

export function ResourcesDownloads() {
  return (
    <section id="downloads" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            Downloads
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
            Printable references
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555555]">
            Starter checklists and PDFs for internal review. Contract teams should always confirm
            final document sets with counsel and the issuing bank.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DOWNLOADS.map((file, i) => (
            <Reveal key={file.href} delay={i * 0.05}>
              <article className="flex h-full flex-col justify-between rounded-lg border border-[#d5d0c8] bg-white p-6 shadow-sm">
                <div>
                  <p className="text-lg font-semibold text-[#001a3d]">{file.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#666666]">{file.note}</p>
                </div>
                <a
                  href={file.href}
                  download
                  className="focus-ring mt-6 inline-flex w-fit items-center rounded-md bg-[#1b3a5c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13293d]"
                >
                  Download file
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResourcesEnquiryCta() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#001a3d] text-white">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
                  Next step
                </p>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Ready to submit an enquiry?</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                  Signed-in buyers can submit purchase requests, book consultations, and message the
                  trade desk from the buyer portal. General questions can also be sent via the
                  contact form.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/login"
                  className="focus-ring inline-flex items-center rounded-md bg-[#d4a84b] px-6 py-3 text-sm font-semibold text-[#001a3d] transition hover:bg-[#e8c06a]"
                >
                  Buyer sign in
                </Link>
                <Link
                  href="/register/buyer"
                  className="focus-ring inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Register
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="focus-ring inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
