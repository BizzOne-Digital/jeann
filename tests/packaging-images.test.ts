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

  it("exposes distinct photos for key transport modes on the homepage", () => {
    const teaserImages = HOMEPAGE_PACKAGING_TEASER.map((item) => item.image);
    expect(new Set(teaserImages).size).toBe(teaserImages.length);
    expect(HOMEPAGE_PACKAGING_TEASER.map((item) => item.name)).toEqual([
      "Flexitanks",
      "Tanker Vessel",
      "Bulk Vessels",
      "Bulk Railcar",
      "ISO Tank Containers",
    ]);
    expect(PACKAGING_IMAGES.flexitank.src).toContain("flexitank");
    expect(PACKAGING_IMAGES.tankerVessel.src).toContain("tanker-vessel");
    expect(PACKAGING_IMAGES.bulkVessel.src).toContain("bulk-vessel");
    expect(PACKAGING_IMAGES.bulkRailcar.src).toContain("bulk-railcar");
    expect(PACKAGING_IMAGES.isoTank1.src).toContain("iso-tank");
  });
});
