import { contractFlow, templateKeyFor, type ContractSide } from "@/lib/contracts/contract-flow";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { ICPO_SKELETON_BLOCKS } from "@/lib/contracts/icpo-skeleton";
import { PSA_SKELETON_BLOCKS } from "@/lib/contracts/psa-skeleton";

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
  ],
  loi: [
    H("Letter of Intent"),
    PARTIES,
    P("The buyer confirms its intent to purchase the following product, subject to agreement of a sales and purchase agreement."),
    GOODS,
  ],
  icpo: ICPO_SKELETON_BLOCKS,
  spa: PSA_SKELETON_BLOCKS,
  lc_wording: [
    H("Proposed Letter of Credit wording"),
    PARTIES,
    P("Proposed terms for the documentary letter of credit, to be reviewed by the issuing bank:"),
    GOODS,
    P("Documents required: commercial invoice, packing list, bill of lading, certificate of origin, inspection certificate.\nPartial shipments and transshipment: as agreed in the shipment schedule."),
  ],
  proforma_invoice: [
    H("Proforma invoice"),
    PARTIES,
    GOODS,
    P("This proforma invoice is issued for arranging payment and is not a tax invoice."),
  ],
  commercial_invoice: [
    H("Commercial invoice"),
    PARTIES,
    GOODS,
    P("Invoice number: ____________________\nShipment / bill of lading reference: ____________________\nAmount due: {{totalValue}}"),
    P("Goods are invoiced as shipped, on the terms stated above. Payment is made through the agreed banking instrument."),
  ],
};

export function defaultTemplates(): DefaultTemplate[] {
  const out: DefaultTemplate[] = [];
  for (const side of ["buyer", "supplier"] as ContractSide[]) {
    const seen = new Set<string>();
    for (const step of contractFlow(side)) {
      for (const doc of step.documents) {
        if (!doc.slug || seen.has(doc.slug) || !BODIES[doc.slug]) continue;
        seen.add(doc.slug);
        out.push({
          key: templateKeyFor(doc.slug, side),
          name: `${doc.fullName} (${side} portal)`,
          side,
          status: "published",
          bodyBlocks: BODIES[doc.slug],
        });
      }
    }
  }
  return out;
}
