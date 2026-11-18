import { StandardFonts, rgb, type PDFDocument, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { parseRichText, pdfSafe, type Run } from "@/lib/documents/rich-text";

const INK = rgb(0.1, 0.1, 0.2);
const RED = rgb(0.78, 0, 0);
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN_X = 50;
const BOTTOM = 60;
const TOP = 800;

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };

export async function embedRichFonts(pdf: PDFDocument): Promise<Fonts> {
  return {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };
}

function fontFor(run: { bold: boolean; italic: boolean }, fonts: Fonts, forceBold: boolean): PDFFont {
  const bold = run.bold || forceBold;
  if (bold && run.italic) return fonts.boldItalic;
  if (bold) return fonts.bold;
  if (run.italic) return fonts.italic;
  return fonts.regular;
}

type Word = { text: string; run: Run; width: number; font: PDFFont };

/**
 * Draws formatted text (see rich-text.ts) from the given position and returns the page and the
 * vertical position after it. Always continues on a new page when the current one is full.
 */
export function renderRichText(
  pdf: PDFDocument,
  fonts: Fonts,
  source: string,
  start: { page: PDFPage; y: number },
  options: { signature?: PDFImage; seal?: PDFImage } = {},
): { page: PDFPage; y: number } {
  let page = start.page;
  let y = start.y;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = TOP;
  };

  for (const block of parseRichText(source)) {
    if (block.kind === "pagebreak") {
      newPage();
      continue;
    }
    if (block.kind === "signature") {
      const sig = options.signature;
      const seal = options.seal;
      const sigHeight = sig ? Math.min(46, (sig.height / sig.width) * 150) : 14;
      const sealSize = seal ? 76 : 0;
      const height = Math.max(sigHeight, sealSize);
      if (y < BOTTOM + height + 6) newPage();
      if (sig) {
        const width = (sig.width / sig.height) * sigHeight;
        page.drawImage(sig, { x: MARGIN_X, y: y - sigHeight + 6, width, height: sigHeight });
      } else {
        page.drawText("____________________", { x: MARGIN_X, y, size: 10, font: fonts.regular, color: INK });
      }
      if (seal) {
        // the company seal sits beside the signature, as a stamp would
        const sealWidth = (seal.width / seal.height) * sealSize;
        page.drawImage(seal, { x: MARGIN_X + 170, y: y - sealSize + 6, width: sealWidth, height: sealSize });
      }
      y -= height + 6;
      continue;
    }
    if (block.kind === "rule") {
      if (y < BOTTOM + 20) newPage();
      page.drawLine({
        start: { x: MARGIN_X, y },
        end: { x: PAGE_W - MARGIN_X, y },
        thickness: 0.8,
        color: rgb(0.6, 0.6, 0.65),
      });
      y -= 12;
      continue;
    }

    const size = block.style === "h1" ? 16 : block.style === "h2" ? 13 : 10;
    const forceBold = block.style === "h1" || block.style === "h2";
    const indent = block.style === "bullet" ? 14 : 0;
    const maxWidth = PAGE_W - 2 * MARGIN_X - indent;

    // Split the runs into words that remember their own font.
    const words: Word[] = [];
    for (const run of block.runs) {
      const font = fontFor(run, fonts, forceBold);
      const parts = pdfSafe(run.text).split(/(\s+)/).filter((p) => p.length > 0);
      for (const text of parts) {
        words.push({ text, run, font, width: font.widthOfTextAtSize(text, size) });
      }
    }

    // Wrap into lines.
    const lines: Word[][] = [];
    let current: Word[] = [];
    let width = 0;
    for (const w of words) {
      const isSpace = /^\s+$/.test(w.text);
      if (!isSpace && width + w.width > maxWidth && current.length) {
        while (current.length && /^\s+$/.test(current[current.length - 1].text)) current.pop();
        lines.push(current);
        current = [];
        width = 0;
      }
      if (isSpace && current.length === 0) continue;
      current.push(w);
      width += w.width;
    }
    if (current.length) lines.push(current);
    if (lines.length === 0) lines.push([]);

    lines.forEach((line, index) => {
      if (y < BOTTOM) newPage();
      const lineWidth = line.reduce((sum, w) => sum + w.width, 0);
      let x = MARGIN_X + indent;
      if (block.align === "center") x = MARGIN_X + indent + (maxWidth - lineWidth) / 2;
      if (block.align === "right") x = MARGIN_X + indent + (maxWidth - lineWidth);
      if (block.style === "bullet" && index === 0) {
        page.drawText("-", { x: MARGIN_X + 2, y, size, font: fonts.regular, color: INK });
      }
      for (const w of line) {
        if (w.text.trim()) {
          page.drawText(w.text, { x, y, size, font: w.font, color: w.run.red ? RED : INK });
        }
        if (w.run.underline && w.text.trim()) {
          page.drawLine({
            start: { x, y: y - 1.5 },
            end: { x: x + w.width, y: y - 1.5 },
            thickness: 0.6,
            color: w.run.red ? RED : INK,
          });
        }
        x += w.width;
      }
      y -= size + 4;
    });
    y -= block.style === "h1" || block.style === "h2" ? 4 : 2;
  }

  return { page, y };
}
