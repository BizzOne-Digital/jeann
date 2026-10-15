/** Remove decorative list prefixes (e.g. "3. ", "01 - ", "IV. ") from headings — not section body copy. */
export function stripLeadingMarker(text: string): string {
  return text
    .replace(/^[IVXLC]+\s*[-–—.)]\s*/i, "")
    .replace(/^\d+\s*[-–—.)\]]\s*/i, "")
    .trim();
}
