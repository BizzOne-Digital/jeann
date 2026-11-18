/**
 * Sales and Purchase Agreement (PSA) skeleton: the client's "Updated Master Bank-Compliant PSA Skeleton".
 * The product-driven lines (HS code, grade, origin, packaging, inspection) come from the product record.
 * The LC deadline, the amendment rule and the execution rule are written into the contract itself, as
 * the client requires: a deadline that is only shown on the portal is not part of the contract.
 * Admin can edit, add or remove sections in the skeleton editor.
 */
import { PSA_MANDATORY_CLAUSES } from "@/lib/contracts/psa-terms";
import type { SkeletonBlock } from "@/lib/contracts/sco-skeleton";

const row = (label: string, value: string) => "**" + label + ":** " + value;

// The three clauses every PSA must state. The LC deadline hours come from the PSA form ({{lcDeadlineHours}}).
const LC_DEADLINE_CLAUSE = PSA_MANDATORY_CLAUSES[0].text("{{lcDeadlineHours}}");
const AMENDMENTS_CLAUSE = PSA_MANDATORY_CLAUSES[1].text(24);
const EXECUTION_CLAUSE = PSA_MANDATORY_CLAUSES[2].text(24);

export const PSA_SKELETON_BLOCKS: SkeletonBlock[] = [
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
  { type: "paragraph", content: "[center] # SALES AND PURCHASE AGREEMENT (PSA)" },
  {
    type: "paragraph",
    content: "[center] Master Sales and Purchase Agreement • Governed by ICC UCP 600 (Art. 38) & Incoterms® 2020",
  },
  {
    type: "paragraph",
    content: [
      row("Contract Reference No.", "{{transactionNumber}}"),
      row("Date of Execution", "{{date}}"),
      row("Governing Rules", "ICC UCP 600 & Incoterms® 2020"),
      row("Associated ICPO Ref.", "{{icpoRef}}"),
    ].join("\n"),
  },
  {
    type: "paragraph",
    content:
      "This Sales and Purchase Agreement (\"PSA\" or \"Contract\") is entered into and made effective as of {{date}}, by and between:",
  },
  { type: "paragraph", content: "## 1. PARTIES TO THE CONTRACT" },
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
      row("Contract Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (±5% tolerance at Seller's option per UCP 600 Art. 30)"),
      row("Delivery Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}} — {{destinationPort}}"),
      row("Port of Loading & Discharge", "Loading: {{loadingPort}} | Discharge: {{destinationPort}}"),
      row("Unit Price & Total Value", "{{unitPrice}} per MT | Total Contract / Tranche Value: {{totalValue}}"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 3. PAYMENT TERMS (IRREVOCABLE, TRANSFERABLE LETTER OF CREDIT)" },
  {
    type: "paragraph",
    content: [
      row(
        "Payment Instrument",
        "100% payable via an Irrevocable, Transferable Documentary Letter of Credit (LC) issued via SWIFT MT700 (Field 40A designated as \"TRANSFERABLE\") by Buyer's Issuing Bank, governed by ICC UCP 600 (Article 38), payable 100% against compliant presentation of stipulated shipping documents at the counters of the Nominated/Transferring Bank.",
      ),
      row(
        "Transferability & Second Beneficiary Protection",
        "The Letter of Credit shall be explicitly designated as \"Transferable\" by the Issuing Bank, permitting the Seller (First Beneficiary) to instruct the Transferring Bank to transfer the credit in whole or in part to one or more Second Beneficiaries (underlying suppliers/refineries). All bank transfer fees shall be for the account of the First Beneficiary unless otherwise agreed.",
      ),
      row(
        "SWIFT Examination & Performance Bond",
        "All interbank messaging shall adhere to ISO 15022 / ISO 20022 standards. Pursuant to UCP 600 Article 14(b), banks shall have a maximum of five (5) banking days following presentation to determine document compliance. Seller's Bank shall issue an operative Performance Bond equal to {{performanceBondPercent}} of the tranche value via SWIFT MT760 within five (5) banking days after receipt of Buyer's operative Transferable LC.",
      ),
      "**" + LC_DEADLINE_CLAUSE.replace(":", ":**"),
      "**" + AMENDMENTS_CLAUSE.replace(":", ":**"),
    ].join("\n"),
  },
  { type: "paragraph", content: "## 4. INSPECTION, WEIGHT & QUALITY FINALITY" },
  {
    type: "paragraph",
    content:
      "Quality, quantity, weight, and condition of the cargo shall be inspected, tested, and certified at the Port of Loading by an independent international surveyor (**{{inspection}}**) appointed and coordinated exclusively by the Seller. All inspection documentation and certificates issued shall be channeled solely through Finekarts Incorporated and its designated banking channels to protect proprietary supply-chain origins.",
  },
  { type: "paragraph", content: "## 5. SEPARATE LOGISTICS & INDEPENDENT SHIPPING MANAGEMENT" },
  {
    type: "paragraph",
    content:
      "Finekarts Incorporated shall independently contract, manage, and oversee all shipping, vessel chartering, containerization, and logistic services separately from the Buyer. The Buyer acknowledges that shipping lines, vessel owners, ports of loading, and physical loading terminals utilized by Finekarts are proprietary commercial assets, and any direct or indirect communication with carriers or terminals intended to uncover the identity of Finekarts' underlying suppliers shall constitute a material breach of this Contract.",
  },
  { type: "paragraph", content: "## 6. STRICT CONFIDENTIALITY & TEN (10) YEAR SUPPLIER NON-CIRCUMVENTION" },
  {
    type: "paragraph",
    content:
      "The Buyer acknowledges and agrees that the identity, location, contacts, and commercial terms of the Seller's underlying manufacturers, mills, refineries, logistic providers, and sub-suppliers constitute highly sensitive trade secrets and proprietary confidential business information belonging exclusively to Finekarts Incorporated. The Buyer, its affiliates, directors, officers, employees, and agents strictly covenant and agree that for a period of exactly TEN (10) YEARS from the date of execution of this Contract, the Buyer shall not directly or indirectly inquire about, discover, contact, communicate, negotiate, partner, or do business with any supplier, mill, refinery, manufacturer, or sub-supplier introduced, implied, or utilized by Finekarts Incorporated under this Contract, whether directly, indirectly, through third parties, agents, brokers, shipping lines, or in any shape or form whatsoever. Any breach or attempted breach of this clause shall constitute a material and irreparable violation, entitling Finekarts Incorporated to immediate injunctive relief, full recovery of lost profits, and liquidated damages of not less than USD {{liquidatedDamages}} per occurrence or full recovery of all transaction values diverted, whichever is greater.",
  },
  { type: "paragraph", content: "## 7. FORCE MAJEURE" },
  {
    type: "paragraph",
    content:
      "Neither Party shall be held liable for any failure or delay in the fulfillment of its contractual obligations if such failure or delay is caused by events beyond its reasonable control, including but not limited to acts of God, war, hostilities, civil commotion, government embargoes, export/import restrictions, pandemics, strikes, lockouts, or severe maritime disruptions (\"Force Majeure\"). The affected Party shall notify the other Party in writing within seven (7) calendar days of the occurrence of such event. If a Force Majeure event persists for more than sixty (60) consecutive days, either Party may terminate the affected tranche or contract without financial penalty.",
  },
  { type: "paragraph", content: "## 8. GOVERNING LAW & ARBITRATION" },
  {
    type: "paragraph",
    content:
      "This Contract shall be governed by, construed, and enforced in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles, and supplemented by ICC Incoterms® 2020 and UCP 600. Any dispute, controversy, or claim arising out of or relating to this Contract, including its formation, breach, termination, or validity, shall be settled definitively by binding arbitration under the Rules of Arbitration of the International Chamber of Commerce (ICC) by one or more arbitrators appointed in accordance with said Rules. The place of arbitration shall be Toronto, Ontario, Canada, and proceedings shall be conducted in the English language.",
  },
  { type: "paragraph", content: "## 9. AUTHORIZED CORPORATE EXECUTION" },
  {
    type: "paragraph",
    content: "**" + EXECUTION_CLAUSE.replace(":", ":**"),
  },
  {
    type: "paragraph",
    content: [
      "**FOR SELLER — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Seal:",
      "[signature]",
      row("Name", "{{sellerRepresentative}}"),
      row("Title", "{{sellerTitle}}"),
      row("Date", "{{date}}"),
      "",
      "**FOR BUYER — {{buyerName}}:**",
      "Authorized Signature & Seal: ____________________",
      row("Name", "{{buyerSignatory}}"),
      row("Title", "{{buyerTitle}}"),
      "Date: ____________________",
    ].join("\n"),
  },
  { type: "paragraph", content: "[pagebreak]" },
  { type: "paragraph", content: "## SCHEDULE A: COMMODITY TECHNICAL SPECIFICATIONS" },
  { type: "paragraph", content: "**Quality / Technical Parameter — Contractual Standard / Limit — Test Method / Standard**" },
  { type: "paragraph", content: "{{specificationBlock}}" },
];
