import { describe, expect, it } from "vitest";
import { lookupStaticTranslation } from "@/lib/i18n/static/catalog";

describe("static i18n catalog", () => {
  it("translates navigation in Spanish", () => {
    expect(lookupStaticTranslation("Home", "es")).toBe("Inicio");
    expect(lookupStaticTranslation("Products", "es")).toBe("Productos");
  });

  it("translates hero copy in French", () => {
    expect(lookupStaticTranslation("Explore Products", "fr")).toBe("Explorer les produits");
  });

  it("returns null for unknown strings", () => {
    expect(lookupStaticTranslation("Unknown string xyz", "es")).toBeNull();
  });
});
