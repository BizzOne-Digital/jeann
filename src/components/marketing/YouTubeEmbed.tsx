import { parseYoutubeId } from "@/lib/content/youtube";

function buildEmbedSrc(videoId: string, autoplay: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    cc_load_policy: "0",
    iv_load_policy: "3",
    playsinline: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function YouTubeEmbed({
  youtubeInput,
  title = "Video overview",
  className = "",
  autoplay = false,
}: {
  youtubeInput?: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
}) {
  const videoId = parseYoutubeId(youtubeInput);
  if (!videoId) return null;

  return (
    <div className={className}>
      <div className="youtube-embed-frame relative aspect-video w-full overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#071525] shadow-sm">
        <iframe
          title={title}
          className="youtube-embed-iframe"
          src={buildEmbedSrc(videoId, autoplay)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading={autoplay ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}
