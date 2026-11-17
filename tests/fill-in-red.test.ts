import { describe, expect, it } from "vitest";
import { inflateSync } from "node:zlib";
import { PDFDocument } from "pdf-lib";
import { parseInline, parseRichText, richTextToHtml } from "@/lib/documents/rich-text";
import { embedRichFonts, renderRichText } from "@/lib/documents/rich-text-pdf";
import { mergePlaceholdersRed, renderTemplateRich } from "@/lib/contracts/template-merge";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";

describe("text still to be filled in prints red, filled text prints black", () => {
  it("marks [[LABEL]] as a red run with brackets", () => {
    const runs = parseInline("Company: [[BUYER LEGAL COMPANY NAME]] and **[[X]]**");
    const red = runs.filter((r) => r.red);
    expect(red.map((r) => r.text)).toEqual(["[BUYER LEGAL COMPANY NAME]", "[X]"]);
    expect(runs.find((r) => r.text === "Company: ")?.red).toBeUndefined();
    expect(red[1].bold).toBe(true);
  });

  it("an unfilled field becomes a red label and a filled field is plain text", () => {
    expect(mergePlaceholdersRed("Buyer: {{buyerName}}", {})).toBe("Buyer: [[BUYER LEGAL COMPANY NAME]]");
    expect(mergePlaceholdersRed("Buyer: {{buyerName}}", { buyerName: "ACME" })).toBe("Buyer: ACME");
  });

  it("the SCO has red labels until every field is filled", () => {
    const empty = renderTemplateRich(SCO_SKELETON_BLOCKS, {});
    expect((empty.match(/\[\[/g) ?? []).length).toBeGreaterThan(20);
    const values: Record<string, string> = {};
    for (const m of SCO_SKELETON_BLOCKS.map((b) => b.content).join("\n").matchAll(/\{\{\s*(\w+)\s*\}\}/g)) values[m[1]] = "V";
    expect(renderTemplateRich(SCO_SKELETON_BLOCKS, values)).not.toContain("[[");
  });

  it("the red text changes the printed PDF", async () => {
    async function bytes(source: string) {
      const pdf = await PDFDocument.create();
      renderRichText(pdf, await embedRichFonts(pdf), source, { page: pdf.addPage([595, 842]), y: 800 });
      // Page content is compressed, so the streams are inflated before looking at the colour operators.
      const raw = Buffer.from(await pdf.save({ useObjectStreams: false }));
      const text = raw.toString("latin1");
      let out = text;
      for (const m of text.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
        try {
          out += "\n" + inflateSync(Buffer.from(m[1], "latin1")).toString("latin1");
        } catch {
          // not a compressed stream
        }
      }
      return out;
    }
    const filled = await bytes("Buyer: ACME");
    const unfilled = await bytes("Buyer: [[ACME]]");
    // red uses the colour operator "0.78 0 0 rg"; filled text never does
    expect(unfilled).toContain("0.78 0 0 rg");
    expect(filled).not.toContain("0.78 0 0 rg");
  });

  it("the editor preview shows placeholders and labels in red", () => {
    expect(richTextToHtml("Buyer: {{buyerName}}")).toContain("color:#c00000");
    expect(richTextToHtml("Buyer: [[X]]")).toContain("color:#c00000");
    expect(parseRichText("[[X]]")[0]).toMatchObject({ kind: "text" });
  });
});
