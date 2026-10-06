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
  const bg = background === "cream" ? "bg-[var(--mist)]" : "bg-white";

  return (
    <section className={`${bg} marketing-section`}>
      <div className="container-page">
        <Reveal variant="up">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#555555]">{lead}</p>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {boxes.map((box) => (
            <article key={box.title} className="marketing-box rounded-lg p-5">
              <h3 className="text-sm font-semibold tracking-[0.12em] text-[#c88e4a] uppercase">{box.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#444444]">{box.body}</p>
            </article>
          ))}
        </div>

        {showcaseImageSrc && showcaseImageAlt ? (
          <div className="mt-6">
            <ImageTriptych src={showcaseImageSrc} alt={showcaseImageAlt} />
          </div>
        ) : null}

        <div className="mt-6">
          <MediaFieldPair
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            youtubeUrl={youtubeUrl}
            videoTitle={videoTitle}
            reversed={variant === "reversed"}
            imageLayout={imageLayout}
          />
        </div>
      </div>
    </section>
  );
}
