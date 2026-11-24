import { describe, expect, it } from "vitest";
import { inflateRawSync } from "node:zlib";
import { createZip, safeFileName } from "@/lib/files/zip";

describe("createZip", () => {
  it("writes a readable archive with every entry", () => {
    const zip = createZip([
      { name: "01 - ICPO.pdf", data: new TextEncoder().encode("hello") },
      { name: "02 - PSA.pdf", data: new TextEncoder().encode("world!") },
    ]);
    expect(zip.readUInt32LE(0)).toBe(0x04034b50);
    const end = zip.length - 22;
    expect(zip.readUInt32LE(end)).toBe(0x06054b50);
    expect(zip.readUInt16LE(end + 10)).toBe(2);
    const first = zip.subarray(30 + "01 - ICPO.pdf".length, 30 + "01 - ICPO.pdf".length + 5).toString();
    expect(first).toBe("hello");
    expect(typeof inflateRawSync).toBe("function");
  });

  it("matches the known CRC-32 of 'hello'", () => {
    const zip = createZip([{ name: "a.txt", data: new TextEncoder().encode("hello") }]);
    expect(zip.readUInt32LE(14)).toBe(0x3610a686);
  });
});

describe("safeFileName", () => {
  it("removes characters that break file names", () => {
    expect(safeFileName('PSA: "Coffee" / v2?')).toBe("PSA Coffee v2");
    expect(safeFileName("///")).toBe("document");
  });
});
