/**
 * Skeletons for the supplier portal, taken from the client's five supplier-portal documents: SCO, ICPO,
 * PSA, LC wording and Proforma Invoice. On the supplier portal Finekarts is the buyer and the supplier
 * is the seller, so the supplier decides the seller's terms and Finekarts receives them. Fields that
 * belong to the supplier stay red until they are filled in.
 *
 * Everything that depends on the product (specification, HS code, packaging, inspection, the documents
 * required, the import standards) is a placeholder that follows the product, so the documents stay
 * bank-compliant when the product changes. Admin can edit, add or remove sections in the skeleton editor.
 *
 * The client's wording is kept as it is. Only these errors, found in the review before loading, are fixed:
 * - The PSA title read "(BUYER)"; it is "SALES AND PURCHASE AGREEMENT (PSA)".
 * - LC field :39A: read "MOLOT"; it reads "MORE OR LESS".
 * - The SCO said the Proforma Invoice is issued together with the SPA; the process is that the Proforma
 *   Invoice follows once the SPA is signed by both parties.
 * - Instruction notes in headings ("Red Fields to Be Completed", "TO FILL IN RED", "To Be Completed by
 *   Supplier") are left out because they would print on the final document.
 * - "Dear Mr." is "Dear {{buyerContact}}" so the form of address is not assumed.
 */
import type { SkeletonBlock } from "@/lib/contracts/sco-skeleton";

const row = (label: string, value: string) => "**" + label + ":** " + value;
const field = (tag: string, text: string) => "**" + tag + "** " + text;
const P = (content: string): SkeletonBlock => ({ type: "paragraph", content });

const SUPPLIER_LETTERHEAD = [
  "**{{sellerName}}**",
  "Registered Office: {{sellerAddress}}",
  "Corp. Reg. / Export License No.: {{supplierRegNumber}} | Tel: {{sellerTelephone}} | Email: {{sellerEmail}}",
].join("\n");

const FINEKARTS_LETTERHEAD = [
  "[center] **FINEKARTS INC.**",
  "[center] **FINEKARTS INCORPORATED**",
  "[center] GLOBAL COMMODITY TRADE & SUPPLY CHAIN MANAGEMENT",
  "[center] Head Office: 4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada",
  "[center] Courier Office: 169 Kingswood Drive, Brampton, ON L6V 3B2, Canada",
  "[center] Tel: +1 (416) 985-8772 | Email: info@finekarts.com",
].join("\n");

const SELLER_PARTY = [
  row("Company Name", "{{sellerName}}"),
  row("Corp. Reg. / Tax ID", "{{supplierRegNumber}}"),
  row("Registered Address", "{{sellerAddress}}"),
  row("Authorized Signatory", "{{sellerRepresentative}} ({{sellerTitle}})"),
  row("Telephone / Email", "{{sellerTelephone}} | {{sellerEmail}}"),
];

const SELLER_BANK = [
  row("Supplier's Bank Name", "{{sellerBankName}}"),
  row("Bank Branch Address", "{{sellerBankAddress}}"),
  row("SWIFT / BIC Code", "{{sellerBankSwift}}"),
  row("Account Name & Account / IBAN", "{{sellerName}} | Account / IBAN: {{sellerBankAccount}}"),
];

