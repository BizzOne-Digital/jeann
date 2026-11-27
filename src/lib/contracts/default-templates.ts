import { contractFlow, templateKeyFor, type ContractSide } from "@/lib/contracts/contract-flow";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { tradeProcedureLines } from "@/lib/contracts/trade-procedure";
import { ICPO_SKELETON_BLOCKS } from "@/lib/contracts/icpo-skeleton";
import { PSA_SKELETON_BLOCKS } from "@/lib/contracts/psa-skeleton";
import { LC_WORDING_SKELETON_BLOCKS } from "@/lib/contracts/lc-wording-skeleton";
import { PROFORMA_SKELETON_BLOCKS } from "@/lib/contracts/proforma-skeleton";
import {
  SUPPLIER_ICPO_SKELETON_BLOCKS,
  SUPPLIER_LC_WORDING_SKELETON_BLOCKS,
  SUPPLIER_PROFORMA_SKELETON_BLOCKS,
  SUPPLIER_PSA_SKELETON_BLOCKS,
  SUPPLIER_SCO_SKELETON_BLOCKS,
} from "@/lib/contracts/supplier-skeletons";

type Block = { type: string; content: string };
export type DefaultTemplate = {
  key: string;
  name: string;
  side: ContractSide;
  status: "draft" | "published";
  bodyBlocks: Block[];
};

const PARTIES: Block = {
  type: "paragraph",
  content: "Seller: {{sellerName}}\nBuyer: {{buyerName}}\nReference: {{transactionNumber}}\nDate: {{date}}",
};
const GOODS: Block = {
  type: "paragraph",
  content:
    "Product: {{product}}\nQuantity: {{quantity}}\nUnit price: {{unitPrice}}\nTotal value: {{totalValue}}\nIncoterm: {{incoterm}}\nLoading port: {{loadingPort}}\nDestination port: {{destinationPort}}\nPacking: {{packaging}}\nInspection: {{inspection}}\nShipment schedule: {{shipmentSchedule}}\nPayment terms: {{paymentTerms}}",
};
const P = (content: string): Block => ({ type: "paragraph", content });
const H = (content: string): Block => ({ type: "heading", content });

const BODIES: Record<string, Block[]> = {
  sco: SCO_SKELETON_BLOCKS,
  fco: [
    H("Full Corporate Offer"),
    PARTIES,
    P("We confirm our full offer on the terms below. This offer is valid for the period stated in the accompanying message."),
    GOODS,
    P("Banking requirement: any Letter of Credit (LC) or Standby Letter of Credit (SBLC) under this offer must be issued by a financial institution ranked among the top 50 banking institutions in the world. The buyer shall provide its banking information, including the name of the issuing bank, to the seller for review before the transaction is committed."),
    P("Acceptance by ICPO or signed contract is the basis for the sales and purchase agreement."),
    H("Trade procedure (the workflow of this transaction)"),
    P(tradeProcedureLines().join("\n")),
  ],
  loi: [
    H("Letter of Intent"),
    PARTIES,
    P("The buyer confirms its intent to purchase the following product, subject to agreement of a sales and purchase agreement."),
    GOODS,
  ],
  icpo: ICPO_SKELETON_BLOCKS,
  spa: PSA_SKELETON_BLOCKS,
  lc_wording: LC_WORDING_SKELETON_BLOCKS,
  proforma_invoice: PROFORMA_SKELETON_BLOCKS,
  commercial_invoice: [
    H("Commercial invoice"),
    PARTIES,
    GOODS,
    P("Commercial Invoice No.: {{commercialInvoiceNumber}}\nAssociated PSA Ref.: {{psaRef}}\nShipment / bill of lading reference: ____________________\nAmount due: {{totalValue}}"),
    P("This is the final invoice for the goods as shipped. Quantity and amount must match the shipped quantity. It is issued to the buyer's bank to request the final payment (MT103)."),
  ],
};

/** On the supplier portal Finekarts is the buyer, so these documents have their own wording. */
const SUPPLIER_BODIES: Record<string, Block[]> = {
  sco: SUPPLIER_SCO_SKELETON_BLOCKS,
  icpo: SUPPLIER_ICPO_SKELETON_BLOCKS,
  spa: SUPPLIER_PSA_SKELETON_BLOCKS,
  lc_wording: SUPPLIER_LC_WORDING_SKELETON_BLOCKS,
  proforma_invoice: SUPPLIER_PROFORMA_SKELETON_BLOCKS,
};

export function defaultTemplates(): DefaultTemplate[] {
  const out: DefaultTemplate[] = [];
  for (const side of ["buyer", "supplier"] as ContractSide[]) {
    const seen = new Set<string>();
    for (const step of contractFlow(side)) {
      for (const doc of step.documents) {
        const body = (side === "supplier" ? SUPPLIER_BODIES[doc.slug ?? ""] : undefined) ?? BODIES[doc.slug ?? ""];
        if (!doc.slug || seen.has(doc.slug) || !body) continue;
        seen.add(doc.slug);
        out.push({
          key: templateKeyFor(doc.slug, side),
          name: `${doc.fullName} (${side} portal)`,
          side,
          status: "published",
          bodyBlocks: body,
        });
      }
    }
  }
  return out;
}
