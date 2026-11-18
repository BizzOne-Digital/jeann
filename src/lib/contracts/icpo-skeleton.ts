/**
 * Irrevocable Corporate Purchase Order (ICPO) skeleton, taken from the client's sample.
 * The product-specific lines (specification, packaging, origin, inspection, documents the seller must
 * provide) come from the product record, so the ICPO stays correct when the product changes.
 * Admin can edit, add or remove sections in the skeleton editor.
 */
import type { SkeletonBlock } from "@/lib/contracts/sco-skeleton";

const row = (label: string, value: string) => "**" + label + ":** " + value;

export const ICPO_SKELETON_BLOCKS: SkeletonBlock[] = [
  {
    type: "paragraph",
    content: [
      "**BUYER:**",
      "**{{buyerName}}**",
      "{{buyerAddress}}",
      "Tel: {{buyerTelephone}}",
      row("Contact Person", "{{buyerContact}}"),
      "Email: {{buyerEmail}}",
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [row("DATE", "{{date}}"), row("ICPO REFERENCE NO.", "{{transactionNumber}}")].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "**TO:**",
      "**SUPPLIER:** {{sellerName}}",
      "{{sellerAddress}}",
      row("Contact", "{{sellerContact}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "**SUBJECT:** PURCHASE ORDER FOR {{quantity}} OF {{productLine}}" },
  { type: "paragraph", content: "[center] # IRREVOCABLE CORPORATE PURCHASE ORDER (ICPO)" },
  { type: "paragraph", content: "Dear {{sellerContact}}," },
  {
    type: "paragraph",
    content:
      "We, {{buyerName}}, hereby confirm with full corporate authority and legal responsibility, under penalty of perjury, that we are ready, willing, and able to purchase the following product under the terms and conditions stated below.",
  },
  { type: "paragraph", content: "## 1. PRODUCT DETAILS" },
  {
    type: "paragraph",
    content: [row("Commodity", "{{productLine}}"), "{{specificationBlock}}", row("Inspection", "{{inspection}} at the port of loading")].join("\n"),
  },
  { type: "paragraph", content: "## 2. QUANTITY" },
  { type: "paragraph", content: "{{quantity}} confirmed by the buyer" },
  { type: "paragraph", content: "## 3. PRICE & TERMS" },
  {
    type: "paragraph",
    content: [
      row("Unit Price", "{{unitPrice}} per Metric Ton"),
      row("Total Value", "{{totalValue}}"),
      row("Incoterm", "{{incoterm}}, {{destinationPort}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 4. PACKAGING" },
  { type: "paragraph", content: "{{packaging}}" },
  { type: "paragraph", content: "## 5. ORIGIN" },
  { type: "paragraph", content: "{{origin}}" },
  { type: "paragraph", content: "## 6. PORTS" },
  {
    type: "paragraph",
    content: [row("Port of Loading", "{{loadingPort}}"), row("Port of Discharge (Final Destination)", "{{destinationPort}}")].join("\n"),
  },
  { type: "paragraph", content: "## 7. FINAL CONSIGNEE (RECEIVER OF GOODS)" },
  {
    type: "paragraph",
    content: [
      row("Company", "{{consigneeCompany}}"),
      row("Contact Person", "{{consigneeContact}}"),
      row("Address", "{{consigneeAddress}}"),
      row("VAT Number", "{{consigneeVat}}"),
      row("Email", "{{consigneeEmail}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 8. PAYMENT TERMS" },
  { type: "paragraph", content: row("Terms", "{{paymentTerms}}") },
  { type: "paragraph", content: "## 9. DELIVERY TERMS" },
  {
    type: "paragraph",
    content: [row("Incoterms", "{{incoterm}}, {{destinationPort}}"), row("Estimated Time of Arrival (ETA)", "{{deliveryTerms}}")].join("\n"),
  },
  { type: "paragraph", content: "## 10. INSPECTION & COMPLIANCE" },
  {
    type: "paragraph",
    content: [
      "All goods shall be inspected by {{inspection}} for quality and quantity at the port of loading, or on-site pre-shipment inspection on the request of the buyer.",
      "The supplier guarantees compliance with the import regulations of the country of destination, including pesticide levels and maximum residue limits (MRL) where they apply to the product.",
      "If the product fails to meet customs or port authority inspection standards at the destination port, the Buyer and Final Receiver shall not be held responsible for any rejection or return related to the product quality standard, packing list errors, or the supplier not providing authentic shipping documents or certificates.",
    ].join("\n"),
  },
  { type: "paragraph", content: "## 11. PERFORMANCE GUARANTEE" },
  {
    type: "paragraph",
    content:
      "The Supplier shall issue a Performance Bond of 4% of the total contract value (if required by the Buyer's bank) within five (5) working days after contract signing.",
  },
  { type: "paragraph", content: "## 12. VALIDITY" },
  { type: "paragraph", content: "This ICPO is valid for 5 international banking days from the date of issuance." },
  { type: "paragraph", content: "## 13. AUTHORIZATION" },
  {
    type: "paragraph",
    content:
      "We hereby issue this Irrevocable Corporate Purchase Order (ICPO) with full legal and corporate responsibility and confirm that the funds are available to fulfill the purchase as per the terms to be agreed in the forthcoming Sales and Purchase Agreement (SPA).",
  },
  { type: "paragraph", content: "## 14. NON-DISCLOSURE, NON-CIRCUMVENTION & NON-CONTACT CLAUSE" },
  {
    type: "paragraph",
    content: [
      "The Seller/Supplier hereby irrevocably agrees that all information relating to the Buyer, Consignee, End Buyer, Buyer's representatives, financial institutions, logistics providers, pricing, volumes, contract terms, and transaction structure is strictly confidential.",
      "The Seller/Supplier shall not, directly or indirectly, for a period of fifty (50) years from the date of this ICPO:",
      "1. Contact, communicate, solicit, negotiate, or transact with the Buyer's Consignee, End Buyer, or any affiliated party, whether identified or introduced by the Buyer, without the Buyer's prior written consent.",
      "2. Bypass, circumvent, or attempt to bypass the Buyer in any manner whatsoever, including through agents, brokers, intermediaries, related companies, or third parties.",
      "3. Use or disclose any confidential or proprietary information obtained through this transaction for any purpose other than the execution of this contract.",
      "Any breach or attempted breach of this clause shall constitute a material and irreparable violation, entitling the Buyer to:",
      "- Immediate injunctive relief (without the need to prove damages),",
      "- Liquidated damages of not less than USD {{liquidatedDamages}} per occurrence, or full loss of profit, whichever is greater,",
      "- Full legal costs, including attorney fees, arbitration costs, and enforcement expenses.",
      "This clause shall survive termination, completion, or expiration of this ICPO and any subsequent contracts and shall be binding on the Seller/Supplier, its affiliates, successors, assigns, directors, officers, employees, and agents worldwide.",
    ].join("\n"),
  },
  { type: "paragraph", content: "## 15. DOCUMENTS REQUIRED FROM THE SELLER" },
  {
    type: "paragraph",
    content:
      "The Seller shall provide the following documents for each shipment, duly signed and issued in English, in both scanned and original formats (where applicable):\n{{requiredDocuments}}",
  },
  {
    type: "paragraph",
    content: [
      "**Seller's Obligation:** The Seller must provide all listed documents to the Buyer's bank and/or consignee within 5 working days after shipment for clearance and payment validation.",
      "All original documents must be sent by express courier (DHL, FedEx, UPS) to this address: {{documentsAddress}}",
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "---",
      "**BUYER:** {{buyerName}}",
      row("Address", "{{buyerAddress}}"),
      "Signature:",
      "{{buyerSignature}}",
      "{{buyerSignatory}}",
      "Authorized Representative",
      "Tel: {{buyerTelephone}}",
      "Email: {{buyerEmail}}",
    ].join("\n"),
  },
  {
    type: "paragraph",
    content:
      "This document and all its contents are confidential and legally protected under international trade and data privacy laws. Unauthorized reproduction, circulation, or alteration is strictly prohibited.",
  },
];
