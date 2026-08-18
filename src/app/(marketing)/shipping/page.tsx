import type { Metadata } from "next";
import Link from "next/link";
import { ShippingHero } from "@/components/marketing/ShippingHero";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Seller and buyer responsibilities under FOB and CIF for bulk commodity shipments — container, break-bulk, and vessel programmes.",
};

const SELLER_FOB = [
  "Deliver goods on board the vessel at the named port of shipment",
  "Export clearance where applicable",
  "Loading costs at origin port (unless contract states otherwise)",
  "Provide commercial invoice, packing list, and agreed certificates",
  "Risk transfers when goods are on board — timing per Incoterms edition referenced in contract",
];

const BUYER_FOB = [
  "Main carriage from port of shipment",
  "Insurance from port of shipment (unless separately agreed)",
  "Import clearance and duties",
  "Discharge and inland transport at destination",
  "Destination inspection where contract requires buyer-appointed survey",
];

const SELLER_CIF = [
  "Contract carriage to named destination port",
  "Minimum insurance cover as specified in contract / Incoterms rules",
  "Export clearance",
  "Loading at origin",
  "Provide transport document and agreed inspection certificates",
];

const BUYER_CIF = [
  "Import clearance, duties, and terminal charges at destination",
  "Discharge arrangements unless contract allocates otherwise",
  "Risk transfer at destination port per agreed Incoterms edition",
  "Verify insurance scope meets buyer's risk profile — minimum cover may not be sufficient",
];

export default function ShippingPage() {
  return (
    <>
      <ShippingHero />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--navy)]">FOB — typical allocation</h2>
              <p className="mt-2 text-base text-[var(--stone)]">
                Free On Board — seller delivers on board at named port; buyer often arranges main
                carriage and insurance from that point.
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--ocean)]">Seller</h3>
              <ul className="mt-3 space-y-2">
                {SELLER_FOB.map((item) => (
                  <li key={item} className="flex gap-2 text-base text-[var(--stone)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--ocean)]">Buyer</h3>
              <ul className="mt-3 space-y-2">
                {BUYER_FOB.map((item) => (
                  <li key={item} className="flex gap-2 text-base text-[var(--stone)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--navy)]">CIF — typical allocation</h2>
              <p className="mt-2 text-base text-[var(--stone)]">
                Cost, Insurance and Freight — seller typically contracts freight and minimum
                insurance to named destination port.
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--ocean)]">Seller</h3>
              <ul className="mt-3 space-y-2">
                {SELLER_CIF.map((item) => (
                  <li key={item} className="flex gap-2 text-base text-[var(--stone)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--ocean)]">Buyer</h3>
              <ul className="mt-3 space-y-2">
                {BUYER_CIF.map((item) => (
                  <li key={item} className="flex gap-2 text-base text-[var(--stone)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[var(--navy)]">Shipment modes</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Containerised",
                text: "FCL/LCL programmes for bagged or palletised agricultural goods where route and product permit.",
              },
              {
                title: "Break-bulk / bagged",
                text: "Vessel hold loading for sugar, rice, pulses and similar — tally and hold cleanliness critical.",
              },
              {
                title: "Dry-bulk & tanker",
                text: "Unpackaged dry bulk or liquid tanker programmes subject to product chemistry and route.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-lg border border-[var(--line)] bg-white p-6">
                <h3 className="text-lg font-semibold text-[var(--navy)]">{card.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--stone)]">{card.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-base text-[var(--stone)]">
            Document checklists are route-specific — see{" "}
            <Link href="/resources" className="font-semibold text-[var(--navy)] underline">
              Resources
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
