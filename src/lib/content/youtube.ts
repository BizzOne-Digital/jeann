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
