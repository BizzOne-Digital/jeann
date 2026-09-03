"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { parseYoutubeId } from "@/lib/content/youtube";

export function HeroVideoBackground({
  youtubeInput,
  posterSrc,
  posterAlt,
}: {
  youtubeInput?: string;
  posterSrc: string;
  posterAlt: string;
}) {
  const videoId = parseYoutubeId(youtubeInput);
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId || active) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [videoId, active]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-700 ${
          active && videoId ? "opacity-0" : "opacity-100"
        }`}
      />
      {videoId && active ? (
        <div className="hero-video-frame absolute inset-0 overflow-hidden">
          <iframe
            title="Refinery and commodity logistics background video"
            className="hero-video-iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&disablekb=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : null}
    </div>
  );
}
