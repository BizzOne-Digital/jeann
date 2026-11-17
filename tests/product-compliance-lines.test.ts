import { describe, expect, it } from "vitest";
import { DEFAULT_INSPECTION, productLine, requiredDocumentsBlock, specificationToBlock } from "@/lib/products/document-fields";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { renderTemplateRich } from "@/lib/contracts/template-merge";

describe("product-driven document lines", () => {
  it("turns the product specification into bold-label lines", () => {
    expect(specificationToBlock("Acid Value: Maximum 0.20 mg KOH/g\nPacked in flexitanks")).toBe(
      "**Acid Value:** Maximum 0.20 mg KOH/g\nPacked in flexitanks",
    );
  });

  it("uses the product's own required documents and numbers them", () => {
    const text = requiredDocumentsBlock(["Certificate of Analysis (COA)", "Phytosanitary Certificate"], "FOB");
    expect(text).toBe("1. **Certificate of Analysis (COA)**\n2. **Phytosanitary Certificate**");
  });

  it("always adds the insurance document to a CIF order, never to FOB", () => {
    expect(requiredDocumentsBlock(["Certificate of Analysis (COA)"], "CIF")).toContain("Marine Cargo Insurance");
    expect(requiredDocumentsBlock(["Certificate of Analysis (COA)"], "FOB")).not.toContain("Marine Cargo Insurance");
    expect(requiredDocumentsBlock([], "FOB")).toContain("Bills of Lading");
  });

  it("does not add the insurance document twice", () => {
    const text = requiredDocumentsBlock(["Insurance Certificate (110%)"], "CIF");
    expect(text.match(/nsurance/g)?.length).toBe(1);
  });

  it("joins the product name and grade for the commodity line", () => {
    expect(productLine("Refined Rapeseed Oil", "Food Grade")).toBe("Refined Rapeseed Oil, Food Grade");
    expect(productLine("Crude Palm Oil", undefined)).toBe("Crude Palm Oil");
  });
});

describe("SCO changes with the product", () => {
  const base = { transactionNumber: "RSO-CIF-000001-26", buyerName: "ACME", incoterm: "CIF", destinationPort: "Shanghai" };

  it("prints the specification, packaging, inspection and documents of the chosen product", () => {
    const text = renderTemplateRich(SCO_SKELETON_BLOCKS, {
      ...base,
      productLine: "Crude Palm Oil, RBD",
      specificationBlock: specificationToBlock("Free Fatty Acid: Maximum 5%"),
      packaging: "ISO tank",
      inspection: DEFAULT_INSPECTION,
      requiredDocuments: requiredDocumentsBlock(["Certificate of Analysis (COA)"], "CIF"),
    });
    expect(text).toContain("Crude Palm Oil, RBD");
    expect(text).toContain("**Free Fatty Acid:** Maximum 5%");
    expect(text).toContain("**Packaging:** ISO tank");
    expect(text).toContain("inspected at the Port of Loading by");
    expect(text).toContain("1. **Certificate of Analysis (COA)**");
  });

  it("no longer carries any rapeseed oil wording of its own", () => {
    const all = SCO_SKELETON_BLOCKS.map((b) => b.content).join("\n");
    expect(all).not.toMatch(/rapeseed|canola|flexitank|Lovibond|Phytosanitary|human consumption/i);
  });
});

describe("master SCO template", () => {
  it("prints the HS code, grade and Schedule A of the chosen product", () => {
    const text = renderTemplateRich(SCO_SKELETON_BLOCKS, {
      product: "Refined White Cane Sugar ICUMSA 45",
      productGrade: "Polarization 99.8 Z min",
      hsCode: "1701.99",
      specificationBlock: specificationToBlock("Polarization: Min 99.8 Z | ICUMSA GS1-7"),
    });
    expect(text).toContain("**Harmonized System (HS) Code:** 1701.99");
    expect(text).toContain("**Grade / Quality Standard:** Polarization 99.8 Z min");
    expect(text).toContain("## SCHEDULE A: COMMODITY TECHNICAL SPECIFICATIONS");
    expect(text).toContain("**Polarization:** Min 99.8 Z (Test method: ICUMSA GS1-7)");
  });

  it("starts Schedule A on its own page", () => {
    expect(SCO_SKELETON_BLOCKS.some((b) => b.content.trim() === "[pagebreak]")).toBe(true);
  });
});
