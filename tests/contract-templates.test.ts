import { describe, expect, it } from "vitest";
import { mergePlaceholders, placeholderValues, renderTemplateLines, wrapLine } from "@/lib/contracts/template-merge";
import { contractFlow, templateKeyFor, templateSlugForDocumentType } from "@/lib/contracts/contract-flow";
import { defaultTemplates } from "@/lib/contracts/default-templates";

describe("template merge", () => {
  it("merges known placeholders and blanks unknown ones", () => {
    expect(mergePlaceholders("{{a}} / {{ b }} / {{c}}", { a: "1", b: "2" })).toBe("1 / 2 / ________");
  });
  it("maps buyer/seller prefill to buyerName/sellerName", () => {
    const v = placeholderValues({ buyer: "B", seller: "S", _x: "no" }, { transactionNumber: "TX-1", date: "2026-01-01" });
    expect(v).toMatchObject({ buyerName: "B", sellerName: "S", transactionNumber: "TX-1", date: "2026-01-01" });
    expect(v._x).toBeUndefined();
  });
  it("renders blocks in order and uppercases headings", () => {
    const lines = renderTemplateLines(
      [
        { type: "paragraph", content: "Hi {{buyerName}}", order: 1 },
        { type: "heading", content: "Offer", order: 0 },
      ],
      { buyerName: "Acme" },
    );
    expect(lines).toEqual(["OFFER", "", "Hi Acme"]);
  });
  it("wraps long lines", () => {
    const out = wrapLine("word ".repeat(60).trim(), 40);
    expect(out.every((l) => l.length <= 40)).toBe(true);
  });
});

describe("contract flow and defaults", () => {
  it("has 6 steps per side", () => {
    expect(contractFlow("buyer")).toHaveLength(6);
    expect(contractFlow("supplier")).toHaveLength(6);
  });
  it("maps document types to template slugs", () => {
    expect(templateSlugForDocumentType("proposed_lc_wording")).toBe("lc_wording");
    expect(templateSlugForDocumentType("passport_copy")).toBeUndefined();
  });
  it("default templates have valid unique keys and cover every flow template", () => {
    const keys = defaultTemplates().map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k).toMatch(/^[a-z0-9_]{2,64}$/);
    for (const side of ["buyer", "supplier"] as const)
      for (const s of contractFlow(side))
        for (const d of s.documents) if (d.slug) expect(keys).toContain(templateKeyFor(d.slug, side));
  });
});
