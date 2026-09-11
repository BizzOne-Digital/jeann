import Image from "next/image";
import { MediaFieldPair } from "@/components/marketing/MediaFieldPair";
import { VERIFICATION_STORY } from "@/lib/content/marketing-pages";
import { HERO_PAGE_OVERLAY_HORIZONTAL } from "@/lib/marketing/hero-layout";

export function VerificationIntro() {
  const story = VERIFICATION_STORY;

  return (
    <>
      <section className="relative overflow-hidden py-12 text-white lg:py-16">
        <Image
          src="/images/inspections/warehouse-bulk-inspection.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          aria-hidden
        />
        <div className="absolute inset-0" style={{ background: HERO_PAGE_OVERLAY_HORIZONTAL }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/92 via-[#071525]/72 to-[#071525]/55" />
        <div className="absolute inset-0 bg-[#071525]/25" />

        <div className="container-page relative">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">{story.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">{story.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{story.lead}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {story.boxes.map((box) => (
              <article
                key={box.title}
                className="rounded-xl border border-white/15 bg-[#071525]/45 p-5 shadow-lg backdrop-blur-md"
              >
                <h3 className="text-xs font-semibold tracking-[0.14em] text-[#d4a84b] uppercase">
                  {box.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{box.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d5d0c8] bg-white py-10 lg:py-12">
        <div className="container-page">
          <MediaFieldPair
            imageSrc={story.imageSrc}
            imageAlt={story.imageAlt}
            youtubeUrl={story.youtubeUrl}
            videoTitle="Business verification overview"
          />
        </div>
      </section>
    </>
  );
}
