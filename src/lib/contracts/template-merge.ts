/** Pure placeholder merge for document templates. Missing values render as a blank line marker. */

export const PLACEHOLDERS = [
  "buyerName",
  "sellerName",
  "product",
  "quantity",
  "unitPrice",
  "totalValue",
  "incoterm",
  "loadingPort",
  "destinationPort",
  "paymentTerms",
  "shipmentSchedule",
  "packaging",
  "inspection",
  "transactionNumber",
  "date",
] as const;

export type TemplateBlock = { type?: string; content: string; order?: number };

/** Prefill uses `buyer`/`seller`; templates use `buyerName`/`sellerName`. */
export function placeholderValues(
  data: Record<string, unknown>,
  extra: { transactionNumber?: string; date?: string } = {},
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || v === undefined || v === null || v === "") continue;
    out[k] = String(v);
  }
  if (out.buyer && !out.buyerName) out.buyerName = out.buyer;
  if (out.seller && !out.sellerName) out.sellerName = out.seller;
  if (extra.transactionNumber) out.transactionNumber = extra.transactionNumber;
  out.date = extra.date ?? new Date().toISOString().slice(0, 10);
  return out;
}

export function mergePlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_m, key: string) => values[key] ?? "________");
}

/** Renders blocks (sorted by order) to flat text lines for PDF output. */
export function renderTemplateLines(blocks: TemplateBlock[], values: Record<string, string>): string[] {
  const sorted = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const lines: string[] = [];
  for (const b of sorted) {
    const merged = mergePlaceholders(b.content, values);
    if (b.type === "heading") lines.push(merged.toUpperCase());
    else lines.push(...merged.split(/\r?\n/));
    lines.push("");
  }
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** Wraps text to a max character width on word boundaries. */
export function wrapLine(line: string, width = 88): string[] {
  if (line.length <= width) return [line];
  const out: string[] = [];
  let cur = "";
  for (const word of line.split(/\s+/)) {
    if (word.length > width) {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      for (let i = 0; i < word.length; i += width) out.push(word.slice(i, i + width));
      continue;
    }
    if ((cur + " " + word).trim().length > width) {
      out.push(cur);
      cur = word;
    } else cur = (cur + " " + word).trim();
  }
  if (cur) out.push(cur);
  return out;
}
