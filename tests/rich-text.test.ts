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
    expect(pdfSafe("ok \u2603 5")).toBe("ok ? 5");
    expect(pdfSafe("Pb \u2264 0.10 and O\u2082")).toBe("Pb <= 0.10 and O2");
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

import { renderTemplateRich } from "@/lib/contracts/template-merge";

describe("template skeleton rendering", () => {
  it("turns heading blocks into headings, fills placeholders and keeps formatting", () => {
    const text = renderTemplateRich(
      [
        { type: "paragraph", content: "**Buyer:** {{buyerName}}", order: 1 },
        { type: "heading", content: "Sales Agreement", order: 0 },
      ],
      { buyerName: "ACME" },
    );
    expect(text).toBe("# Sales Agreement\n**Buyer:** ACME");
    expect(parseRichText(text)[0]).toMatchObject({ kind: "text", style: "h1" });
  });
});

import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { PLACEHOLDERS } from "@/lib/contracts/template-merge";

describe("client SCO skeleton", () => {
  const allText = SCO_SKELETON_BLOCKS.map((b) => b.content).join("\n");

  it("only uses placeholders the system knows", () => {
    const used = [...allText.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(10);
    for (const name of used) expect(PLACEHOLDERS as readonly string[]).toContain(name);
  });

  it("fills every marked part and prints on several pages", async () => {
    const values: Record<string, string> = {};
    for (const name of PLACEHOLDERS) values[name] = "VALUE-" + name;
    const text = renderTemplateRich(SCO_SKELETON_BLOCKS, values);
    expect(text).not.toContain("{{");
    expect(text).toContain("VALUE-buyerName");
    expect(text).toContain("VALUE-trancheValue");
    const pdf = await PDFDocument.create();
    const fonts = await embedRichFonts(pdf);
    renderRichText(pdf, fonts, text, { page: pdf.addPage([595, 842]), y: 800 });
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(3);
    expect(pdf.getPageCount()).toBeLessThanOrEqual(8);
  });

  it("leaves a blank line for fields that were not filled", () => {
    const text = renderTemplateRich(SCO_SKELETON_BLOCKS, {});
    expect(text).toContain("[[BUYER LEGAL COMPANY NAME]]");
    expect(text).toContain("[[6- TO 10-DIGIT HS CODE]]");
  });
});
