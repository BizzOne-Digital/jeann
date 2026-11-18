/**
 * Bank-Compliant Letter of Credit wording (SWIFT MT700), the client's skeleton for the SPA attachment.
 * The goods, quantity, ports and the documents required (field 46A) follow the product and the order,
 * so the LC wording mirrors the PSA and the ICPO and stays bank-compliant when the product changes.
 */
import type { SkeletonBlock } from "@/lib/contracts/sco-skeleton";

const row = (label: string, value: string) => "**" + label + ":** " + value;
const field = (tag: string, text: string) => "**" + tag + "** " + text;

export const LC_WORDING_SKELETON_BLOCKS: SkeletonBlock[] = [
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
  { type: "paragraph", content: "[center] # BANK-COMPLIANT LETTER OF CREDIT WORDING" },
  {
    type: "paragraph",
    content: "[center] Standardized SWIFT MT700 Template for SPA Attachment • Governed by ICC UCP 600 (Art. 38)",
  },
  {
    type: "paragraph",
    content: [
      row("Associated PSA Ref.", "{{psaRef}}"),
      row("Governing Rules", "ICC UCP 600 Revision (2007)"),
      row("Instrument Type", "Irrevocable, Transferable LC"),
      row("SWIFT Standard", "ISO 15022 / MT700 Format"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content:
      "This document sets forth the exact mandatory SWIFT MT700 Letter of Credit wording that the Buyer's Issuing Bank must issue to Finekarts Incorporated's Advising Bank within five (5) banking days of executing the Sales and Purchase Agreement (SPA).",
  },
  { type: "paragraph", content: "## STANDARDIZED SWIFT MT700 STRUCTURE & FIELD INSTRUCTIONS" },
  {
    type: "paragraph",
    content: [
      field(":27:", "SEQUENCE OF TOTAL: 1/1"),
      field(":40A:", "FORM OF DOCUMENTARY CREDIT: IRREVOCABLE TRANSFERABLE"),
      field(":20:", "DOCUMENTARY CREDIT NUMBER: {{lcNumber}}"),
      field(":31C:", "DATE OF ISSUE: {{lcIssueDate}}"),
      field(":40E:", "APPLICABLE RULES: UCP LATEST REVISION (ICC UCP 600)"),
      field(":31D:", "DATE AND PLACE OF EXPIRY: {{lcExpiryDate}} IN {{lcExpiryCountry}}"),
      field(":50:", "APPLICANT (BUYER): {{buyerName}}, {{buyerAddress}}, {{buyerRegNumber}}"),
      field(":59:", "BENEFICIARY (SELLER / FIRST BENEFICIARY): FINEKARTS INCORPORATED, 4275 VILLAGE CENTER COURT, MISSISSAUGA, ON L4Z 1S2, CANADA"),
      field(":32B:", "CURRENCY CODE, AMOUNT: USD {{trancheValue}}"),
      field(":39A:", "PERCENTAGE CREDIT AMOUNT TOLERANCE: +/- 05/05 (UP TO 5% MORE OR LESS)"),
      field(":41A:", "AVAILABLE WITH... BY...: {{sellerBankSwift}} BY PAYMENT AT SIGHT"),
      field(":43P:", "PARTIAL SHIPMENTS: ALLOWED / PERMITTED"),
      field(":43T:", "TRANSSHIPMENT: ALLOWED / PERMITTED"),
      field(":44E:", "PORT OF LOADING / AIRPORT OF DEPARTURE: {{loadingPort}}"),
      field(":44F:", "PORT OF DISCHARGE / AIRPORT OF DESTINATION: {{destinationPort}}"),
      field(":44C:", "LATEST DATE OF SHIPMENT: {{latestShipmentDate}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## CONTINUATION: SWIFT MT700 FIELDS 45A & 47A" },
  {
    type: "paragraph",
    content: [
      field(":45A:", "DESCRIPTION OF GOODS AND/OR SERVICES: {{productLineUpper}}. QUANTITY: {{quantity}} (+/- 5% tolerance per UCP 600 Article 30). INCOTERMS® 2020: {{incoterm}} {{destinationPort}}. CROP YEAR: {{cropYear}}. NON-SANCTIONED ORIGIN."),
      field(":46A:", "DOCUMENTS REQUIRED:"),
      "{{lcDocuments}}",
      field(":47A:", "ADDITIONAL CONDITIONS:"),
      "A. THIS DOCUMENTARY CREDIT IS ISSUED SUBJECT TO UCP 600 REVISION.",
      "B. THIS CREDIT IS EXPLICITLY DESIGNATED AS \"TRANSFERABLE\" PURSUANT TO UCP 600 ARTICLE 38. THE TRANSFERRING BANK IS AUTHORIZED TO TRANSFER THIS CREDIT IN WHOLE OR IN PART TO ONE OR MORE SECOND BENEFICIARIES UPON INSTRUCTIONS OF THE FIRST BENEFICIARY (FINEKARTS INCORPORATED).",
      "C. ALL BANKING AND TRANSFER CHARGES OUTSIDE THE ISSUING BANK ARE FOR THE ACCOUNT OF THE APPLICANT (EXCEPT TRANSFER FEES WHICH ARE FOR FIRST BENEFICIARY).",
      "D. THIRD-PARTY DOCUMENTS ARE ACCEPTABLE PURSUANT TO UCP 600.",
      "E. DOCUMENTS PRESENTED WITHIN 21 DAYS AFTER BILL OF LADING DATE BUT BEFORE EXPIRY ARE ACCEPTABLE.",
      field(":71B:", "CHARGES: ALL BANKING CHARGES OUTSIDE ISSUING BANK ARE FOR APPLICANT'S ACCOUNT."),
      field(":48:", "PERIOD FOR PRESENTATION: 21 DAYS AFTER SHIPPING DATE."),
      field(":49:", "CONFIRMATION INSTRUCTIONS: MAY / ADD ({{confirmationInstructions}})."),
    ].join("\n"),
  },
  { type: "paragraph", content: "## KEY COMPLIANCE NOTES FOR YOUR LEGAL TEAM" },
  {
    type: "paragraph",
    content: [
      row(
        "Transferability (UCP 600 Article 38)",
        "Field 40A and Field 47A explicitly command the Issuing Bank to structure the LC as **Transferable**, enabling Finekarts to fulfill orders seamlessly through underlying suppliers without exposing supplier identities.",
      ),
      row(
        "Exact Document Alignment",
        "The stipulated documents in Field 46A mirror your Master PSA and ICPO requirements word-for-word, eliminating any risk of bank discrepancies under UCP 600 Article 14.",
      ),
    ].join("\n"),
  },
];
