import { describe, expect, it } from "vitest";
import { inflateSync } from "node:zlib";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { prepareSignaturePng } from "@/lib/documents/signature-image";
import { parseRichText, richTextToHtml } from "@/lib/documents/rich-text";
import { embedRichFonts, renderRichText } from "@/lib/documents/rich-text-pdf";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { PSA_SKELETON_BLOCKS } from "@/lib/contracts/psa-skeleton";
import { ICPO_SKELETON_BLOCKS } from "@/lib/contracts/icpo-skeleton";
import { renderTemplateRich } from "@/lib/contracts/template-merge";

/** A black scribble on a white background, like a photo or a scan of a signature. */
async function scribble() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160"><rect width="400" height="160" fill="white"/>' +
    '<path d="M10 120 C 60 20, 120 140, 180 60 S 300 150, 390 40" stroke="black" stroke-width="6" fill="none"/></svg>';
  return sharp(Buffer.from(svg)).jpeg().toBuffer();
}

describe("preloaded signature", () => {
  it("turns a signature on a white background into a transparent PNG", async () => {
    const png = await prepareSignaturePng(await scribble());
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(info.channels).toBe(4);
    let transparent = 0;
    let opaque = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent += 1;
      if (data[i] > 200) opaque += 1;
    }
    expect(transparent).toBeGreaterThan(0);
    expect(opaque).toBeGreaterThan(0);
  });

  it("reads the [signature] line", () => {
    expect(parseRichText("Authorized Signature & Seal:\n[signature]").map((b) => b.kind)).toEqual(["text", "signature"]);
    expect(richTextToHtml("[signature]")).toContain("signature prints here");
  });

  it("draws the image on a final document and a blank line when there is none", async () => {
    async function render(withSignature: boolean) {
      const pdf = await PDFDocument.create();
      const fonts = await embedRichFonts(pdf);
      const signature = withSignature ? await pdf.embedPng(await prepareSignaturePng(await scribble())) : undefined;
      renderRichText(pdf, fonts, "Authorized Signature & Seal:\n[signature]\nName: Jean", { page: pdf.addPage([595, 842]), y: 800 }, { signature });
      const raw = Buffer.from(await pdf.save({ useObjectStreams: false })).toString("latin1");
      let out = raw;
      for (const m of raw.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
        try {
          out += "\n" + inflateSync(Buffer.from(m[1], "latin1")).toString("latin1");
        } catch {
          // not compressed
        }
      }
      return out;
    }
    const withImage = await render(true);
    const without = await render(false);
    expect(withImage).toContain("/Subtype /Image");
    expect(without).not.toContain("/Subtype /Image");
  });

  it("the SCO and the PSA carry the signature on the Finekarts line, the buyer signs by hand", () => {
    for (const blocks of [SCO_SKELETON_BLOCKS, PSA_SKELETON_BLOCKS]) {
      const text = renderTemplateRich(blocks, {});
      const parts = text.split(/ACCEPTED AND AGREED BY BUYER|FOR BUYER/);
      expect(parts[0]).toContain("[signature]");
      expect(parts[1]).not.toContain("[signature]");
    }
  });

  it("the ICPO signature line is a field", () => {
    const text = renderTemplateRich(ICPO_SKELETON_BLOCKS, { buyerSignature: "[signature]" });
    expect(text).toContain("Signature:\n[signature]");
  });
});

import { prepareSealPng } from "@/lib/documents/signature-image";

describe("company seal", () => {
  async function ring() {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="white"/>' +
      '<circle cx="150" cy="150" r="120" stroke="#0044bb" stroke-width="10" fill="none"/>' +
      '<circle cx="150" cy="150" r="40" fill="#c8d0ff"/><circle cx="150" cy="150" r="10" fill="#d2691e"/></svg>';
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  it("removes the white background but keeps the seal colours", async () => {
    const png = await prepareSealPng(await ring());
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let clear = 0;
    let blueInk = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) clear += 1;
      // a strong blue pixel that is mostly opaque: the ring kept its colour
      if (data[i + 3] > 200 && data[i + 2] > 150 && data[i] < 60) blueInk += 1;
    }
    expect(info.channels).toBe(4);
    expect(clear).toBeGreaterThan(0);
    expect(blueInk).toBeGreaterThan(100);
  });

  it("is drawn next to the signature on the final document", async () => {
    const pdf = await PDFDocument.create();
    const fonts = await embedRichFonts(pdf);
    const signature = await pdf.embedPng(await prepareSignaturePng(await scribble()));
    const seal = await pdf.embedPng(await prepareSealPng(await ring()));
    renderRichText(pdf, fonts, "Authorized Signature & Seal:\n[signature]", { page: pdf.addPage([595, 842]), y: 800 }, { signature, seal });
    const raw = Buffer.from(await pdf.save({ useObjectStreams: false })).toString("latin1");
    expect((raw.match(/\/Subtype \/Image/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
});
