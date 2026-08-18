"use client";

type Props = {
  src?: string;
  poster: string;
  className?: string;
  overlayClassName?: string;
};

/** Background video with image poster fallback when file is missing or unsupported. */
export function VideoBackground({
  src = "/videos/shipping.mp4",
  poster,
  className = "absolute inset-0 h-full w-full object-cover",
  overlayClassName = "absolute inset-0 bg-[var(--navy)]/55",
}: Props) {
  return (
    <>
      <video
        className={className}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={overlayClassName} aria-hidden />
    </>
  );
}
