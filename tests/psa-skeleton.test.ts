import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { PSA_SKELETON_BLOCKS } from "@/lib/contracts/psa-skeleton";
import { PLACEHOLDERS, renderTemplateLines, renderTemplateRich } from "@/lib/contracts/template-merge";
import { missingPsaClauses } from "@/lib/contracts/psa-terms";
import { embedRichFonts, renderRichText } from "@/lib/documents/rich-text-pdf";

const allText = PSA_SKELETON_BLOCKS.map((b) => b.content).join("\n");

describe("client PSA skeleton", () => {
  it("only uses placeholders the system knows", () => {
    const used = [...allText.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(20);
    for (const name of used) expect(PLACEHOLDERS as readonly string[]).toContain(name);
  });

  it("has all nine sections of the client's PSA", () => {
    for (const heading of [
      "1. PARTIES TO THE CONTRACT",
      "2. COMMODITY, QUANTITY & COMMERCIAL TERMS",
      "3. PAYMENT TERMS",
      "4. INSPECTION, WEIGHT & QUALITY FINALITY",
      "5. SEPARATE LOGISTICS & INDEPENDENT SHIPPING MANAGEMENT",
      "6. STRICT CONFIDENTIALITY & TEN (10) YEAR SUPPLIER NON-CIRCUMVENTION",
      "7. FORCE MAJEURE",
      "8. GOVERNING LAW & ARBITRATION",
      "9. AUTHORIZED CORPORATE EXECUTION",
    ]) {
      expect(allText).toContain(heading);
    }
  });

  it("states the LC deadline, the amendment rule and the execution rule inside the contract", () => {
    const lines = renderTemplateLines(PSA_SKELETON_BLOCKS, { lcDeadlineHours: "72" });
    // nothing is left for the system to append, because the skeleton already carries all three
    expect(missingPsaClauses(lines)).toEqual([]);
    const text = renderTemplateRich(PSA_SKELETON_BLOCKS, { lcDeadlineHours: "72" });
    expect(text).toContain("within 72 hours");
    expect(text).toContain("an amendment fee set by the bank applies");
  });

  it("follows the product and carries no wording of one product", () => {
    expect(allText).not.toMatch(/\b(sugar|ICUMSA|rice|jasmine|rapeseed|canola)\b/i);
    const text = renderTemplateRich(PSA_SKELETON_BLOCKS, { product: "Crude Palm Oil", hsCode: "1511.10", inspection: "SGS" });
    expect(text).toContain("**Commodity Name:** Crude Palm Oil");
    expect(text).toContain("**Harmonized System (HS) Code:** 1511.10");
    expect(text).toContain("(**SGS**)");
  });

  it("prints red labels until filled and fits on a few pages", async () => {
    const text = renderTemplateRich(PSA_SKELETON_BLOCKS, {});
    expect(text).toContain("[[BUYER ICPO REF. NO.]]");
    const pdf = await PDFDocument.create();
    renderRichText(pdf, await embedRichFonts(pdf), text, { page: pdf.addPage([595, 842]), y: 800 });
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(3);
    expect(pdf.getPageCount()).toBeLessThanOrEqual(6);
  });
});
