import { describe, expect, it } from "vitest";
import { isUsableTranslation } from "@/lib/i18n/translate-utils";

describe("translate utils", () => {
  it("rejects MyMemory quota warnings", () => {
    expect(
      isUsableTranslation(
        "Hello",
        "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY.",
      ),
    ).toBe(false);
  });

  it("accepts real translations", () => {
    expect(isUsableTranslation("Hello", "Hola")).toBe(true);
  });
});
