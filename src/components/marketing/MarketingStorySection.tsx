import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { YouTubeEmbed } from "@/components/marketing/YouTubeEmbed";

export type MarketingContentBox = {
  title: string;
  body: string;
};

export function MarketingStorySection({
  eyebrow,
  title,
  lead,
  boxes,
  imageSrc,
  imageAlt,
  youtubeUrl,
  videoTitle,
  variant = "default",
  background = "white",
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  boxes: MarketingContentBox[];
  imageSrc: string;
  imageAlt: string;
  youtubeUrl?: string;
  videoTitle?: string;
  variant?: "default" | "reversed";
  background?: "white" | "cream";
}) {
  const bg = background === "cream" ? "bg-[#f3f1ec]" : "bg-white";

  return (
    <section className={`${bg} py-16 lg:py-20`}>
      <div className="container-page">
        <Reveal>
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{lead}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {boxes.map((box, index) => (
            <Reveal key={box.title} delay={index * 0.05}>
              <article className="h-full rounded-lg border border-[#d5d0c8] bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold tracking-[0.14em] text-[#c88e4a] uppercase">
                  {box.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#444444]">{box.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div
          className={`mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12 ${
            variant === "reversed" ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Reveal y={16}>
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888888] uppercase">
                In the field
              </p>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e4e0d8]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>
          </Reveal>
          {youtubeUrl ? (
            <Reveal y={16} delay={0.08}>
              <div>
                <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888888] uppercase">
                  Video overview
                </p>
                <YouTubeEmbed youtubeInput={youtubeUrl} title={videoTitle ?? "Finekarts overview video"} />
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
