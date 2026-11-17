import { describe, expect, it } from "vitest";
import {
  PRODUCT_ORDER_NUMBER,
  formatProductOrderNumber,
  parseProductOrderNumber,
  withIncoterm,
} from "@/lib/transactions/number";

describe("order numbers with a product code", () => {
  it("formats like the client's example", () => {
    expect(formatProductOrderNumber("rso", "CIF", 778423, 2026)).toBe("RSO-CIF-778423-26");
    expect(formatProductOrderNumber("CPO", "fob", 12, 2027)).toBe("CPO-FOB-000012-27");
  });

  it("parses the code, Incoterm, sequence and year", () => {
    expect(parseProductOrderNumber("RSPO-CIF-000123-26")).toEqual({ code: "RSPO", incoterm: "CIF", sequence: 123, year: 2026 });
    expect(parseProductOrderNumber("FK-S-2026-000001")).toBeNull();
    expect(PRODUCT_ORDER_NUMBER.test("BR-2026-ABC123")).toBe(false);
  });

  it("changes only the Incoterm part", () => {
    expect(withIncoterm("RSO-CIF-778423-26", "FOB")).toBe("RSO-FOB-778423-26");
    expect(withIncoterm("FK-S-2026-000001", "FOB")).toBe("FK-S-2026-000001");
  });
});
