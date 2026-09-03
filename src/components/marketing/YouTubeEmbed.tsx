import { parseYoutubeId } from "@/lib/content/youtube";

export function YouTubeEmbed({
  youtubeInput,
  title = "Video overview",
  className = "",
}: {
  youtubeInput?: string;
  title?: string;
  className?: string;
}) {
  const videoId = parseYoutubeId(youtubeInput);
  if (!videoId) return null;

  return (
    <div className={className}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#071525] shadow-sm">
        <iframe
          title={title}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&cc_load_policy=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
