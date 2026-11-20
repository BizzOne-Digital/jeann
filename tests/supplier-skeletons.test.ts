import { describe, expect, it } from "vitest";
import {
  SUPPLIER_ICPO_SKELETON_BLOCKS,
  SUPPLIER_LC_WORDING_SKELETON_BLOCKS,
  SUPPLIER_PROFORMA_SKELETON_BLOCKS,
  SUPPLIER_PSA_SKELETON_BLOCKS,
  SUPPLIER_SCO_SKELETON_BLOCKS,
} from "@/lib/contracts/supplier-skeletons";
import { defaultTemplates } from "@/lib/contracts/default-templates";
import { PLACEHOLDERS, PLACEHOLDER_LABELS, renderTemplateRich } from "@/lib/contracts/template-merge";
import { lcDocumentsBlock, requiredDocumentsBlock } from "@/lib/products/document-fields";

const text = (blocks: { content: string }[]) => blocks.map((b) => b.content).join("\n");
const ALL = {
  sco: SUPPLIER_SCO_SKELETON_BLOCKS,
  icpo: SUPPLIER_ICPO_SKELETON_BLOCKS,
  psa: SUPPLIER_PSA_SKELETON_BLOCKS,
  lc: SUPPLIER_LC_WORDING_SKELETON_BLOCKS,
  pi: SUPPLIER_PROFORMA_SKELETON_BLOCKS,
};

describe("supplier portal skeletons", () => {
  for (const [name, blocks] of Object.entries(ALL)) {
    it(name + " only uses placeholders the system knows, each with a label", () => {
      const used = [...text(blocks).matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]);
      expect(used.length).toBeGreaterThan(10);
      for (const u of used) {
        expect(PLACEHOLDERS as readonly string[]).toContain(u);
        expect(PLACEHOLDER_LABELS[u]).toBeTruthy();
      }
    });
  }

  it("corrects the errors found in the client's PDFs", () => {
    expect(text(ALL.psa)).toContain("# SALES AND PURCHASE AGREEMENT (PSA)");
    expect(text(ALL.psa)).not.toContain("(BUYER)");
    expect(text(ALL.lc)).toContain("MORE OR LESS");
    expect(text(ALL.lc)).not.toContain("MOLOT");
    // The Proforma Invoice follows the signed SPA, it is not issued together with it.
    expect(text(ALL.sco)).not.toMatch(/SPA\) and Proforma Invoice/);
    expect(text(ALL.sco)).toContain("The Proforma Invoice is issued after the SPA has been signed by both parties.");
    // Instruction notes do not print in the final documents.
    for (const blocks of Object.values(ALL)) expect(text(blocks)).not.toMatch(/Red Fields|TO FILL IN RED|To Be Completed by Supplier|TO BE COMPLETED BY SUPPLIER/i);
  });

  it("the supplier documents do not hard-code one product or human consumption", () => {
    for (const blocks of Object.values(ALL)) {
      expect(text(blocks)).not.toMatch(/human consumption/i);
      expect(text(blocks)).not.toMatch(/\b(sugar|rice|rapeseed|ICUMSA)\b/i);
    }
  });

  it("the LC wording has the SWIFT MT700 fields, and the goods follow the product", () => {
    const all = text(ALL.lc);
    for (const tag of [":27:", ":40A:", ":20:", ":31C:", ":31D:", ":50:", ":59:", ":32B:", ":39A:", ":41A:", ":43P:", ":43T:", ":44E:", ":44F:", ":44C:", ":45A:", ":46A:", ":47A:", ":71B:", ":48:", ":49:"]) {
      expect(all).toContain("**" + tag + "**");
    }
    const rendered = renderTemplateRich(ALL.lc, { productLineUpper: "REFINED RAPESEED OIL", hsCode: "1514.19", quantity: "500 MT" });
    expect(rendered).toContain("DESCRIPTION OF GOODS AND/OR SERVICES: REFINED RAPESEED OIL. HS CODE: 1514.19.");
  });

  it("the documents the supplier must present are worded for the supplier as the seller", () => {
    const supplier = requiredDocumentsBlock([], "CIF", "supplier");
    expect(supplier).toContain("Issued by the Supplier");
    expect(supplier).not.toContain("First Beneficiary");
    expect(supplier).not.toMatch(/human consumption/i);
    expect(supplier).toContain("Marine Cargo Insurance");
    expect(lcDocumentsBlock([], "FOB", "supplier")).toContain("ISSUED BY THE SUPPLIER");
    // A product's own list still wins.
    expect(requiredDocumentsBlock(["Certificate of Analysis (COA): lab"], "FOB", "supplier")).toContain("1. **Certificate of Analysis (COA):**");
  });

  it("Finekarts signs the ICPO and the PSA as the buyer, and nothing is added to the client's wording", () => {
    expect(text(ALL.icpo)).toContain("{{buyerSignature}}");
    expect(text(ALL.psa)).toContain("{{buyerSignature}}");
    expect(text(ALL.psa)).not.toContain("SCHEDULE A");
    expect(text(ALL.icpo)).not.toContain("Technical Specification");
  });

  it("the supplier portal uses these skeletons by default, the buyer portal keeps its own", () => {
    const templates = defaultTemplates();
    const sup = templates.find((t) => t.key === "spa_supplier");
    const buy = templates.find((t) => t.key === "spa_buyer");
    expect(sup?.bodyBlocks).toBe(SUPPLIER_PSA_SKELETON_BLOCKS);
    expect(buy?.bodyBlocks).not.toBe(SUPPLIER_PSA_SKELETON_BLOCKS);
    expect(templates.find((t) => t.key === "sco_supplier")?.bodyBlocks).toBe(SUPPLIER_SCO_SKELETON_BLOCKS);
    expect(templates.find((t) => t.key === "proforma_invoice_supplier")?.bodyBlocks).toBe(SUPPLIER_PROFORMA_SKELETON_BLOCKS);
  });

  it("unfilled supplier fields print red and filled ones do not", () => {
    const empty = renderTemplateRich(ALL.pi, {});
    expect(empty).toContain("[[SUPPLIER COMPANY NAME]]");
    const filled = renderTemplateRich(ALL.pi, { sellerName: "Example Foods Ltd" });
    expect(filled).toContain("Example Foods Ltd");
    expect(filled).not.toContain("[[SUPPLIER COMPANY NAME]]");
  });
});
