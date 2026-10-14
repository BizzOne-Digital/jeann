/** Parse a YouTube video ID from a bare ID or full watch/embed URL. */
export function parseYoutubeId(input?: string | null): string | null {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "") || null;
    }
    if (url.hostname.includes("youtube")) {
      return url.searchParams.get("v") ?? url.pathname.split("/").pop() ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Start offset in seconds from `t` or `start` query params (e.g. `&t=24s`). */
export function parseYoutubeStartSeconds(input?: string | null): number {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return 0;
  try {
    const url = new URL(trimmed);
    const raw = url.searchParams.get("t") ?? url.searchParams.get("start");
    if (!raw) return 0;
    if (/^\d+$/.test(raw)) return Number(raw);
    const match = raw.match(/^(\d+)s?$/i);
    return match ? Number(match[1]) : 0;
  } catch {
    return 0;
  }
}
