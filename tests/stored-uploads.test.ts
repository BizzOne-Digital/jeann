import { describe, expect, it } from "vitest";
import { parseUploadPublicUrl } from "@/lib/uploads/constants";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

describe("stored uploads", () => {
  it("parses public upload URLs", () => {
    expect(parseUploadPublicUrl("/api/uploads/products/123-abc.png")).toEqual({
      folder: "products",
      filename: "123-abc.png",
    });
    expect(parseUploadPublicUrl("/api/uploads/../etc/passwd")).toBeNull();
  });

  it("falls back legacy disk upload paths to placeholder", () => {
    expect(resolveImageSrc("/uploads/old.jpg")).toBe("/images/products/product-1.png");
    expect(resolveImageSrc("/api/uploads/gallery/x.png")).toBe("/api/uploads/gallery/x.png");
  });
});
