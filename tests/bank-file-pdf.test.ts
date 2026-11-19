import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { assembleBankFile } from "@/lib/banking/bank-file-pdf";

async function pdfWithPages(n: number) {
  const d = await PDFDocument.create();
  for (let i = 0; i < n; i++) d.addPage([300, 300]);
  return d.save();
}

describe("bank file pdf", () => {
  it("adds an index page, a separator per tab and the document pages in tab order", async () => {
    const out = await assembleBankFile({
      transactionNumber: "RSO-CIF-000123-26",
      entries: [
        { tabNumber: 3, tabLabel: "PSA", title: "PSA", bytes: await pdfWithPages(2) },
        { tabNumber: 1, tabLabel: "Offer", title: "SCO", bytes: await pdfWithPages(1) },
        { tabNumber: 6, tabLabel: "Letter of Credit (LC)", title: "LC", filename: "lc.docx" },
      ],
    });
    const doc = await PDFDocument.load(out);
    // index 1 + (separator 1 + 1 page) + (separator 1 + 2 pages) + (separator 1, not a PDF)
    expect(doc.getPageCount()).toBe(1 + 2 + 3 + 1);
  });
});
