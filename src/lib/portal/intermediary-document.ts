import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { defaultTemplates } from "@/lib/contracts/default-templates";
import { findPublishedTemplate } from "@/lib/contracts/template-service";
import { placeholderValues, renderTemplateLines, wrapLine, type TemplateBlock } from "@/lib/contracts/template-merge";
import { ICPO_SPECIFICATION_NOTE } from "@/lib/content/buyer-portal-guidance";

export type IntermediaryDocType = "loi" | "icpo";

const TITLES: Record<IntermediaryDocType, string> = {
  loi: "Letter of Intent",
  icpo: "Irrevocable Corporate Purchase Order",
};

/**
 * Creates a new LOI or ICPO (PDF) for a deal an agent or broker brings, using the same editable template that
 * Finekarts staff use (published version first, built-in default otherwise). It is a draft for the end buyer to
 * review and sign; the agent or broker never signs it.
 */
export async function createIntermediaryDocument(input: {
  documentType: IntermediaryDocType;
  buyerCompanyName: string;
  productName: string;
  quantity?: string;
  reference: string;
}): Promise<{ bytes: Uint8Array; filename: string }> {
  const published = await findPublishedTemplate(input.documentType, "buyer");
  const blocks: TemplateBlock[] =
    published?.bodyBlocks ??
    defaultTemplates().find((t) => t.key === `${input.documentType}_buyer`)?.bodyBlocks ??
    [{ type: "heading", content: TITLES[input.documentType] }, { content: "Buyer: {{buyerName}}\nProduct: {{product}}" }];

  const values = placeholderValues(
    {
      buyer: input.buyerCompanyName,
      seller: "Finekarts",
      product: input.productName,
      quantity: input.quantity,
    },
    { transactionNumber: input.reference },
  );
  const lines = renderTemplateLines(blocks, values);
  if (input.documentType === "icpo" && !lines.some((l) => l.includes("Indicative commercial specifications only"))) {
    lines.push("", ...wrapLine(ICPO_SPECIFICATION_NOTE));
  }
  lines.push("", "To be reviewed and signed by the end buyer. The agent or broker who prepared this document does not sign it.");

  const pdf = await PDFDocument.create();
  pdf.setTitle(`${TITLES[input.documentType]} - ${input.reference}`);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  let y = 800;
  const draw = (text: string, size = 10, useBold = false) => {
    if (y < 60) {
      page = pdf.addPage([595, 842]);
      y = 800;
    }
    page.drawText(text.slice(0, 90), { x: 50, y, size, font: useBold ? bold : font, color: rgb(0.1, 0.1, 0.2) });
    y -= size + 4;
  };
  draw(TITLES[input.documentType], 16, true);
  draw(`Reference: ${input.reference}`);
  y -= 8;
  for (const line of lines) for (const part of wrapLine(line)) draw(part);

  const safe = input.buyerCompanyName.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "buyer";
  return { bytes: await pdf.save(), filename: `${input.documentType.toUpperCase()}-${safe}.pdf` };
}
