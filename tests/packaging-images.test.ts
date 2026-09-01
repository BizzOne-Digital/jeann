import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  HOMEPAGE_PACKAGING_TEASER,
  PACKAGING_IMAGES,
} from "@/lib/content/packaging-images";
import { PACKAGING_TYPES } from "@/lib/content/packaging-content";

const publicRoot = join(process.cwd(), "public");

function assertPublicFile(src: string) {
  const relative = src.replace(/^\//, "");
  expect(existsSync(join(publicRoot, relative))).toBe(true);
}

describe("packaging images", () => {
  it("homepage teaser labels use existing client photos", () => {
    for (const item of HOMEPAGE_PACKAGING_TEASER) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.image).toMatch(/^\/images\/packaging\//);
      expect(item.image).not.toMatch(/unsplash/i);
      assertPublicFile(item.image);
    }
  });

  it("packaging catalogue uses only approved local images", () => {
    for (const type of PACKAGING_TYPES) {
      for (const image of type.images) {
        expect(image.src).toMatch(/^\/images\/packaging\//);
        expect(image.src).not.toMatch(/unsplash/i);
        assertPublicFile(image.src);
      }
    }
  });

  it("homepage packaging uses four client product formats plus bulk vessel", () => {
    const teaserImages = HOMEPAGE_PACKAGING_TEASER.map((item) => item.image);
    expect(new Set(teaserImages).size).toBe(teaserImages.length);
    expect(HOMEPAGE_PACKAGING_TEASER.map((item) => item.name)).toEqual([
      "Jumbo Bags",
      "Flexitanks",
      "IBC Totes",
      "Drums",
      "Bulk Vessels",
    ]);
    expect(PACKAGING_IMAGES.fibcJumboBag.src).toContain("fibc-jumbo-bags");
    expect(PACKAGING_IMAGES.flexitank.src).toContain("flexitank");
    expect(PACKAGING_IMAGES.ibcTote.src).toContain("ibc");
    expect(PACKAGING_IMAGES.drums.src).toContain("drums");
    expect(PACKAGING_IMAGES.bulkVessel.src).toContain("bulk-vessel");
  });
});
