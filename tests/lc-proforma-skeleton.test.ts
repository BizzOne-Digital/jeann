import { describe, expect, it } from "vitest";
import { LC_WORDING_SKELETON_BLOCKS } from "@/lib/contracts/lc-wording-skeleton";
import { PROFORMA_SKELETON_BLOCKS } from "@/lib/contracts/proforma-skeleton";
import { PSA_SKELETON_BLOCKS } from "@/lib/contracts/psa-skeleton";
import { PLACEHOLDERS, renderTemplateRich } from "@/lib/contracts/template-merge";
import { lcDocumentsBlock } from "@/lib/products/document-fields";

const text = (blocks: { content: string }[]) => blocks.map((b) => b.content).join("\n");

describe("client LC wording skeleton", () => {
  it("only uses placeholders the system knows", () => {
    const used = [...text(LC_WORDING_SKELETON_BLOCKS).matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(15);
    for (const name of used) expect(PLACEHOLDERS as readonly string[]).toContain(name);
  });

  it("has the SWIFT MT700 fields and carries no wording of one product", () => {
    const all = text(LC_WORDING_SKELETON_BLOCKS);
    for (const tag of [":27:", ":40A:", ":20:", ":31C:", ":31D:", ":50:", ":59:", ":32B:", ":39A:", ":41A:", ":44E:", ":44F:", ":44C:", ":45A:", ":46A:", ":47A:", ":71B:", ":48:", ":49:"]) {
      expect(all).toContain("**" + tag + "**");
    }
    expect(all).not.toMatch(/\b(sugar|ICUMSA|rice|rapeseed|canola)\b/i);
  });

  it("the documents required in 46A are the product's, in capital letters", () => {
    const rendered = renderTemplateRich(LC_WORDING_SKELETON_BLOCKS, {
      lcDocuments: lcDocumentsBlock(["Certificate of Analysis (COA): laboratory analysis"], "CIF"),
      incoterm: "CIF",
    });
    expect(rendered).toContain("1. CERTIFICATE OF ANALYSIS (COA): LABORATORY ANALYSIS");
    expect(rendered).toContain("MARINE CARGO INSURANCE");
  });
});

describe("client Proforma Invoice skeleton", () => {
  it("only uses placeholders the system knows", () => {
    const used = [...text(PROFORMA_SKELETON_BLOCKS).matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(20);
    for (const name of used) expect(PLACEHOLDERS as readonly string[]).toContain(name);
  });

  it("prints the totals with the amount in words, and signature with the seal", () => {
    const rendered = renderTemplateRich(PROFORMA_SKELETON_BLOCKS, {
      totalValue: "USD 71,200,000.00",
      amountInWords: "SEVENTY-ONE MILLION TWO HUNDRED THOUSAND US DOLLARS",
    });
    expect(rendered).toContain("**Total Invoice Value:** USD 71,200,000.00 (SEVENTY-ONE MILLION TWO HUNDRED THOUSAND US DOLLARS)");
    expect(rendered).toContain("[signature]");
  });
});

describe("PSA specification", () => {
  it("has Schedule A, filled from the product or imported from the ICPO", () => {
    const rendered = renderTemplateRich(PSA_SKELETON_BLOCKS, { specificationBlock: "**Moisture:** Max 14%" });
    expect(rendered).toContain("## SCHEDULE A: COMMODITY TECHNICAL SPECIFICATIONS");
    expect(rendered).toContain("**Moisture:** Max 14%");
  });
});
