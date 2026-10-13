/** Remove decorative list prefixes (e.g. "3. ", "01 - ") from headings — not section content. */
export function stripLeadingMarker(text: string): string {
  return text.replace(/^\d+\s*[-–—.]\s*/i, "").trim();
}
