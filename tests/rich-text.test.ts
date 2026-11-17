import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { parseInline, parseRichText, richTextToHtml, pdfSafe } from "@/lib/documents/rich-text";
import { embedRichFonts, renderRichText } from "@/lib/documents/rich-text-pdf";
import { missingPsaClauses, normalizeLcDeadlineHours } from "@/lib/contracts/psa-terms";

describe("rich text parsing", () => {
  it("reads bold, italic and underline", () => {
    const runs = parseInline("a **b** *c* __d__");
    expect(runs.find((r) => r.text === "b")?.bold).toBe(true);
    expect(runs.find((r) => r.text === "c")?.italic).toBe(true);
    expect(runs.find((r) => r.text === "d")?.underline).toBe(true);
    expect(runs.find((r) => r.text === "a ")?.bold).toBe(false);
  });

  it("reads headings, bullets, alignment, rules and page breaks", () => {
    const blocks = parseRichText("# Title\n[center] Middle\n- item\n---\n[pagebreak]\nplain");
    expect(blocks.map((b) => (b.kind === "text" ? b.style + ":" + b.align : b.kind))).toEqual([
      "h1:left",
      "p:center",
      "bullet:left",
      "rule",
      "pagebreak",
      "p:left",
    ]);
  });

  it("escapes HTML in the preview", () => {
    expect(richTextToHtml("<script>alert(1)</script>")).not.toContain("<script>");
  });

  it("replaces characters the PDF font cannot draw", () => {
    expect(pdfSafe("ok \u2265 5")).toBe("ok ? 5");
  });
});

describe("rich text in a PDF", () => {
  it("draws formatted text and continues on new pages", async () => {
    const pdf = await PDFDocument.create();
    const fonts = await embedRichFonts(pdf);
    const page = pdf.addPage([595, 842]);
    const long = Array.from({ length: 120 }, (_, i) => "Line " + i + " **bold** and *italic* text that is long enough to wrap " + "word ".repeat(15)).join("\n");
    const out = renderRichText(pdf, fonts, "# Heading\n[center] Centered\n- bullet\n[pagebreak]\n" + long, { page, y: 800 });
    expect(pdf.getPageCount()).toBeGreaterThan(2);
    expect(out.y).toBeLessThanOrEqual(800);
    expect((await pdf.save()).length).toBeGreaterThan(1000);
  });
});

describe("PSA LC deadline", () => {
  it("accepts any admin deadline from 1 to 720 hours and falls back to 24", () => {
    expect(normalizeLcDeadlineHours(48)).toBe(48);
    expect(normalizeLcDeadlineHours(1)).toBe(1);
    expect(normalizeLcDeadlineHours(0)).toBe(24);
    expect(normalizeLcDeadlineHours(5000)).toBe(24);
    expect(normalizeLcDeadlineHours("abc")).toBe(24);
  });

  it("writes the chosen deadline into the PSA clause", () => {
    expect(missingPsaClauses([], 72).join("\n")).toContain("within 72 hours");
  });
});
