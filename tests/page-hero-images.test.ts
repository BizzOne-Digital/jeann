import { describe, expect, it } from "vitest";
import { PAGE_HERO_IMAGES } from "@/lib/marketing/page-hero-images";

describe("page hero images", () => {
  it("assigns a unique photograph to every marketing page hero", () => {
    const sources = Object.values(PAGE_HERO_IMAGES).map((image) => image.src);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
