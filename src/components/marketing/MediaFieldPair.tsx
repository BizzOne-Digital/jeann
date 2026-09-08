import Image from "next/image";
import { YouTubeEmbed } from "@/components/marketing/YouTubeEmbed";

const MEDIA_ASPECT = "aspect-[4/3]";

type MediaFieldPairProps = {
  imageSrc: string;
  imageAlt: string;
  youtubeUrl?: string;
  videoTitle?: string;
  reversed?: boolean;
};

export function MediaFieldPair({
  imageSrc,
  imageAlt,
  youtubeUrl,
  videoTitle,
  reversed = false,
}: MediaFieldPairProps) {
  if (!youtubeUrl) {
    return (
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888888] uppercase">
          In the field
        </p>
        <div className={`relative ${MEDIA_ASPECT} overflow-hidden rounded-lg bg-[#e4e0d8]`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 lg:grid-cols-2 lg:gap-8 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888888] uppercase">
          In the field
        </p>
        <div className={`relative ${MEDIA_ASPECT} overflow-hidden rounded-lg bg-[#e4e0d8]`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#888888] uppercase">
          Video overview
        </p>
        <YouTubeEmbed
          youtubeInput={youtubeUrl}
          title={videoTitle ?? "Finekarts overview video"}
          frameClassName={MEDIA_ASPECT}
        />
      </div>
    </div>
  );
}
