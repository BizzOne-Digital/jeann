/**
 * Soft Corporate Offer (SCO) skeleton: the client's "Master Bank-Compliant SCO Template".
 * It replaces the earlier sample. The parts that change per deal are placeholders ({{name}}). The
 * product-driven lines (HS code, grade, origin, packaging, inspection, documents, and the whole of
 * Schedule A) come from the product record, so they follow the product and stay bank-compliant.
 * Admin can edit, add or remove sections in the skeleton editor.
 */
export type SkeletonBlock = { type: string; content: string };

const row = (label: string, value: string) => "**" + label + ":** " + value;

export const SCO_SKELETON_BLOCKS: SkeletonBlock[] = [
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
  { type: "paragraph", content: "[center] # SOFT CORPORATE OFFER (SCO)" },
  {
    type: "paragraph",
    content: "[center] Bank-Compliant Master Sales Offer • Governed by ICC UCP 600 (Art. 38) & Incoterms® 2020",
  },
  {
    type: "paragraph",
    content: [
      row("SCO Reference No.", "{{transactionNumber}}"),
      row("Date of Issuance", "{{date}}"),
      row("Offer Validity", "Seven (7) International Banking Days"),
      row("Buyer Inquiry Ref.", "{{buyerInquiryRef}}"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content:
      "**SUBJECT:** SOFT CORPORATE OFFER FOR THE SUPPLY OF {{quantity}} OF {{productLine}} — CROP/PRODUCTION YEAR {{cropYear}}",
  },
  {
    type: "paragraph",
    content: [row("TO", "{{buyerName}}"), row("ATTN", "{{buyerContact}}")].join("\n"),
  },
  { type: "paragraph", content: "Dear {{buyerSalutation}}," },
  {
    type: "paragraph",
    content:
      "We, **Finekarts Incorporated**, acting with full corporate authority and legal responsibility, hereby confirm that we are ready, willing, and able to supply and deliver the commodity detailed below subject to the execution of a mutually agreed Sales and Purchase Agreement (SPA) and issuance of an operative, bank-verified Irrevocable, Transferable Letter of Credit in accordance with ICC UCP 600.",
  },
  { type: "paragraph", content: "## 1. CORPORATE PARTIES TO THE OFFER (AML / KYC)" },
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
  { type: "paragraph", content: "## 2. COMMODITY, QUANTITY & COMMERCIAL TERMS" },
  {
    type: "paragraph",
    content: [
      row("Commodity Name", "{{product}}"),
      row("Harmonized System (HS) Code", "{{hsCode}}"),
      row("Grade / Quality Standard", "{{productGrade}}"),
      row("Crop / Production Year", "{{cropYear}}"),
      row("Country of Origin", "{{origin}}"),
      row("Contract Type & Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (±5% tolerance at Seller's option per UCP 600 Art. 30)"),
      row("Delivery Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}} — {{destinationPort}}"),
      row("Port of Loading", "{{loadingPort}}"),
      row("Port of Discharge", "{{destinationPort}}"),
      row("Unit Price", "{{unitPrice}} per Metric Ton {{incoterm}}"),
      row("Tranche Value", "{{trancheValue}} (Tranche Quantity × Unit Price)"),
      row("Total Contract Value", "{{totalValue}} (Total Quantity × Unit Price)"),
      row("Target Shipment / ETA Window", "Within {{etaDays}} calendar days following receipt and acceptance of operative banking instrument"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 3. REGULATORY & FOOD SAFETY COMPLIANCE" },
  {
    type: "paragraph",
    content: [
      row("Technical Specifications", "Full physical, chemical, and purity parameters are set forth in Schedule A attached hereto."),
      row("Genetic & Purity Compliance", "{{purityCompliance}}."),
      row(
        "Statutory Import Standards",
        "The commodity shall strictly comply with Codex Alimentarius, Maximum Residue Limits (MRL), heavy metal tolerances, and mandatory import regulations of the destination country ({{importStandards}}).",
      ),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 4. BANKING & PAYMENT TERMS (ICC UCP 600)" },
  {
    type: "paragraph",
    content: [
      "**Seller's Advising / Transferring Bank Coordinates**",
      row("Advising / Transferring Bank", "{{sellerBankName}}"),
      row("Bank Branch Address", "{{sellerBankAddress}}"),
      row("SWIFT / BIC Code", "{{sellerBankSwift}}"),
      row("Beneficiary Name & Account", "Finekarts Incorporated | Account / IBAN: {{sellerBankAccount}}"),
      row("Bank Officer Contact", "{{sellerBankOfficer}} | {{sellerBankContact}}"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "**Payment Instrument & Settlement Mechanism**",
      row(
        "Payment Instrument",
        "100% payable via an Irrevocable, Transferable Documentary Letter of Credit (LC) issued via SWIFT MT700 (Field 40A designated as \"TRANSFERABLE\") by Buyer's Issuing Bank, governed by ICC UCP 600 (Article 38), payable 100% against compliant presentation of stipulated shipping documents at the counters of the Nominated/Transferring Bank.",
      ),
      row(
        "Transferability Terms (UCP 600 Article 38)",
        "The Letter of Credit shall be explicitly designated as \"Transferable\" by the Issuing Bank, permitting the Seller (First Beneficiary) to instruct the Transferring Bank to transfer the credit in whole or in part to one or more Second Beneficiaries (underlying suppliers/refineries). All bank transfer fees shall be for the account of the First Beneficiary unless otherwise agreed in the SPA.",
      ),
      row(
        "SWIFT Messaging & Examination Standards",
        "All interbank communications shall adhere to ISO 15022 / ISO 20022 standards (Pre-Advice: SWIFT MT705; Issuance: SWIFT MT700; Amendment: SWIFT MT707; Settlement: SWIFT MT103). Pursuant to UCP 600 Article 14(b), banks shall have a maximum of five (5) banking days following presentation to determine document compliance.",
      ),
      row(
        "Performance Guarantee (PB)",
        "For revolving contracts or LC-backed transactions, Seller's Bank shall issue an operative Performance Bond equal to {{performanceBondPercent}} of the tranche/contract value via SWIFT MT760 within five (5) banking days after receipt of Buyer's operative Transferable LC.",
      ),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 5. INSPECTION & STIPULATED SHIPPING DOCUMENTS (UCP 600)" },
  {
    type: "paragraph",
    content:
      "Quality, quantity, weight, and packing shall be inspected at the Port of Loading by {{inspection}} at Seller's expense. All original shipping documents shall be presented through bank-to-bank channels pursuant to UCP 600:\n{{requiredDocuments}}",
  },
  { type: "paragraph", content: "## 6. TRANSACTION PROCEDURE & GOVERNING CLAUSES" },
  {
    type: "paragraph",
    content: [
      "1. **SCO Acceptance & ICPO Submission:** Buyer signs and returns this SCO accompanied by an Irrevocable Corporate Purchase Order (ICPO), Client Information Sheet (CIS), Certificate of Incorporation, and a bank-issued Ready, Willing, and Able (RWA) letter or Bank Comfort Letter (BCL) verifiable via bank-to-bank SWIFT MT799.",
      "2. **SPA Execution:** Within three (3) banking days of KYC/capability verification, Seller issues the formal Sales and Purchase Agreement (SPA) and Proforma Invoice. Both Parties finalize, sign, and seal the SPA within three (3) banking days.",
      "3. **Operative Transferable LC Issuance:** Within five (5) banking days of SPA execution, Buyer's Issuing Bank transmits the operative Irrevocable, Transferable Letter of Credit (SWIFT MT700) to Seller's Advising/Transferring Bank.",
      "4. **Performance Bond & Loading:** Seller's Bank issues the operative Performance Bond (if applicable), completes pre-shipment inspection, and loads the cargo within the contracted shipment window.",
      "5. **Document Presentation & Settlement:** Seller (or Second Beneficiaries via the Transferring Bank) presents compliant documents to Buyer's Issuing Bank; payment is released immediately upon document verification under ICC UCP 600.",
      row(
        "Allocation & Validity",
        "Product allocation is subject to production capacity on a First-Come, First-Served (FCFS) basis. Quoted pricing becomes contractually binding upon SPA execution and receipt of an operative SWIFT MT700.",
      ),
      row(
        "Intermediary & NCNDA Protection",
        "All parties and intermediaries are protected under an ICC Non-Circumvention, Non-Disclosure & Working Agreement (NCNDA) and Irrevocable Master Fee Protection Agreement (IMFPA) governed by ICC Publication No. 769 for five (5) years. Commission of USD {{commission}} per MT (if applicable) shall be settled concurrently with each tranche payment per the executed IMFPA.",
      ),
      row(
        "Arbitration & Governing Law",
        "Any dispute arising out of or in connection with this SCO shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce (ICC).",
      ),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 7. AUTHORIZED CORPORATE EXECUTION" },
  {
    type: "paragraph",
    content: [
      "**ISSUED BY SELLER — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Seal: ____________________",
      row("Name", "{{sellerRepresentative}}"),
      row("Title", "{{sellerTitle}}"),
      row("Date", "{{date}}"),
      "",
      "**ACCEPTED AND AGREED BY BUYER:**",
      "Authorized Signature & Seal: ____________________",
      row("Name", "{{buyerSignatory}}"),
      row("Company", "{{buyerName}}"),
      "Date: ____________________",
    ].join("\n"),
  },
  { type: "paragraph", content: "[pagebreak]" },
  { type: "paragraph", content: "## SCHEDULE A: COMMODITY TECHNICAL SPECIFICATIONS" },
  { type: "paragraph", content: "**Quality / Technical Parameter — Contractual Standard / Limit — Test Method / Standard**" },
  { type: "paragraph", content: "{{specificationBlock}}" },
];
