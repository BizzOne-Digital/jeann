import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { SPA_INSPECTION_CLAUSES } from "@/lib/content/inspections-legal";

export const metadata: Metadata = {
  title: "Inspections",
  description:
    "Independent inspection, sampling, quality and quantity verification for international commodity trade. Educational overview — not legal advice.",
};

const INSPECTORS = [
  { name: "SGS", coverage: "Rice, grains, sugar, edible oils, food, minerals, metals, petroleum" },
  { name: "Intertek / Caleb Brett", coverage: "Grains, edible oils, crude oil, petroleum, chemicals, minerals" },
  { name: "Bureau Veritas Commodities", coverage: "Agriculture, food, oil & petrochemicals, minerals, coal, fertilizers" },
  { name: "Cotecna", coverage: "Agricultural commodities, food, minerals/metals" },
  { name: "Control Union", coverage: "Grains, oilseeds, vegetable oils, sugar, fertilizer, nuts" },
  { name: "CCIC", coverage: "Agricultural products, food, minerals" },
  { name: "Certispec", coverage: "Agricultural and bulk commodities (Canadian grain-related services)" },
];

const FUNCTIONS = [
  {
    id: "quantity",
    title: "A. Quantity verification",
    text: "Independent establishment of quantity loaded — weighbridge verification, tank measurement, draft survey, shore-tank measurement, tally, container verification, and discharge surveys where agreed.",
  },
  {
    id: "quality",
    title: "B. Quality verification",
    text: "Comparison of cargo against contractual specifications — for rice (broken %, moisture, foreign matter), sugar (ICUMSA, polarization, moisture), edible oils (FFA, moisture & impurities, peroxide value), and other agreed parameters.",
  },
  {
    id: "sampling",
    title: "C. Sampling",
    text: "Representative sampling per contractual or industry method — location, frequency, composite procedures, sealing, laboratory routing, retention samples, and chain of custody.",
  },
  {
    id: "pre-shipment",
    title: "D. Pre-shipment inspection",
    text: "Verification of availability, storage condition, packaging, product identity, vessel/container suitability, cleanliness, and loading readiness before shipment.",
  },
  {
    id: "loading",
    title: "E. Loading supervision",
    text: "Documentation during loading — quantities, lot numbers, seals, sampling, hold/tank condition, contamination risks, and completion records.",
  },
  {
    id: "vessel",
    title: "F. Vessel / hold / tank inspection",
    text: "Suitability, cleanliness, previous cargo, odour, water ingress, residues, pest contamination, and pipeline condition for liquid cargoes.",
  },
  {
    id: "lab",
    title: "G. Laboratory analysis",
    text: "Testing against internationally recognized standards. Where required, laboratories should hold ISO/IEC 17025 accreditation for the relevant scope.",
  },
  {
    id: "certificates",
    title: "H. Certificates",
    text: "Certificate of Quality, Quantity/Weight, Analysis, Inspection Certificate, Loading Supervision Report, Draft Survey Report, and related documents as agreed.",
  },
];

const GALLERY = [
  { src: "/images/inspections/sampling-grain.png", alt: "Inspector sampling bulk grain at port" },
  { src: "/images/inspections/cargo-inspector-loading.png", alt: "Cargo inspector supervising vessel loading" },
  { src: "/images/inspections/tank-sampling.png", alt: "Tank sampling on vessel deck" },
  { src: "/images/inspections/sugar-bags-hold.png", alt: "Quantity verification of bagged sugar in vessel hold" },
  { src: "/images/inspections/port-sampling.png", alt: "Port sampling of agricultural commodities" },
  { src: "/images/inspections/liquid-sampling.png", alt: "Liquid commodity sampling" },
];

export default function InspectionsPage() {
  return (
    <>
      <PageHero
        tone="light"
        title="Independent inspections"
        description="For global commodity trading, the inspection company should be independent of buyer and seller — appointed according to commodity, loading port, destination, contract standards, and required accreditation."
        imageSrc="/images/inspections/port-sampling.png"
        imageAlt=""
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              The exact legal meaning of “accredited” varies by service and country. Verify the
              specific office, laboratory, and scope of accreditation — not only the corporate name.
              Educational content only — not legal, banking, or contractual advice.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto rounded-lg border border-[var(--line)]">
            <table className="min-w-full text-left text-base">
              <thead className="bg-[var(--cream)] text-sm uppercase tracking-wide text-[var(--stone)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Inspection company</th>
                  <th className="px-4 py-3 font-semibold">Main commodity coverage</th>
                </tr>
              </thead>
              <tbody>
                {INSPECTORS.map((row) => (
                  <tr key={row.name} className="border-t border-[var(--line)]">
                    <td className="px-4 py-3 font-semibold text-[var(--navy)]">{row.name}</td>
                    <td className="px-4 py-3 text-[var(--stone)]">{row.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-base leading-relaxed text-[var(--stone)]">
            For example, the Canadian Grain Commission lists CCIC Canada, Certispec Services, Cotecna
            Canada, Intertek Canada and SGS Canada among authorized third-party service providers for
            sampling, inspection or weighing of grain received into terminal elevators.
          </p>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[var(--navy)] sm:text-3xl">
            What the inspection company should be responsible for
          </h2>
          <div className="mt-10 space-y-8">
            {FUNCTIONS.map((fn, i) => (
              <Reveal key={fn.id} delay={i * 0.03}>
                <div className="rounded-lg border border-[var(--line)] bg-white p-6">
                  <h3 className="text-lg font-semibold text-[var(--navy)]">{fn.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--stone)]">{fn.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[var(--navy)]">Accreditation & standards</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "ISO/IEC 17020 — inspection-body competence",
              "ISO/IEC 17025 — laboratory competence",
              "GAFTA — grains and agricultural commodities",
              "FOSFA — oils, seeds and fats",
              "TIC Council / IFIA-related recognition",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-base text-[var(--stone)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-14">
            <h2 className="text-2xl font-semibold text-[var(--navy)]">Field inspection gallery</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY.map((img) => (
                <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--mist)]">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-lg border border-[var(--line)] bg-[var(--cream)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--navy)]">SPA & inspection clauses (educational)</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              When inspection is linked to payment under a purchase and sale agreement (SPA), these
              23 topics are commonly negotiated. This is a checklist for discussion — not a contract
              template or legal advice.
            </p>
            <div className="mt-8 space-y-3">
              {SPA_INSPECTION_CLAUSES.map((clause) => (
                <details
                  key={clause.n}
                  className="group rounded-md border border-[var(--line)] bg-white px-4 py-3 open:pb-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-[var(--navy)] marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[var(--gold)]">{clause.n}.</span> {clause.title}
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-[var(--stone)]">{clause.text}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-lg border border-[var(--line)] bg-[var(--cream)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--navy)]">Contract & payment note</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--stone)]">
              If parties connect inspection to payment, the contract should state whether the
              certificate is a condition for payment, a documentary LC requirement, evidence of
              conformity, or an independent survey report. The inspector does not guarantee payment
              or either party&apos;s performance.
            </p>
            <p className="mt-4 text-base text-[var(--stone)]">
              Signed-in buyers can reference inspection preferences in a{" "}
              <Link href="/login" className="font-semibold text-[var(--navy)] underline">
                purchase request
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
