/**
 * Default homepage overview video (YouTube) — shown in the section below the hero.
 * Override via CMS (Home → Hero → youtubeVideoId) or NEXT_PUBLIC_HERO_YOUTUBE_VIDEO_ID on Vercel.
 */
export const DEFAULT_HERO_YOUTUBE_VIDEO_ID = "gADVpRPdr7E";

export function resolveHeroYoutubeInput(cmsValue?: string): string {
  const fromCms = (cmsValue ?? "").trim();
  if (fromCms) return fromCms;
  const fromEnv = (process.env.NEXT_PUBLIC_HERO_YOUTUBE_VIDEO_ID ?? "").trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_HERO_YOUTUBE_VIDEO_ID;
}
