import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BUYER_CIS_PDF } from "@/lib/content/buyer-cis-download";

describe("buyer CIS PDF", () => {
  it("public PDF file exists at configured path", () => {
    const relative = BUYER_CIS_PDF.href.replace(/^\//, "");
    expect(existsSync(join(process.cwd(), "public", relative))).toBe(true);
  });
});
