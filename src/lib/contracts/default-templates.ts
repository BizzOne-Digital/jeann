import { contractFlow, templateKeyFor, type ContractSide } from "@/lib/contracts/contract-flow";

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
  sco: [
    H("Soft Corporate Offer"),
    PARTIES,
    P("We are pleased to offer the following product for your consideration. This is a soft offer and is subject to final confirmation."),
    GOODS,
    P("This offer is not binding until a Full Corporate Offer or signed contract is issued."),
  ],
  fco: [
    H("Full Corporate Offer"),
    PARTIES,
    P("We confirm our full offer on the terms below. This offer is valid for the period stated in the accompanying message."),
    GOODS,
    P("Acceptance by ICPO or signed contract is the basis for the sales and purchase agreement."),
  ],
  loi: [
    H("Letter of Intent"),
    PARTIES,
    P("The buyer confirms its intent to purchase the following product, subject to agreement of a sales and purchase agreement."),
    GOODS,
  ],
  icpo: [
    H("Irrevocable Corporate Purchase Order"),
    PARTIES,
    P("The buyer irrevocably confirms its order for the product below on the terms stated."),
    GOODS,
    P("Authorised signatory name, title and signature: ____________________"),
  ],
  spa: [
    H("Sales and Purchase Agreement"),
    PARTIES,
    P("1. Goods. The seller agrees to sell and the buyer agrees to buy the goods described below."),
    GOODS,
    P("2. Quality and quantity are verified by the inspection company named above at loading.\n3. Payment is made as stated in the payment terms agreed between the parties.\n4. Disputes are handled under the governing law and venue agreed in the signed schedule."),
    P("Signed for the seller: ____________________\nSigned for the buyer: ____________________"),
  ],
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
