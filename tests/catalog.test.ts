import { describe, expect, it } from "vitest";
import {
  getCategories,
  getProduct,
  searchProducts,
  getAllProducts,
} from "@/lib/content/catalog";

describe("public catalog seed", () => {
  it("includes required top-level categories", () => {
    const slugs = getCategories().map((c) => c.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "edible-oils",
        "sugar",
        "beans-and-pulses",
        "rice-and-grains",
        "other-commodities",
      ]),
    );
  });

  it("seeds edible oil products including canola and rapeseed", () => {
    const oils = getCategories().find((c) => c.slug === "edible-oils");
    expect(oils?.products.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["canola-oil", "rapeseed-oil", "sunflower-oil"]),
    );
  });

  it("seeds rice catalogue with long-grain, parboiled, and basmati grades", () => {
    const rice = getCategories().find((c) => c.slug === "rice-and-grains");
    expect(rice?.products.length).toBe(36);
    expect(rice?.products.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["jasmine-rice", "white-parboiled-rice", "basmati-370"]),
    );
  });
  it("resolves product routes", () => {
    const hit = getProduct("edible-oils", "canola-oil");
    expect(hit?.product.name).toBe("Canola oil");
    expect(hit?.product.status).toBe("pending_verification");
  });

  it("searches products without inventing prices", () => {
    const results = searchProducts("icumsa");
    expect(results.length).toBeGreaterThan(0);
    expect(getAllProducts().every((p) => !("price" in p))).toBe(true);
  });
});
