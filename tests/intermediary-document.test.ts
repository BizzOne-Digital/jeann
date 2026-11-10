import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contracts/template-service", () => ({ findPublishedTemplate: vi.fn(async () => null) }));

import { createIntermediaryDocument } from "@/lib/portal/intermediary-document";

describe("agent / broker created documents", () => {
  it("creates an ICPO PDF from the default template without any uploaded file", async () => {
    const out = await createIntermediaryDocument({
      documentType: "icpo",
      buyerCompanyName: "Buyer Trading Co",
      productName: "Sugar ICUMSA 45",
      quantity: "25,000 MT",
      reference: "BRD-TEST0001",
    });
    expect(out.filename).toBe("ICPO-Buyer-Trading-Co.pdf");
    expect(Buffer.from(out.bytes.slice(0, 5)).toString()).toBe("%PDF-");
    expect(out.bytes.length).toBeGreaterThan(800);
  });

  it("creates a LOI PDF too", async () => {
    const out = await createIntermediaryDocument({
      documentType: "loi",
      buyerCompanyName: "Buyer Co",
      productName: "Rice",
      reference: "AGD-TEST0002",
    });
    expect(out.filename.startsWith("LOI-")).toBe(true);
  });
});
