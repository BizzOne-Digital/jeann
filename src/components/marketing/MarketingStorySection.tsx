import { Reveal } from "@/components/motion/Reveal";
import { ImageTriptych } from "@/components/marketing/ImageTriptych";
import { MediaFieldPair } from "@/components/marketing/MediaFieldPair";

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
  imageLayout = "default",
  showcaseImageSrc,
  showcaseImageAlt,
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
  imageLayout?: "default" | "triptych";
  showcaseImageSrc?: string;
  showcaseImageAlt?: string;
}) {
  const bg = background === "cream" ? "bg-[#f3f1ec]" : "bg-white";

  return (
    <section className={`${bg} marketing-section`}>
      <div className="container-page">
        <Reveal variant="blur-up">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{lead}</p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {boxes.map((box, index) => (
            <Reveal
              key={box.title}
              delay={index * 0.07}
              variant={index % 3 === 0 ? "up" : index % 3 === 1 ? "left" : "right"}
              bounce
            >
              <article className="h-full marketing-box marketing-box-motion rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-semibold tracking-[0.14em] text-[#c88e4a] uppercase">
                  {box.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#444444]">{box.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {showcaseImageSrc && showcaseImageAlt ? (
          <Reveal y={16} className="mt-8">
            <ImageTriptych src={showcaseImageSrc} alt={showcaseImageAlt} />
          </Reveal>
        ) : null}

        <Reveal y={24} variant="zoom" className="mt-8">
          <MediaFieldPair
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            youtubeUrl={youtubeUrl}
            videoTitle={videoTitle}
            reversed={variant === "reversed"}
            imageLayout={imageLayout}
          />
        </Reveal>
      </div>
    </section>
  );
}
