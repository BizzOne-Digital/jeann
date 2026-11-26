import { describe, expect, it } from "vitest";
import { isPlaceholderText } from "@/lib/products/document-fields";

describe("isPlaceholderText", () => {
  it("flags the sample text that ships with the product catalogue", () => {
    expect(
      isPlaceholderText(
        "Sunflower oil. Example content, requires Finekarts admin verification before treating as confirmed trade specifications.",
      ),
    ).toBe(true);
    expect(isPlaceholderText("Origin options confirmed per contract (example field)")).toBe(true);
  });

  it("lets real values through", () => {
    expect(isPlaceholderText("Brazil / Santos")).toBe(false);
    expect(isPlaceholderText("Arabica, Grade 2, screen 17/18")).toBe(false);
    expect(isPlaceholderText("")).toBe(false);
    expect(isPlaceholderText(undefined)).toBe(false);
  });
});
