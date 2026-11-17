import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { ICPO_SKELETON_BLOCKS } from "@/lib/contracts/icpo-skeleton";
import { PLACEHOLDERS, renderTemplateRich } from "@/lib/contracts/template-merge";
import { embedRichFonts, renderRichText } from "@/lib/documents/rich-text-pdf";
import { requiredDocumentsBlock, specificationToBlock } from "@/lib/products/document-fields";

const allText = ICPO_SKELETON_BLOCKS.map((b) => b.content).join("\n");

describe("client ICPO skeleton", () => {
  it("only uses placeholders the system knows", () => {
    const used = [...allText.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(20);
    for (const name of used) expect(PLACEHOLDERS as readonly string[]).toContain(name);
  });

  it("carries no wording that belongs to one product", () => {
    expect(allText).not.toMatch(/(sugar|ICUMSA|rice|jasmine|polarization|rapeseed|canola)/i);
  });

  it("follows the product: its specification and documents are printed", () => {
    const text = renderTemplateRich(ICPO_SKELETON_BLOCKS, {
      buyerName: "FINEKARTS INC.",
      sellerName: "ACME FOODS",
      productLine: "Long Grain Jasmine Rice, 3% max broken",
      specificationBlock: specificationToBlock("Crop Year: 2025\nGenetic Type: Non-GMO"),
      requiredDocuments: requiredDocumentsBlock(["Certificate of Analysis (COA): laboratory analysis"], "CIF"),
      incoterm: "CIF",
    });
    expect(text).toContain("OF Long Grain Jasmine Rice, 3% max broken");
    expect(text).toContain("**Crop Year:** 2025");
    expect(text).toContain("1. **Certificate of Analysis (COA):** laboratory analysis");
    expect(text).toContain("Marine Cargo Insurance");
  });

  it("prints on several pages and leaves blanks for unfilled fields", async () => {
    const text = renderTemplateRich(ICPO_SKELETON_BLOCKS, {});
    expect(text).toContain("________");
    const pdf = await PDFDocument.create();
    renderRichText(pdf, await embedRichFonts(pdf), text, { page: pdf.addPage([595, 842]), y: 800 });
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(3);
  });
});
