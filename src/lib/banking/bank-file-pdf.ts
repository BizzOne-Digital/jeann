import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type BankFileEntry = {
  tabNumber: number;
  tabLabel: string;
  title: string;
  filename?: string;
  /** PDF bytes. Missing for a document that is not a PDF or could not be read. */
  bytes?: Uint8Array;
};

/**
 * One PDF for the bank: an index page, then for every document a separator page showing its tab
 * number and label, followed by the document itself. A document that is not a PDF gets its
 * separator page with a note that it is provided separately, so nothing is silently left out.
 */
export async function assembleBankFile(input: { transactionNumber?: string; entries: BankFileEntry[] }): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const font = await out.embedFont(StandardFonts.Helvetica);
  const bold = await out.embedFont(StandardFonts.HelveticaBold);
  const entries = [...input.entries].sort((a, b) => a.tabNumber - b.tabNumber);

  const index = out.addPage([595, 842]);
  index.drawText("FINEKARTS INCORPORATED", { x: 50, y: 780, size: 11, font: bold });
  index.drawText("Documents for the bank", { x: 50, y: 750, size: 20, font: bold });
  if (input.transactionNumber) index.drawText("Order: " + input.transactionNumber, { x: 50, y: 726, size: 11, font });
  let y = 690;
  index.drawText("Index", { x: 50, y, size: 12, font: bold });
  y -= 24;
  for (const e of entries) {
    if (y < 60) break;
    index.drawText("Tab " + e.tabNumber + "  " + e.tabLabel, { x: 50, y, size: 11, font: bold });
    index.drawText(e.title.slice(0, 90), { x: 78, y: y - 14, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
    y -= 36;
  }

  for (const e of entries) {
    const sep = out.addPage([595, 842]);
    sep.drawText("TAB " + e.tabNumber, { x: 50, y: 520, size: 48, font: bold });
    sep.drawText(e.tabLabel, { x: 50, y: 480, size: 16, font: bold });
    sep.drawText(e.title.slice(0, 90), { x: 50, y: 458, size: 11, font });
    let note = "";
    if (e.bytes) {
      try {
        const src = await PDFDocument.load(e.bytes, { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        for (const p of pages) out.addPage(p);
      } catch {
        note = "This document could not be merged. It is provided separately.";
      }
    } else {
      note = "This document is provided separately" + (e.filename ? " (" + e.filename + ")." : ".");
    }
    if (note) sep.drawText(note, { x: 50, y: 430, size: 10, font, color: rgb(0.6, 0, 0) });
  }
  return out.save();
}
