import { describe, expect, it } from "vitest";
import {
  PRODUCT_ORDER_NUMBER,
  formatProductOrderNumber,
  parseProductOrderNumber,
  withIncoterm,
} from "@/lib/transactions/number";

describe("order numbers with a product code", () => {
  it("formats like the client's example", () => {
    expect(formatProductOrderNumber("rso", "CIF", 778423, 2026)).toBe("RSO-CIF-778423-26-FB");
    expect(formatProductOrderNumber("CPO", "fob", 12, 2027)).toBe("CPO-FOB-000012-27-FB");
    expect(formatProductOrderNumber("ICU", "CIF", 5, 2026, "FS")).toBe("ICU-CIF-000005-26-FS");
    expect(formatProductOrderNumber("RPO", "CIF", 5, 2026, null)).toBe("RPO-CIF-000005-26");
  });

  it("parses the code, Incoterm, sequence and year", () => {
    expect(parseProductOrderNumber("RSPO-CIF-000123-26")).toEqual({ code: "RSPO", incoterm: "CIF", sequence: 123, year: 2026 });
    expect(parseProductOrderNumber("RPO-CIF-000123-26-FB")).toEqual({ code: "RPO", incoterm: "CIF", sequence: 123, year: 2026, stage: "FB" });
    expect(parseProductOrderNumber("RPO-CIF-000123-26-FS")?.stage).toBe("FS");
    expect(parseProductOrderNumber("FK-S-2026-000001")).toBeNull();
    expect(PRODUCT_ORDER_NUMBER.test("BR-2026-ABC123")).toBe(false);
  });

  it("changes only the Incoterm part", () => {
    expect(withIncoterm("RSO-CIF-778423-26", "FOB")).toBe("RSO-FOB-778423-26");
    expect(withIncoterm("RSO-CIF-778423-26-FB", "FOB")).toBe("RSO-FOB-778423-26-FB");
    expect(withIncoterm("FK-S-2026-000001", "FOB")).toBe("FK-S-2026-000001");
  });
});
