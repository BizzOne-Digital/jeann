"use client";

import { YouTubeEmbed } from "@/components/marketing/YouTubeEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { getPartnersVideoFeatures } from "@/lib/content/partners-catalog";

/** Independent inspection firms — shown on `/inspections`, not the producer `/partners` page. */
export function InspectionFirmVideoStrip() {
  const firms = getPartnersVideoFeatures();

  return (
    <section className="border-t border-[var(--line)] bg-[#001a3d] py-12 text-white lg:py-14">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            Firms we may appoint
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
            Overview videos from recognized inspection organizations
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">
            Finekarts coordinates these brands when contracts require independent evidence — certificates
            are issued under their mandate, not by Finekarts.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {firms.map((firm, i) => (
            <Reveal key={firm.slug} delay={i * 0.05}>
              <div>
                <p className="mb-2 text-sm font-semibold text-white">{firm.name}</p>
                {firm.youtubeVideoId ? (
                  <YouTubeEmbed
                    youtubeInput={firm.youtubeVideoId}
                    title={`${firm.name} overview`}
                    className="overflow-hidden rounded-lg border border-white/15"
                  />
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