// ---------------------------------------------------------------------------------------------
// Supplier SCO (issued by the supplier to Finekarts)
// ---------------------------------------------------------------------------------------------
export const SUPPLIER_SCO_SKELETON_BLOCKS: SkeletonBlock[] = [
  P(SUPPLIER_LETTERHEAD),
  P("[center] # SOFT CORPORATE OFFER (SCO)"),
  P("[center] Bank-Compliant Supplier Offer Issued to Finekarts Incorporated • Governed by ICC UCP 600 & Incoterms® 2020"),
  P(
    [
      row("Supplier SCO Ref. No.", "{{supplierScoRef}}"),
      row("Date of Issuance", "{{date}}"),
      row("Offer Validity", "Seven (7) International Banking Days"),
      row("Governing Rules", "ICC UCP 600 (Art. 38) & Incoterms® 2020"),
    ].join("\n"),
  ),
  P("**SUBJECT:** SOFT CORPORATE OFFER FOR THE SUPPLY OF {{quantity}} OF {{productLine}} — CROP/PRODUCTION YEAR {{cropYear}}"),
  P("**TO BUYER / APPLICANT:** Finekarts Incorporated | ATTN: {{buyerContact}} ({{buyerTitle}})"),
  P("Dear {{buyerContact}},"),
  P(
    "We, {{sellerName}}, acting with full corporate authority and legal responsibility as {{supplierCapacity}}, hereby confirm that we are ready, willing, and able to supply and deliver the commodity detailed below to Finekarts Incorporated subject to the execution of a mutually agreed Sales and Purchase Agreement (SPA) and issuance of an operative, bank-verified Letter of Credit in accordance with ICC UCP 600.",
  ),
  P("## 1. PARTIES TO THE OFFER (AML / KYC)"),
  P(["**SELLER / SUPPLIER (ISSUER)**", ...SELLER_PARTY].join("\n")),
  P(
    [
      "**BUYER / APPLICANT (RECIPIENT)**",
      row("Company Name", "Finekarts Incorporated"),
      row("Corp. Reg. No.", "{{finekartsRegNumber}}"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Authorized Representative", "{{buyerContact}} ({{buyerTitle}})"),
      row("Telephone / Email", "+1 (416) 985-8772 | info@finekarts.com"),
    ].join("\n"),
  ),
  P("## 2. COMMODITY, QUANTITY & COMMERCIAL TERMS"),
  P(
    [
      row("Commodity or Product Name", "{{productLine}}"),
      row("Harmonized System (HS) Code", "{{hsCode}}"),
      row("Crop / Production Year", "{{cropYear}}"),
      row("Country of Origin", "{{origin}}"),
      row("Contract Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (± 5% tolerance at Seller's option per UCP 600 Art. 30)"),
      row("Shipment Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}} — Port of Loading: {{loadingPort}} | Port of Discharge: {{destinationPort}}"),
      row("Unit Price", "{{unitPrice}} per Metric Ton {{incoterm}}"),
      row("Tranche Value", "{{trancheValue}}"),
      row("Total Contract Value", "{{totalValue}}"),
    ].join("\n"),
  ),
  P("## 3. TECHNICAL & QUALITY SPECIFICATIONS"),
  P("**Quality Parameter — Contractual Standard / Maximum Limit — Test Method**"),
  P(
    [
      "{{specificationBlock}}",
      row("Heavy Metals, Contaminants & Residues", "Strictly within Codex Alimentarius & Destination Country ({{importStandards}}) limits (Test method: Codex / Accredited Lab)"),
      row("Shelf Life & Storage Conditions", "{{shelfLife}} (Test method: Manufacturer Standard)"),
    ].join("\n"),
  ),
  P("## 4. SUPPLIER BANKING COORDINATES & PAYMENT INSTRUMENT TERMS"),
  P(
    [
      "**Supplier's Advising / Receiving Bank Coordinates**",
      ...SELLER_BANK,
      row("Bank Officer Name & Contact", "{{sellerBankOfficer}} | {{sellerBankContact}}"),
    ].join("\n"),
  ),
  P(
    [
      "**Payment Instrument & UCP 600 Terms**",
      row(
        "Payment Instrument",
        "Irrevocable Documentary Letter of Credit (LC) — or Transferred LC under ICC UCP 600 Article 38 where Supplier acts as Second Beneficiary — payable 100% at sight against compliant presentation of stipulated shipping documents.",
      ),
      row("Governing Banking Rules", "Subject to the Uniform Customs and Practice for Documentary Credits, 2007 Revision, ICC Publication No. 600 (UCP 600)."),
      row(
        "SWIFT Messaging Standards",
        "All interbank communications shall strictly adhere to ISO 15022 / ISO 20022 SWIFT Category 7 & Category 1 standards: Pre-Advice (SWIFT MT705), Letter of Credit Issuance (SWIFT MT700), Transfer Advice (SWIFT MT720, where applicable), Amendment (SWIFT MT707), Notice of Refusal/Discrepancy (SWIFT MT734), Authorization to Pay/Reimburse (SWIFT MT752/MT742), and Final Settlement Transfer (SWIFT MT103).",
      ),
      row(
        "Document Examination Period",
        "Pursuant to UCP 600 Article 14(b), the Issuing Bank and Nominated/Advising Bank shall each have a maximum of five (5) banking days following the day of presentation to determine if a presentation is complying.",
      ),
      row(
        "Independence of Credit (UCP 600 Articles 4 & 5)",
        "Banks deal with documents and not with goods, services, or performance to which the documents may relate. Payment under the LC is strictly conditional upon a complying presentation of stipulated documents.",
      ),
      row(
        "Performance Bond (PB)",
        "Supplier's Bank shall issue an operative Performance Bond equal to {{performanceBondPercent}} of the tranche value via SWIFT MT760 within five (5) banking days upon receipt of Buyer's operative Letter of Credit.",
      ),
    ].join("\n"),
  ),
  P("## 5. STANDARDIZED BANKING & CONTRACTUAL PROCEDURE"),
  P(
    [
      "1. **Buyer's Acceptance & ICPO Submission:** Upon review and acceptance of this SCO, Buyer (Finekarts Incorporated) signs and returns this SCO accompanied by its Irrevocable Corporate Purchase Order (ICPO) and corporate KYC documentation.",
      "2. **Sales and Purchase Agreement (SPA):** Upon satisfactory AML/KYC verification, Supplier issues the formal Sales and Purchase Agreement (SPA) within three (3) banking days. Buyer countersigns and returns the SPA within three (3) banking days. The Proforma Invoice is issued after the SPA has been signed by both parties.",
      "3. **Issuance of Operative LC / Transferred LC:** Within five (5) banking days of SPA execution, Buyer's Issuing/Transferring Bank transmits the operative Irrevocable Letter of Credit (SWIFT MT700 / MT720) to Supplier's Advising Bank covering the first shipment/tranche, operative for all subsequent tranches on a revolving or consecutive-issuance basis.",
      "4. **Verification & Amendment:** Supplier reviews the operative LC. Any required modifications shall be executed via SWIFT MT707 prior to shipment.",
      "5. **Shipment & Independent Inspection:** Supplier loads the cargo and conducts pre-shipment inspection at the port of loading via {{inspection}}.",
      "6. **Presentation & Payment:** Supplier presents the stipulated original shipping documents to its Advising Bank. Upon verification of strict compliance under ICC UCP 600, payment is released via SWIFT MT103.",
    ].join("\n"),
  ),
  P("## 6. STIPULATED DOCUMENTS FOR LC PRESENTATION (UCP 600)"),
  P("Payment shall be triggered upon presentation of the following original documents matching the Letter of Credit terms:\n{{requiredDocuments}}"),
  P("## 7. COMMERCIAL VALIDITY, CONFIDENTIALITY & EXECUTION"),
  P(
    [
      row(
        "Allocation & Price Validity",
        "Product allocation is subject to factory/mill capacity on a First-Come, First-Served (FCFS) basis. Quoted pricing remains firm during the 7-banking-day validity of this SCO and becomes contractually binding upon execution of the SPA and receipt of an operative, bank-verified Letter of Credit.",
      ),
      row(
        "Strict Confidentiality & Non-Circumvention",
        "Both Parties agree that all commercial terms, buyer/end-user destinations, and proprietary supply-chain details disclosed pursuant to this offer are strictly confidential and protected under ICC Non-Circumvention, Non-Disclosure & Working Agreement standards (ICC Publication No. 769).",
      ),
    ].join("\n"),
  ),
  P(
    [
      "**ISSUED BY SELLER / SUPPLIER:**",
      "Signature & Corporate Seal: ____________________",
      row("Company Name", "{{sellerName}}"),
      row("Authorized Signatory", "{{sellerRepresentative}} ({{sellerTitle}})"),
      row("Date", "{{date}}"),
      "",
      "**ACCEPTED AND AGREED BY BUYER / APPLICANT:**",
      "Signature & Corporate Seal: ____________________",
      row("Company Name", "Finekarts Incorporated"),
      row("Authorized Signatory", "{{buyerContact}} ({{buyerTitle}})"),
      "Date: ____________________",
    ].join("\n"),
  ),
];

// ---------------------------------------------------------------------------------------------
// Supplier-portal ICPO (issued by Finekarts to the supplier)
// ---------------------------------------------------------------------------------------------
export const SUPPLIER_ICPO_SKELETON_BLOCKS: SkeletonBlock[] = [
  P(FINEKARTS_LETTERHEAD),
  P("[center] # IRREVOCABLE CORPORATE PURCHASE ORDER (ICPO)"),
  P("[center] Bank-Compliant Master Purchase Order Issued by Finekarts Incorporated • ICC UCP 600 & Incoterms® 2020"),
  P(
    [
      row("ICPO Reference No.", "{{transactionNumber}}"),
      row("Date of Issuance", "{{date}}"),
      row("ICPO Validity", "Five (5) International Banking Days"),
      row("Supplier SCO Ref.", "{{supplierScoRef}}"),
      row("Buyer ICPO Ref.", "{{icpoRef}}"),
    ].join("\n"),
  ),
  P("**SUBJECT:** IRREVOCABLE CORPORATE PURCHASE ORDER FOR {{quantity}} OF {{productLine}} — CROP/PRODUCTION YEAR {{cropYear}} ({{purityCompliance}})"),
  P("**TO SELLER / SUPPLIER:** {{sellerName}} | ATTN: {{sellerContact}}"),
  P("Dear {{sellerContact}},"),
  P(
    "We, Finekarts Incorporated, hereby confirm with full corporate authority and legal responsibility, under penalty of perjury, that we are ready, willing, and able to purchase the commodity detailed below subject to the execution of a mutually agreed Sales and Purchase Agreement (SPA) and settlement via an operative, bank-verified Letter of Credit governed by ICC UCP 600.",
  ),
  P("## 1. CORPORATE PARTIES TO THE PURCHASE ORDER (AML / KYC)"),
  P(
    [
      "**BUYER / APPLICANT (ISSUER)**",
      row("Company Name", "Finekarts Incorporated"),
      row("Corp. Reg. No.", "{{finekartsRegNumber}}"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Authorized Signatory", "{{buyerContact}} ({{buyerTitle}})"),
      row("Telephone / Email", "+1 (416) 985-8772 | info@finekarts.com"),
    ].join("\n"),
  ),
  P(
    [
      "**SELLER / SUPPLIER (RECIPIENT)**",
      row("Company Name", "{{sellerName}}"),
      row("Corp. Reg. / Tax ID", "{{supplierRegNumber}}"),
      row("Registered Address", "{{sellerAddress}}"),
      row("Contact Person / Title", "{{sellerContact}}"),
      row("Telephone / Email", "{{sellerTelephone}} | {{sellerEmail}}"),
    ].join("\n"),
  ),
  P("## 2. PRODUCT DETAILS, QUANTITY & COMMERCIAL TERMS"),
  P(
    [
      row("Commodity Name & Grade", "{{productLine}}"),
      row("Harmonized System (HS) Code", "{{hsCode}}"),
      row("Crop / Production Year", "{{cropYear}}"),
      row("Genetic & Purity Standard", "{{purityCompliance}}"),
      row("MRL & Import Compliance", "Must strictly comply with Codex Alimentarius, Maximum Residue Limits (MRL), and Port Authority / import regulations at Port of Delivery ({{importStandards}})"),
      row("Country of Origin", "{{origin}}"),
      row("Contract Type & Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (± 5% tolerance per UCP 600 Art. 30)"),
      row("Delivery Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}} — {{destinationPort}}"),
      row("Port of Loading", "{{loadingPort}}"),
      row("Port of Discharge (Destination)", "{{destinationPort}}"),
      row("Unit Price", "{{unitPrice}} per Metric Ton {{incoterm}}"),
      row("Tranche Value", "{{trancheValue}}"),
      row("Total Contract Value", "{{totalValue}}"),
      row("Estimated Time of Arrival (ETA)", "Within {{etaDays}} calendar days following receipt and acceptance of operative banking instrument"),
    ].join("\n"),
  ),
  P("## 3. FINAL CONSIGNEE / NOTIFY PARTY DESIGNATION"),
  P(
    [
      row("Consignee / Receiver Name", "{{consigneeCompany}}"),
      row("Contact Person", "{{consigneeContact}}"),
      row("Delivery / Registered Address", "{{consigneeAddress}}"),
      row("Tax / VAT / Importer ID", "{{consigneeVat}}"),
      row("Telephone / Email", "{{consigneePhone}} | {{consigneeEmail}}"),
    ].join("\n"),
  ),
  P("## 4. PAYMENT TERMS & BANKING COORDINATES (ICC UCP 600)"),
  P(
    [
      row("Buyer's Issuing Bank", "{{issuingBank}}"),
      row("Seller's Advising / Receiving Bank", "{{sellerBankName}}, {{sellerBankAddress}}, {{sellerBankSwift}}"),
      row("Seller Beneficiary Account / IBAN", "{{sellerName}} | Account / IBAN: {{sellerBankAccount}}"),
    ].join("\n"),
  ),
  P(
    [
      "**Bank-Compliant Payment & Guarantee Conditions**",
      row(
        "Payment Method",
        "100% payable via an Irrevocable Documentary Letter of Credit (LC) issued via SWIFT MT700 (or Transferred LC via SWIFT MT720 pursuant to ICC UCP 600 Article 38), payable 100% at sight via SWIFT MT103 against compliant presentation of stipulated original shipping documents at the counters of the Nominated/Advising Bank.",
      ),
      row(
        "Governing Banking Rules & Examination",
        "Subject to ICC Publication No. 600 (UCP 600). Pursuant to UCP 600 Article 14(b), banks shall have a maximum of five (5) banking days following presentation to determine document compliance.",
      ),
      row(
        "Performance Guarantee (PB)",
        "The Seller/Supplier shall issue an operative Performance Bond equal to {{performanceBondPercent}} of the tranche/contract value via SWIFT MT760 within five (5) banking days after execution of the SPA / receipt of operative LC.",
      ),
    ].join("\n"),
  ),
  P("## 5. INSPECTION, COMPLIANCE & LIABILITY"),
  P(
    [
      row("Independent Pre-Shipment Inspection", "Quality, quantity, weight, and packing shall be inspected and certified at the Port of Loading by {{inspection}} at Seller's expense, plus on-site pre-shipment inspection upon Buyer's request."),
      row(
        "Destination Port & Customs Compliance",
        "Seller guarantees strict compliance with destination country import, sanitary, pesticide, and MRL regulations ({{importStandards}}). If cargo fails destination customs or port authority inspection due to quality non-conformity, packing list errors, or unauthenticated/discrepant documents, the Buyer and Final Receiver shall bear zero liability for rejection, return, demurrage, or storage costs, which shall be solely for Seller's account.",
      ),
    ].join("\n"),
  ),
  P("## 6. NON-DISCLOSURE, NON-CIRCUMVENTION & NON-CONTACT (10 YEARS)"),
  P(
    [
      "The Seller/Supplier hereby irrevocably agrees that all information relating to Finekarts Incorporated, its Consignee, End Buyer, representatives, financial institutions, logistics providers, pricing, volumes, and transaction structure constitutes strictly confidential proprietary trade secrets. For a period of ten (10) years from the date of this ICPO, the Seller/Supplier, its affiliates, directors, officers, employees, and agents shall not directly or indirectly:",
      "1. Contact, communicate, solicit, negotiate, or transact with the Buyer's Consignee, End Buyer, or any affiliated party introduced or disclosed through this transaction without Finekarts Incorporated's prior written consent;",
      "2. Bypass, circumvent, or attempt to bypass Finekarts Incorporated in any manner whatsoever, including through agents, brokers, intermediaries, shipping lines, or third parties;",
      "3. Disclose or utilize any confidential information obtained hereunder for any purpose other than executing this transaction.",
      "Any breach or attempted breach entitles Finekarts Incorporated to immediate injunctive relief, liquidated damages of not less than USD {{liquidatedDamages}} per occurrence or full loss of profit (whichever is greater), plus full legal and ICC arbitration costs.",
    ].join("\n"),
  ),
  P("## 7. STIPULATED DOCUMENTS REQUIRED FROM SELLER (UCP 600)"),
  P(
    "The Seller shall present the following original documents in English through bank-to-bank channels under UCP 600 (and courier copies within five (5) working days after shipment to Finekarts Incorporated's Courier Office at {{documentsAddress}}):\n{{requiredDocuments}}",
  ),
  P("## 8. CORPORATE AUTHORIZATION & EXECUTION"),
  P(
    [
      "**ISSUED BY BUYER / APPLICANT — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Corporate Seal:",
      "{{buyerSignature}}",
      row("Name", "{{buyerContact}}"),
      row("Title", "{{buyerTitle}}"),
      row("Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Tel / Email", "+1 (416) 985-8772 | info@finekarts.com"),
      row("Date", "{{date}}"),
      "",
      "**ACKNOWLEDGED & ACCEPTED BY SELLER / SUPPLIER:**",
      "Authorized Signature & Corporate Seal: ____________________",
      row("Company Name", "{{sellerName}}"),
      row("Authorized Signatory", "{{sellerRepresentative}} ({{sellerTitle}})"),
      "Date: ____________________",
    ].join("\n"),
  ),
];

// ---------------------------------------------------------------------------------------------
// Supplier-portal PSA (prepared by the supplier, signed by both parties)
// ---------------------------------------------------------------------------------------------
export const SUPPLIER_PSA_SKELETON_BLOCKS: SkeletonBlock[] = [
  P(SUPPLIER_LETTERHEAD),
  P("[center] # SALES AND PURCHASE AGREEMENT (PSA)"),
  P("[center] Master Sales and Purchase Agreement • Governed by ICC UCP 600 & Incoterms® 2020"),
  P(
    [
      row("Contract Reference No.", "{{psaRef}}"),
      row("Date of Execution", "{{date}}"),
      row("Governing Rules", "ICC UCP 600 & Incoterms® 2020"),
      row("Associated Finekarts ICPO", "{{icpoRef}}"),
    ].join("\n"),
  ),
  P("This Sales and Purchase Agreement (\"PSA\" or \"Contract\") is entered into and made effective as of {{date}}, by and between:"),
  P("## 1. PARTIES TO THE CONTRACT"),
  P(
    [
      "**BUYER / APPLICANT**",
      row("Company Name", "Finekarts Incorporated"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Courier Address", "169 Kingswood Drive, Brampton, ON L6V 3B2, Canada"),
      row("Authorized Signatory", "{{buyerContact}}"),
      row("Telephone / Email", "+1 (416) 985-8772 | info@finekarts.com"),
    ].join("\n"),
  ),
  P(["**SELLER / SUPPLIER**", ...SELLER_PARTY].join("\n")),
  P("## 2. COMMODITY, QUANTITY & COMMERCIAL TERMS"),
  P(
    [
      row("Commodity Name", "{{product}}"),
      row("Harmonized System (HS) Code", "{{hsCode}}"),
      row("Grade / Quality Standard", "{{productGrade}}"),
      row("Crop / Production Year", "{{cropYear}}"),
      row("Country of Origin", "{{origin}}"),
      row("Contract Duration", "{{contractDuration}}"),
      row("Total Contract Quantity", "{{quantity}} (± 5% tolerance per UCP 600 Art. 30)"),
      row("Delivery Schedule", "{{shipmentSchedule}}"),
      row("Packaging", "{{packaging}}"),
      row("Delivery Terms (Incoterms® 2020)", "{{incoterm}} — {{destinationPort}}"),
      row("Port of Loading & Discharge", "Loading: {{loadingPort}} | Discharge: {{destinationPort}}"),
      row("Unit Price & Total Value", "{{unitPrice}} per MT | Total Contract / Tranche Value: {{totalValue}}"),
    ].join("\n"),
  ),
  P("## 3. SUPPLIER BANKING COORDINATES & PAYMENT TERMS (ICC UCP 600)"),
  P(
    [
      "**Supplier's Advising / Receiving Bank Coordinates**",
      row("Supplier's Bank Name & Branch", "{{sellerBankName}}, {{sellerBankAddress}}"),
      row("SWIFT / BIC Code", "{{sellerBankSwift}}"),
      row("Beneficiary Account Name & IBAN", "{{sellerName}} | Account / IBAN: {{sellerBankAccount}}"),
    ].join("\n"),
  ),
  P(
    [
      row(
        "Payment Instrument",
        "100% payable via an Irrevocable Documentary Letter of Credit (LC) issued via SWIFT MT700 (or Transferred LC via SWIFT MT720 pursuant to ICC UCP 600 Article 38) by Buyer's Issuing Bank, governed by ICC Publication No. 600 (UCP 600), payable 100% at sight via SWIFT MT103 against compliant presentation of stipulated original shipping documents at the counters of the Nominated/Advising Bank.",
      ),
      row(
        "SWIFT Examination & Performance Bond",
        "All interbank messaging shall adhere to ISO 15022 / ISO 20022 standards. Pursuant to UCP 600 Article 14(b), banks shall have a maximum of five (5) banking days following presentation to determine document compliance. Seller's Bank shall issue an operative Performance Bond equal to {{performanceBondPercent}} of the tranche value via SWIFT MT760 within five (5) banking days after receipt of Buyer's operative LC.",
      ),
    ].join("\n"),
  ),
  P("## 3.1 ANTI-AMENDMENT & BANK COMPLIANCE PROTOCOL"),
  P(
    "To ensure absolute bank compliance under ICC UCP 600 and eliminate the necessity for costly post-issuance LC amendments, the Buyer and Seller agree to build structural elasticity directly into the operative LC instructions: (a) Quantity and amount tolerances shall include standard UCP 600 Article 30 phrasing (\"about\" or ±5% allowed); (b) Port of loading shall permit approved regional ports; and (c) Third-party shipping documents (excluding the Commercial Invoice) shall be accepted in accordance with UCP 600.",
  ),
  P("## 4. INSPECTION, WEIGHT & DESTINATION PORT COMPLIANCE"),
  P(
    "Quality, quantity, weight, and condition of the cargo shall be inspected, tested, and certified at the Port of Loading by an independent international surveyor (**{{inspection}}**) at Seller's expense. Seller guarantees strict compliance with destination country import, sanitary, pesticide, and Maximum Residue Limit (MRL) standards. If cargo fails destination customs or port authority inspection due to quality non-conformity, packing errors, or discrepant documentation, Finekarts Incorporated and its designated consignee shall bear zero liability for rejection, return, or demurrage, which shall be solely for Seller's account.",
  ),
  P("## 5. LOGISTICS CONTROL & END-BUYER / CONSIGNEE ISOLATION"),
  P(
    "Where Finekarts Incorporated arranges freight or designates a final consignee/notify party, the Seller acknowledges that Finekarts Incorporated's end-buyers, consignees, distribution channels, and logistics partners constitute proprietary commercial assets. Seller shall issue neutral, unbranded export packaging unless otherwise instructed in writing by Finekarts Incorporated and shall transmit all original shipping documents strictly through banking channels and Finekarts Incorporated's designated courier office.",
  ),
  P("## 6. STRICT CONFIDENTIALITY & TEN (10) YEAR NON-CIRCUMVENTION"),
  P(
    "The Seller/Supplier acknowledges and agrees that the identity, location, contacts, and commercial terms of Finekarts Incorporated's end-buyers, consignees, financial institutions, and logistics providers constitute highly sensitive trade secrets and proprietary confidential business information belonging exclusively to Finekarts Incorporated. The Seller/Supplier, its affiliates, directors, officers, employees, and agents strictly covenant and agree that for a period of exactly TEN (10) YEARS from the date of execution of this Contract, the Seller/Supplier shall not directly or indirectly inquire about, discover, contact, communicate, negotiate, partner, or do business with any end-buyer, consignee, receiver, or affiliated party introduced, disclosed, or implied through this Contract, whether directly, indirectly, through third parties, agents, brokers, shipping lines, or in any shape or form whatsoever. Any breach or attempted breach entitles Finekarts Incorporated to immediate injunctive relief, full recovery of lost profits, and liquidated damages of not less than USD {{liquidatedDamages}} per occurrence or full recovery of all diverted transaction values, whichever is greater.",
  ),
  P("## 7. FORCE MAJEURE"),
  P(
    "Neither Party shall be held liable for any failure or delay in the fulfillment of its contractual obligations if such failure or delay is caused by events beyond its reasonable control, including but not limited to acts of God, war, hostilities, civil commotion, government embargoes, export/import restrictions, pandemics, strikes, lockouts, or severe maritime disruptions (\"Force Majeure\"). The affected Party shall notify the other Party in writing within seven (7) calendar days of the occurrence of such event. If a Force Majeure event persists for more than sixty (60) consecutive days, either Party may terminate the affected tranche or contract without financial penalty.",
  ),
  P("## 8. GOVERNING LAW & ARBITRATION"),
  P(
    "This Contract shall be governed by, construed, and enforced in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles, and supplemented by ICC Incoterms® 2020 and UCP 600. Any dispute, controversy, or claim arising out of or relating to this Contract, including its formation, breach, termination, or validity, shall be settled definitively by binding arbitration under the Rules of Arbitration of the International Chamber of Commerce (ICC) by one or more arbitrators appointed in accordance with said Rules. The place of arbitration shall be Toronto, Ontario, Canada, and proceedings shall be conducted in the English language.",
  ),
  P("## 9. AUTHORIZED CORPORATE EXECUTION"),
  P(
    [
      "**FOR BUYER / APPLICANT — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Seal:",
      "{{buyerSignature}}",
      row("Name", "{{buyerContact}}"),
      row("Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Date", "{{date}}"),
      "",
      "**FOR SELLER / SUPPLIER — {{sellerName}}:**",
      "Authorized Signature & Seal: ____________________",
      row("Name", "{{sellerRepresentative}}"),
      row("Title", "{{sellerTitle}}"),
      "Date: ____________________",
    ].join("\n"),
  ),
];

// ---------------------------------------------------------------------------------------------
// Supplier-portal LC wording (SWIFT MT700, Finekarts is the applicant)
// ---------------------------------------------------------------------------------------------
export const SUPPLIER_LC_WORDING_SKELETON_BLOCKS: SkeletonBlock[] = [
  P(FINEKARTS_LETTERHEAD),
  P("[center] # BANK-COMPLIANT SUPPLIER LETTER OF CREDIT WORDING"),
  P("[center] Standardized SWIFT MT700 Template (Finekarts Incorporated as Buyer / Applicant) • ICC UCP 600"),
  P(
    [
      row("Associated SPA / ICPO Ref.", "{{psaRef}}"),
      row("Governing Rules", "ICC UCP 600 Revision (2007)"),
      row("Buyer / Applicant", "Finekarts Incorporated (Canada)"),
      row("Beneficiary (Supplier)", "{{sellerName}}"),
    ].join("\n"),
  ),
  P(
    "This standardized SWIFT MT700 Documentary Letter of Credit Wording sets out the exact, bank-compliant LC text that Finekarts Incorporated's Issuing Bank will transmit to the Supplier's Advising Bank upon execution of the Sales and Purchase Agreement (SPA). It is the proposed wording only. It is not the Letter of Credit.",
  ),
  P("## STANDARDIZED SWIFT MT700 STRUCTURE & FIELD INSTRUCTIONS (FIELDS 27 – 44C)"),
  P(
    [
      field(":27:", "SEQUENCE OF TOTAL: 1/1"),
      field(":40A:", "FORM OF DOCUMENTARY CREDIT: {{lcForm}}"),
      field(":20:", "DOCUMENTARY CREDIT NUMBER: {{lcNumber}}"),
      field(":31C:", "DATE OF ISSUE: {{lcIssueDate}}"),
      field(":40E:", "APPLICABLE RULES: UCP LATEST REVISION (ICC UCP 600)"),
      field(":31D:", "DATE AND PLACE OF EXPIRY: {{lcExpiryDate}} IN {{lcExpiryCountry}}"),
      field(":50:", "APPLICANT (BUYER): FINEKARTS INCORPORATED, 4275 VILLAGE CENTER COURT, MISSISSAUGA, ON L4Z 1S2, CANADA, TEL: +1 (416) 985-8772 | EMAIL: INFO@FINEKARTS.COM"),
      field(":59:", "BENEFICIARY (SELLER / SUPPLIER): {{sellerName}}, {{sellerAddress}}, {{supplierRegNumber}}"),
      field(":32B:", "CURRENCY CODE, AMOUNT: USD {{trancheValue}}"),
      field(":39A:", "PERCENTAGE CREDIT AMOUNT TOLERANCE: +/- 05/05 (UP TO 5% MORE OR LESS PER UCP 600 ART. 30)"),
      field(":41A:", "AVAILABLE WITH... BY...: {{sellerBankName}}, {{sellerBankSwift}} BY PAYMENT AT SIGHT"),
      field(":43P:", "PARTIAL SHIPMENTS: {{partialShipments}}"),
      field(":43T:", "TRANSSHIPMENT: {{transshipment}}"),
      field(":44E:", "PORT OF LOADING / AIRPORT OF DEPARTURE: {{loadingPort}}"),
      field(":44F:", "PORT OF DISCHARGE / AIRPORT OF DESTINATION: {{destinationPort}}"),
      field(":44C:", "LATEST DATE OF SHIPMENT: {{latestShipmentDate}}"),
    ].join("\n"),
  ),
  P("## CONTINUATION: SWIFT MT700 FIELDS 45A – 49"),
  P(
    [
      field(
        ":45A:",
        "DESCRIPTION OF GOODS AND/OR SERVICES: {{productLineUpper}}. HS CODE: {{hsCode}}. CROP/PRODUCTION YEAR: {{cropYear}}. QUANTITY: {{quantity}} (+/- 5% tolerance per UCP 600 Article 30). UNIT PRICE: {{unitPrice}} PER METRIC TON. INCOTERMS® 2020: {{incoterm}} {{destinationPort}}. NON-SANCTIONED ORIGIN.",
      ),
      field(":46A:", "DOCUMENTS REQUIRED:"),
      "{{lcDocuments}}",
      field(":47A:", "ADDITIONAL CONDITIONS:"),
      "A. THIS DOCUMENTARY CREDIT IS ISSUED SUBJECT TO ICC UCP 600 REVISION.",
      "B. ALL DOCUMENTS MUST BE ISSUED IN ENGLISH AND STRICTLY COMPLY WITH UCP 600 ARTICLE 14.",
      "C. THIRD-PARTY DOCUMENTS (EXCLUDING COMMERCIAL INVOICE AND DRAFTS) ARE ACCEPTABLE.",
      "D. DOCUMENTS PRESENTED WITHIN 21 DAYS AFTER BILL OF LADING DATE BUT WITHIN LC EXPIRY ARE ACCEPTABLE.",
      field(":71B:", "CHARGES: ALL BANKING CHARGES OUTSIDE ISSUING BANK ARE FOR BENEFICIARY'S ACCOUNT."),
      field(":48:", "PERIOD FOR PRESENTATION: 21 DAYS AFTER SHIPPING DATE."),
      field(":49:", "CONFIRMATION INSTRUCTIONS: {{confirmationInstructions}}"),
    ].join("\n"),
  ),
  P("## SUPPLIER BANKING COORDINATES & VERIFICATION SIGN-OFF"),
  P(row("Supplier Advising Bank SWIFT BIC", "{{sellerBankSwift}} | Account / IBAN: {{sellerBankAccount}}")),
  P(
    [
      "**COMPLETED & CONFIRMED BY SELLER / SUPPLIER:**",
      "Authorized Signature & Corporate Seal: ____________________",
      row("Company Name", "{{sellerName}}"),
      row("Signatory Name & Title", "{{sellerRepresentative}} ({{sellerTitle}})"),
      "Date: ____________________",
      "",
      "**REVIEWED & ACCEPTED BY BUYER / APPLICANT:**",
      "Authorized Signature & Corporate Seal: ____________________",
      row("Company Name", "Finekarts Incorporated"),
      row("Authorized Signatory", "{{buyerContact}}"),
      "Date: ____________________",
    ].join("\n"),
  ),
];

// ---------------------------------------------------------------------------------------------
// Supplier-portal Proforma Invoice (issued by the supplier after the SPA is signed)
// ---------------------------------------------------------------------------------------------
export const SUPPLIER_PROFORMA_SKELETON_BLOCKS: SkeletonBlock[] = [
  P(SUPPLIER_LETTERHEAD),
  P("[center] # PROFORMA INVOICE"),
  P("[center] Post-SPA Operational Instrument Issued to Finekarts Incorporated • Governed by ICC UCP 600 & Incoterms® 2020"),
  P(
    [
      row("Proforma Invoice No.", "{{proformaNumber}}"),
      row("Date of Issuance", "{{date}}"),
      row("Associated SPA Ref.", "{{psaRef}}"),
      row("Payment Terms", "Irrevocable LC / Transferred LC (ICC UCP 600)"),
    ].join("\n"),
  ),
  P("## 1. COMMERCIAL PARTIES (AML / KYC)"),
  P(["**SELLER / SUPPLIER (ISSUER)**", ...SELLER_PARTY].join("\n")),
  P(
    [
      "**BUYER / APPLICANT (FINEKARTS INCORPORATED)**",
      row("Company Name", "Finekarts Incorporated"),
      row("Registered Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      row("Courier Address", "169 Kingswood Drive, Brampton, ON L6V 3B2, Canada"),
      row("Authorized Signatory", "{{buyerContact}}"),
      row("Telephone / Email", "+1 (416) 985-8772 | info@finekarts.com"),
    ].join("\n"),
  ),
  P("## 2. COMMODITY LINE ITEMS & VALUATION"),
  P(
    [
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
  ),
  P(
    [
      row("Total Invoice Value", "{{totalValue}} ({{amountInWords}})"),
      row("Port of Loading & Discharge", "Loading: {{loadingPort}} | Discharge: {{destinationPort}}"),
    ].join("\n"),
  ),
  P("## 3. SELLER'S ADVISING / RECEIVING BANK COORDINATES (LC INSTRUCTIONS)"),
  P(
    [
      "**Supplier's Advising / Receiving Bank Details for SWIFT MT700 / MT720**",
      ...SELLER_BANK.slice(0, 3),
      row("Beneficiary Name & Account", "{{sellerName}} | Account / IBAN: {{sellerBankAccount}}"),
    ].join("\n"),
  ),
  P("## 4. OPERATIONAL INSTRUCTIONS & UCP 600 COMPLIANCE"),
  P(
    [
      row(
        "Letter of Credit Issuance",
        "Pursuant to the executed SPA, Buyer's (Finekarts Incorporated) Issuing Bank shall transmit the operative Irrevocable Documentary Letter of Credit (SWIFT MT700) — or Transferred LC (SWIFT MT720) under ICC UCP 600 Article 38 — payable at sight against compliant presentation of stipulated original shipping documents.",
      ),
      row(
        "Bank Compliance Guarantee",
        "This Proforma Invoice is expressly formatted and structured for direct presentation to issuing and advising banks under ISO 15022 / ISO 20022 standards. All descriptions, pricing structures, unit metrics, and UCP 600 terms mirror the underlying SPA verbatim to prevent any discrepancies during bank document examination under UCP 600 Article 14.",
      ),
      row(
        "End-Buyer Confidentiality & 10-Year Non-Circumvention",
        "All shipping documents, neutral packaging, and consignee routing instructions must strictly comply with the SPA, and the Seller remains bound by the 10-year non-circumvention covenant protecting Finekarts Incorporated's end-buyers, consignees, and distribution channels.",
      ),
    ].join("\n"),
  ),
  P(
    [
      "**ISSUED BY SELLER / SUPPLIER:**",
      "Authorized Signature & Seal: ____________________",
      row("Company Name", "{{sellerName}}"),
      row("Signatory Name & Title", "{{sellerRepresentative}} ({{sellerTitle}})"),
      row("Date", "{{date}}"),
      "",
      "**ACCEPTED BY BUYER — FINEKARTS INCORPORATED:**",
      "Authorized Signature & Seal: ____________________",
      row("Name", "{{buyerContact}}"),
      row("Address", "4275 Village Center Court, Mississauga, ON L4Z 1S2, Canada"),
      "Date: ____________________",
    ].join("\n"),
  ),
];
