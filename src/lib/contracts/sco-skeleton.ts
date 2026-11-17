/**
 * Soft Corporate Offer (SCO) skeleton, taken from the client's bank-compliant sample.
 * The parts the client marked in red are placeholders ({{name}}); everything else is fixed wording
 * that admin can edit, add to or remove in the skeleton editor.
 *
 * Formatting uses the editor markup: # / ## headings, - bullets, **bold**, [center].
 */
export type SkeletonBlock = { type: string; content: string };

const row = (label: string, value: string) => "**" + label + ":** " + value;

export const SCO_SKELETON_BLOCKS: SkeletonBlock[] = [
  { type: "paragraph", content: "**FINEKARTS INCORPORATED**\n[right] **REF: {{transactionNumber}}**" },
  { type: "paragraph", content: "[center] # SOFT CORPORATE OFFER (SCO)" },
  {
    type: "paragraph",
    content: [
      row("Reference No.", "{{transactionNumber}}"),
      row("Date of Issuance", "{{date}}"),
      row("Offer Validity", "Seven (7) Banking Days"),
      row("Governing Rules", "ICC UCP 600 (Art. 38) & Incoterms® 2020"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 1. PARTIES TO THE OFFER" },
  {
    type: "paragraph",
    content: [
      "**SELLER / FIRST BENEFICIARY**",
      row("Company Name", "Finekarts Incorporated"),
      row("Authorized Representative", "{{sellerRepresentative}}"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1V3, Canada"),
      row("Telephone", "+1 416-985-8772"),
      row("Email", "info@finekarts.com"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "**BUYER / APPLICANT**",
      row("Company Name", "{{buyerName}}"),
      row("Attention", "{{buyerContact}}"),
      row("Registered Address", "{{buyerAddress}}"),
      row("Telephone", "{{buyerTelephone}}"),
      row("Email", "{{buyerEmail}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 2. COMMODITY, QUANTITY & COMMERCIAL TERMS" },
  {
    type: "paragraph",
    content: [
      row("Commodity or Product Name", "{{productLine}}"),
      row("Origin", "{{origin}}"),
      row("Contract Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (±5% tolerance at Seller's option per UCP 600 Article 30)"),
      row("Shipment Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}}, Port of Discharge: {{destinationPort}}"),
      row("Unit Price", "{{unitPrice}} per Metric Ton {{incoterm}}"),
      row("Quarterly Tranche Value", "{{trancheValue}}"),
      row("Total Annual Contract Value", "{{totalValue}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 3. TECHNICAL & QUALITY SPECIFICATIONS" },
  { type: "paragraph", content: "{{specificationBlock}}" },
  { type: "paragraph", content: "## 4. BANKING & PAYMENT INSTRUMENT TERMS" },
  {
    type: "paragraph",
    content: [
      "- **Payment Instrument:** Irrevocable, Transferable Letter of Credit (LC) payable 100% against compliant presentation of shipping documents.",
      "- **Transferability (UCP 600 Article 38):** The Letter of Credit shall be explicitly designated as \"Transferable\" by the Issuing Bank. The credit may be transferred in whole or in part by the Advising Bank (acting as the Transferring Bank) to one or more second beneficiaries upon the instructions of the First Beneficiary (Finekarts Incorporated). All bank charges and transfer fees incurred in relation to the transfer shall be for the account of the First Beneficiary unless otherwise agreed in the Sales and Purchase Agreement (SPA).",
      "- **Governing Banking Rules:** Subject to the Uniform Customs and Practice for Documentary Credits, 2007 Revision, ICC Publication No. 600 (UCP 600).",
      "- **SWIFT Messaging Standards:** All interbank communications shall strictly adhere to ISO 15022 / ISO 20022 SWIFT Category 7 & Category 1 standards: Pre-Advice (SWIFT MT705), Letter of Credit Issuance (SWIFT MT700, Field 40A designated as \"TRANSFERABLE\"), Letter of Credit Amendment (SWIFT MT707), Notice of Refusal/Discrepancy (SWIFT MT734), Authorization to Pay/Reimburse (SWIFT MT752 / MT742), and Final Settlement Transfer (SWIFT MT103).",
      "- **Document Examination Period:** Pursuant to UCP 600 Article 14(b), the Issuing Bank and Nominated/Advising Bank shall each have a maximum of five (5) banking days following the day of presentation to determine if a presentation is complying.",
      "- **Independence of LC (UCP 600 Articles 4 & 5):** Banks deal with documents and not with goods, services, or performance to which the documents may relate. Payment under the LC is strictly conditional upon a complying presentation of stipulated documents.",
    ].join("\n"),
  },
  { type: "paragraph", content: "## 5. STANDARDIZED BANKING & CONTRACTUAL PROCEDURE" },
  {
    type: "paragraph",
    content: [
      "1. **Buyer's Acceptance & KYC Submission:** Buyer signs and returns this SCO accompanied by an Irrevocable Corporate Purchase Order (ICPO), Client Information Sheet (CIS) (Certificate of Incorporation, Tax Registration, and Authorized Signatory Passport Copy for AML/KYC compliance), and a bank-issued Ready, Willing, and Able (RWA) letter or Bank Comfort Letter (BCL) verifiable via bank-to-bank SWIFT MT799.",
      "2. **Sales and Purchase Agreement (SPA):** Upon satisfactory AML/KYC and capability verification, Seller issues the formal Sales and Purchase Agreement (SPA) and Proforma Invoice within three (3) banking days. Buyer countersigns and returns the SPA within three (3) banking days.",
      "3. **Issuance of Operative Transferable LC:** Within five (5) banking days of SPA execution, Buyer's Issuing Bank transmits the operative Irrevocable Transferable Letter of Credit (SWIFT MT700) to Seller's Advising Bank covering the first quarterly tranche ({{trancheValue}}), operative for all subsequent quarterly tranches on a revolving or consecutive-issuance basis.",
      "4. **Verification & Amendment:** Seller reviews the SWIFT MT700. Any required modifications shall be executed via SWIFT MT707 prior to shipment.",
      "5. **Shipment & Inspection:** Seller loads the cargo in {{packaging}} and conducts pre-shipment inspection at the port of loading via {{inspection}}.",
      "6. **Presentation & Payment:** Seller (or second beneficiaries via the Transferring Bank) presents the stipulated original shipping documents. Upon verification of strict compliance under UCP 600, payment is released via SWIFT MT103.",
    ].join("\n"),
  },
  { type: "paragraph", content: "## 6. STIPULATED DOCUMENTS FOR LC PRESENTATION (UCP 600)" },
  {
    type: "paragraph",
    content: "Payment shall be triggered upon presentation of the following documents matching the Letter of Credit terms:\n{{requiredDocuments}}",
  },
  { type: "paragraph", content: "## 7. INTERMEDIARY PROTECTION & COMMERCIAL VALIDITY" },
  {
    type: "paragraph",
    content: [
      "- **Intermediary & Commission Protection:** All intermediaries and facilitators are protected under an ICC Non-Circumvention, Non-Disclosure & Working Agreement (NCNDA) and Irrevocable Master Fee Protection Agreement (IMFPA) governed by ICC Publication No. 769. Commission of USD $5.00 per MT shall be settled concurrently with each tranche payment as specified in the executed IMFPA.",
      "- **Allocation & Price Validity:** Product allocation is subject to factory capacity on a First-Come, First-Served (FCFS) basis. Quoted pricing remains firm during the 7-day validity of this SCO and becomes contractually binding only upon execution of the SPA and receipt of an operative, bank-verified SWIFT MT700. Any delay by the Buyer in opening the operative Transferable LC beyond the agreed timeline entitles the Seller to adjust pricing or shipment schedules to reflect prevailing market rates.",
    ].join("\n"),
  },
  {
    type: "paragraph",
    content: [
      "---",
      "**ISSUED BY SELLER / FIRST BENEFICIARY**",
      row("Company Name", "Finekarts Incorporated"),
      row("Authorized Signatory", "{{sellerRepresentative}}"),
      "Signature & Seal: ____________________",
      "Date: ____________________",
      "",
      "**ACCEPTED AND AGREED BY BUYER / APPLICANT**",
      row("Company Name", "{{buyerName}}"),
      row("Authorized Signatory", "{{buyerSignatory}}"),
      "Signature & Seal: ____________________",
      "Date: ____________________",
    ].join("\n"),
  },
];
