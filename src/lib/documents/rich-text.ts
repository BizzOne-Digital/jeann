/**
 * Small formatting language for generated documents. The editor toolbar writes it, the PDF renderer
 * and the on-screen preview both read it, so what staff see is what is printed.
 *
 *   # Heading 1        ## Heading 2
 *   - bullet           1. numbered line (kept as typed)
 *   **bold**  *italic*  __underline__
 *   [center] text      [right] text      [left] text
 *   [[LABEL]]          text still to be filled in (prints red as [LABEL])
 *   ---                horizontal line
 *   [pagebreak]        starts a new page
 *   [signature]        the preloaded Finekarts signature (a blank line when there is none)
 */

export type Align = "left" | "center" | "right";
/** red = text that still has to be filled in. It prints red until it is filled, and black after. */
export type Run = { text: string; bold: boolean; italic: boolean; underline: boolean; red?: boolean };
export type RichBlock =
  | { kind: "text"; style: "h1" | "h2" | "p" | "bullet"; align: Align; runs: Run[] }
  | { kind: "rule" }
  | { kind: "pagebreak" }
  | { kind: "signature" };

/** Characters that the standard PDF fonts can draw; everything else becomes "?". */
export function pdfSafe(text: string): string {
  // Common characters the standard PDF fonts cannot draw are written in a plain equivalent.
  const mapped = text
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/→/g, "->")
    .replace(/−/g, "-")
    .replace(/ /g, " ");
  return mapped.replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•€]/g, "?");
}

export function parseInline(text: string): Run[] {
  const runs: Run[] = [];
  let bold = false;
  let italic = false;
  let underline = false;
  let buf = "";
  const flush = () => {
    if (buf) runs.push({ text: buf, bold, italic, underline });
    buf = "";
  };
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith("[[", i)) {
      const end = text.indexOf("]]", i + 2);
      if (end > i) {
        flush();
        runs.push({ text: "[" + text.slice(i + 2, end) + "]", bold, italic, underline, red: true });
        i = end + 1;
        continue;
      }
    }
    if (text.startsWith("**", i)) {
      flush();
      bold = !bold;
      i += 1;
    } else if (text.startsWith("__", i)) {
      flush();
      underline = !underline;
      i += 1;
    } else if (text[i] === "*") {
      flush();
      italic = !italic;
    } else {
      buf += text[i];
    }
  }
  flush();
  return runs;
}

export function parseRichText(source: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  for (const raw of source.replace(/\r\n/g, "\n").split("\n")) {
    let line = raw;
    if (!line.trim()) continue;
    const trimmed = line.trim();
    if (trimmed === "---") {
      blocks.push({ kind: "rule" });
      continue;
    }
    if (trimmed.toLowerCase() === "[pagebreak]") {
      blocks.push({ kind: "pagebreak" });
      continue;
    }
    if (trimmed.toLowerCase() === "[signature]") {
      blocks.push({ kind: "signature" });
      continue;
    }
    let align: Align = "left";
    const alignMatch = /^\[(left|center|right)\]\s*/i.exec(line);
    if (alignMatch) {
      align = alignMatch[1].toLowerCase() as Align;
      line = line.slice(alignMatch[0].length);
    }
    let style: "h1" | "h2" | "p" | "bullet" = "p";
    if (line.startsWith("## ")) {
      style = "h2";
      line = line.slice(3);
    } else if (line.startsWith("# ")) {
      style = "h1";
      line = line.slice(2);
    } else if (line.startsWith("- ")) {
      style = "bullet";
      line = line.slice(2);
    }
    blocks.push({ kind: "text", style, align, runs: parseInline(line) });
  }
  return blocks;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** HTML for the editor preview. All text is escaped, so it is safe to render. */
export function richTextToHtml(source: string): string {
  return parseRichText(source)
    .map((b) => {
      if (b.kind === "rule") return "<hr />";
      if (b.kind === "signature") return '<div style="margin:8px 0;padding:10px;border:1px dashed #999;font-size:12px;color:#777">Finekarts signature prints here on the final document</div>';
      if (b.kind === "pagebreak") return '<div style="border-top:2px dashed #999;margin:12px 0;font-size:11px;color:#777">Page break</div>';
      const inner = b.runs
        .map((r) => {
          let h = escapeHtml(r.text);
          if (r.red) h = '<span style="color:#c00000">' + h + "</span>";
          if (r.bold) h = "<strong>" + h + "</strong>";
          if (r.italic) h = "<em>" + h + "</em>";
          if (r.underline) h = "<u>" + h + "</u>";
          // Placeholders typed in a skeleton show in red in the editor preview.
          return h.replace(/\{\{\s*(\w+)\s*\}\}/g, '<span style="color:#c00000">{{$1}}</span>');
        })
        .join("");
      const size = b.style === "h1" ? "18px" : b.style === "h2" ? "15px" : "13px";
      const weight = b.style === "h1" || b.style === "h2" ? "700" : "400";
      const prefix = b.style === "bullet" ? "&bull; " : "";
      return '<p style="margin:4px 0;text-align:' + b.align + ";font-size:" + size + ";font-weight:" + weight + '">' + prefix + inner + "</p>";
    })
    .join("");
}
