/**
 * Proforma Invoice master skeleton, the client's skeleton. It is the operational instrument issued after
 * the PSA is signed. The commodity line, HS code, origin, quantity, prices and the amount in words follow
 * the order and the product, so the invoice mirrors the PSA verbatim and stays bank-compliant.
 * The Finekarts signature and the company seal print on the final invoice.
 */
import type { SkeletonBlock } from "@/lib/contracts/sco-skeleton";

const row = (label: string, value: string) => "**" + label + ":** " + value;

export const PROFORMA_SKELETON_BLOCKS: SkeletonBlock[] = [
  {
    type: "paragraph",
    content: [
      "[center] **FINEKARTS INC.**",
      "[center] **FINEKARTS INCORPORATED**",
      "[center] GLOBAL COMMODITY TRADE & SUPPLY CHAIN MANAGEMENT",
      "[center] Head Office: 4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada",
      "[center] Courier Office: 169 Kingswood Drive, Brampton, ON L6V 3B2, Canada",
      "[center] Tel: +1 (416) 985-8772 | Email: info@finekarts.com",
    ].join("\n"),
  },
  { type: "paragraph", content: "[center] # PROFORMA INVOICE" },
  {
    type: "paragraph",
    content: "[center] Post-SPA Operational Instrument • Governed by ICC UCP 600 (Art. 38) & Incoterms® 2020",
  },
  {
    type: "paragraph",
    content: [
      row("Proforma Invoice No.", "{{proformaNumber}}"),
      row("Date of Issuance", "{{date}}"),
      row("Associated SPA Ref.", "{{psaRef}}"),
      row("Payment Terms", "Irrevocable, Transferable LC (UCP 600 Art. 38)"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 1. COMMERCIAL PARTIES (AML / KYC)" },
  {
    type: "paragraph",
    content: [
      "**SELLER / FIRST BENEFICIARY**",
      row("Company Name", "Finekarts Incorporated"),
      row("Corp. Reg. No.", "{{sellerRegNumber}}"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Authorized Signatory", "{{sellerRepresentative}} ({{sellerTitle}})"),
      row("Telephone / Email", "+1 (416) 985-8772 | info@finekarts.com"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "**BUYER / APPLICANT**",
      row("Company Name", "{{buyerName}}"),
      row("Corp. Reg. / Tax ID", "{{buyerRegNumber}}"),
      row("Registered Address", "{{buyerAddress}}"),
      row("Attention / Title", "{{buyerContact}}"),
      row("Telephone / Email", "{{buyerTelephone}} | {{buyerEmail}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 2. COMMODITY LINE ITEMS & VALUATION" },
  {
    type: "paragraph",
    content: [
      "**Item 01**",
      row("Description & Specifications", "{{productLine}}"),
      row("HS Code", "{{hsCode}}"),
      row("Crop Year", "{{cropYear}}"),
      row("Origin", "{{origin}}"),
      row("Incoterms® 2020", "{{incoterm}} {{destinationPort}}"),
      row("Quantity", "{{quantity}} (±5% UCP 600 Art. 30)"),
      row("Unit Price (USD)", "{{unitPrice}}"),
      row("Total Amount (USD)", "{{totalValue}}"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      row("Total Invoice Value", "{{totalValue}} ({{amountInWords}})"),
      row("Port of Loading & Discharge", "Loading: {{loadingPort}} | Discharge: {{destinationPort}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 3. SELLER'S ADVISING / TRANSFERRING BANK COORDINATES (LC INSTRUCTIONS)" },
  {
    type: "paragraph",
    content: [
      "**Advising & Transferring Bank Details for SWIFT MT700**",
      row("Advising / Transferring Bank", "{{sellerBankName}}"),
      row("Bank Branch Address", "{{sellerBankAddress}}"),
      row("SWIFT / BIC Code", "{{sellerBankSwift}}"),
      row("Beneficiary Name & Account", "Finekarts Incorporated | Account / IBAN: {{sellerBankAccount}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 4. OPERATIONAL INSTRUCTIONS & UCP 600 COMPLIANCE" },
  {
    type: "paragraph",
    content: [
      row(
        "Letter of Credit Issuance",
        "Pursuant to the executed SPA, the Buyer's Issuing Bank must issue the operative **Irrevocable, Transferable Documentary Letter of Credit (SWIFT MT700, Field 40A: TRANSFERABLE)** governed by **ICC UCP 600 Article 38** within five (5) banking days hereof.",
      ),
      row(
        "Bank Compliance Guarantee",
        "This Proforma Invoice is expressly formatted and structured for direct presentation to issuing and advising banks under ISO 15022 / ISO 20022 standards. All descriptions, pricing structures, unit metrics, and UCP 600 Article 38 transferability instructions mirror the underlying SPA verbatim to prevent any discrepancies during bank document examination under UCP 600 Article 14.",
      ),
      row(
        "Separate Logistics & Supplier Confidentiality",
        "All shipping, vessel chartering, and cargo logistics are independently managed by Finekarts Incorporated. Supplier identity and mill origins remain strictly confidential and protected under the 10-year non-circumvention covenant of the executed SPA.",
      ),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "**ISSUED BY SELLER — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Seal:",
      "[signature]",
      row("Name", "{{sellerRepresentative}}"),
      row("Title", "{{sellerTitle}}"),
      row("Date", "{{date}}"),
    ].join("\n"),
  },
];
