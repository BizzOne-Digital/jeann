import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { InspectionHub } from "@/components/marketing/InspectionHub";
import { INSPECTION_CTA } from "@/lib/content/inspections-content";

export function InspectionEnquiryCta() {
  return (
    <section id="request-inspection" className="scroll-mt-24 bg-white marketing-section">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#001a3d] text-white">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
                  {INSPECTION_CTA.tagline}
                </p>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{INSPECTION_CTA.title}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{INSPECTION_CTA.lead}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {INSPECTION_CTA.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/90"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/login"
                  className="focus-ring inline-flex items-center marketing-btn-primary px-6 py-3 text-sm font-semibold"
                >
                  Buyer portal — submit request
                </Link>
                <Link
                  href="/contact"
                  className="focus-ring inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact trade desk
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function InspectionPageSections() {
  return <InspectionHub />;
}
