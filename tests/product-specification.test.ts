import { describe, expect, it } from "vitest";
import { parseSpecificationText, specificationFieldsToText } from "@/lib/products/specification-service";

describe("product specification text", () => {
  it("turns Label: value lines into fields and keeps notes", () => {
    const fields = parseSpecificationText("Free Fatty Acid (FFA): Maximum 0.10%\n\nPacked in flexitanks\nHeavy Metals: Pb: <= 0.10 mg/kg");
    expect(fields["Free Fatty Acid (FFA)"]).toBe("Maximum 0.10%");
    expect(fields["Note 1"]).toBe("Packed in flexitanks");
    expect(fields["Heavy Metals"]).toBe("Pb: <= 0.10 mg/kg");
  });

  it("round-trips back to the same text", () => {
    const text = "Acid Value: Maximum 0.20 mg KOH/g\nPacked in flexitanks";
    expect(specificationFieldsToText(parseSpecificationText(text))).toBe(text);
  });
});
