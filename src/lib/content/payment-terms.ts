export type PaymentTermStructure = {
  id: string;
  structure: string;
  primaryFunction: string;
  iccCode: string;
  buyerProtection: 1 | 2 | 3 | 4 | 5;
  sellerProtection: 1 | 2 | 3 | 4 | 5;
  /** Suggested default for 12-month commodity programmes */
  recommended?: boolean;
  /** Enabled for buyer selection when admin has not saved config yet */
  enabledByDefault?: boolean;
};

export type BankingClause = {
  title: string;
  body: string;
};

/** Full catalog — admin enables structures suitable per transaction programme. */
export const PAYMENT_TERM_STRUCTURES: PaymentTermStructure[] = [
  {
    id: "lc-at-sight",
    structure: "Irrevocable LC at Sight",
    primaryFunction: "Payment",
    iccCode: "UCP 600",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
    enabledByDefault: true,
  },
  {
    id: "lc-at-sight-sblc",
    structure: "Irrevocable LC at Sight + SBLC (large transactions)",
    primaryFunction: "Payment + backup security",
    iccCode: "UCP 600 / ISP98",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
    enabledByDefault: true,
  },
  {
    id: "transferable-revolving-lc",
    structure: "Irrevocable Transferable Revolving LC at Sight",
    primaryFunction: "Long-term programme payment",
    iccCode: "UCP 600",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
    enabledByDefault: true,
  },
  {
    id: "confirmed-lc",
    structure: "Confirmed LC",
    primaryFunction: "Payment + bank confirmation",
    iccCode: "UCP 600",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
  },
  {
    id: "lc-performance-guarantee",
    structure: "LC + Performance Guarantee",
    primaryFunction: "Payment + performance security",
    iccCode: "UCP 600 / URDG 758",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
  },
  {
    id: "sblc-only",
    structure: "SBLC only",
    primaryFunction: "Payment / security support",
    iccCode: "ISP98",
    buyerProtection: 3,
    sellerProtection: 4,
  },
  {
    id: "bg",
    structure: "BG",
    primaryFunction: "Contract / payment security",
    iccCode: "URDG 758",
    buyerProtection: 4,
    sellerProtection: 4,
  },
  {
    id: "dp",
    structure: "D/P",
    primaryFunction: "Documents against payment",
    iccCode: "URC 522",
    buyerProtection: 4,
    sellerProtection: 2,
  },
  {
    id: "da",
    structure: "D/A",
    primaryFunction: "Documents against acceptance",
    iccCode: "URC 522",
    buyerProtection: 2,
    sellerProtection: 2,
  },
  {
    id: "tt-advance",
    structure: "T/T Advance",
    primaryFunction: "Direct payment",
    iccCode: "Commercial Schedule",
    buyerProtection: 1,
    sellerProtection: 5,
  },
  {
    id: "open-account",
    structure: "Open Account",
    primaryFunction: "Deferred payment",
    iccCode: "Commercial Schedule",
    buyerProtection: 5,
    sellerProtection: 1,
  },
  {
    id: "escrow",
    structure: "Escrow",
    primaryFunction: "Conditional payment",
    iccCode: "Escrow Agreement",
    buyerProtection: 4,
    sellerProtection: 4,
  },
];

export function getPaymentTermById(id: string) {
  return PAYMENT_TERM_STRUCTURES.find((item) => item.id === id) ?? null;
}

export const BANKING_CLAUSE_SECTION_TITLE = "Banking and payment instruments";

export const BANKING_CLAUSE_INTRO =
  "For Finekarts large commodity contracts, a PSA/SPA may include a section along the following lines. Wording is illustrative — parties should adapt to jurisdiction, bank requirements, and the commercial schedule.";

export const BANKING_CLAUSES: BankingClause[] = [
  {
    title: "Primary payment instrument",
    body: "The Buyer shall arrange an Irrevocable Documentary Letter of Credit at Sight in favor of the Seller, issued by an acceptable bank and subject to UCP 600.",
  },
  {
    title: "Contract security",
    body: "For long-term contracts and larger transactions, the Buyer may additionally provide an Irrevocable Standby Letter of Credit (SBLC) in favor of the Seller as contractual security, subject to ISP98, unless otherwise agreed in writing.",
  },
  {
    title: "Long-term programmes",
    body: "For 1-year (12 delivery) or 2-year (24 delivery) contracts, payment is commonly structured through an Irrevocable Transferable Revolving Letter of Credit at Sight under UCP 600 — one LC facility for the programme, with drawing limits and shipment triggers stated in the commercial schedule.",
  },
  {
    title: "Buyer control on revolving drawings",
    body: "The Buyer may structure month-to-month drawing limits or shipment-linked availability on the revolving LC so the Seller cannot access undrawn amounts beyond the agreed period — subject to bank wording and the signed SPA.",
  },
  {
    title: "Presentation and payment",
    body: "Shipment documents are presented as agreed in the LC. The Buyer’s bank examines documents against the credit; when compliant, the bank pays in full at sight (or as otherwise stated) — payment discipline stays with the banking instrument, not informal promises.",
  },
  {
    title: "Escrow (where agreed)",
    body: "Escrow may be discussed for selected corridors and buyer locations when banks and compliance support a conditional release structure. It is optional and never assumed without a written escrow agreement.",
  },
  {
    title: "Trade insurance",
    body: "Marine cargo and related trade insurance may be arranged or coordinated as part of the shipment programme (for example under CIF or where otherwise specified in the SPA), with coverage scope, deductibles, and claims handling stated in contract — insurance supports buyer confidence but does not replace inspection, documentation, or payment instrument discipline.",
  },
  {
    title: "Alternative bank guarantee",
    body: "Where agreed, an acceptable Bank Guarantee / Demand Guarantee may be provided, subject to URDG 758 where incorporated.",
  },
  {
    title: "Documentary collection",
    body: "Where expressly agreed, payment may be conducted by D/P or D/A documentary collection, subject to URC 522.",
  },
  {
    title: "T/T",
    body: "Where expressly agreed, payment may be made by bank transfer according to the payment schedule specified in the Commercial Schedule.",
  },
  {
    title: "SWIFT",
    body: "Where applicable, banking instruments and payment instructions may be transmitted through authenticated bank-to-bank messaging channels. SWIFT messaging shall not itself alter the underlying contractual obligations or constitute proof of payment unless the relevant bank confirms the applicable transaction.",
  },
  {
    title: "Bank charges",
    body: "Each Party shall bear the banking charges allocated to it in the SPA, LC, SBLC, BG, collection instruction, or other applicable banking instrument.",
  },
];

export const PAYMENT_TERMS_INTRO =
  "For the type of transactions commonly discussed in bulk commodity trade, structures are often ranked by how they balance payment certainty with performance risk. Ratings below are indicative — final suitability depends on contract wording, bank approval, corridor, and counterparty diligence.";

export const PREFERRED_PAYMENT_STRUCTURE =
  "Finekarts structures bankable programmes around Irrevocable Documentary LC at Sight (UCP 600), Irrevocable Transferable Revolving LC at Sight for 12- or 24-delivery contracts, and Irrevocable SBLC backup for larger transactions (ISP98). Escrow may be available depending on buyer location and bank support. All instruments follow ICC rules; alternatives such as BG, D/P, D/A, or T/T apply only when expressly negotiated.";

export const TRANSACTION_PROGRAMME_TYPES = [
  {
    id: "trial",
    title: "Trial order",
    deliveries: "1 shipment",
    summary:
      "A one-time order to validate specification, inspection results, logistics, and banking workflow before committing to a 12- or 24-delivery programme.",
    typicalPayment: "Irrevocable LC at Sight (and SBLC where volume warrants backup security).",
  },
  {
    id: "12-month",
    title: "1-year contract",
    deliveries: "12 deliveries",
    summary:
      "Monthly or agreed cadence over twelve shipments under one PSA/SPA — suited to refiners and distributors with steady demand.",
    typicalPayment: "Irrevocable Transferable Revolving LC at Sight covering the programme.",
  },
  {
    id: "24-month",
    title: "2-year contract",
    deliveries: "24 deliveries",
    summary:
      "Twenty-four scheduled shipments under one commercial framework — often paired with SBLC backup and strict documentary discipline.",
    typicalPayment: "Irrevocable Transferable Revolving LC at Sight with programme-wide facility.",
  },
] as const;

export const REVOLVING_LC_PROGRAMME_NOTE =
  "Multi-delivery contracts typically use one Irrevocable Transferable Revolving LC at Sight for the entire transaction. The Buyer can limit how much of the facility the Seller may draw each month, aligning LC availability with agreed shipment schedules. Each presentation is supported by shipment documents examined by the Buyer’s bank; compliant presentations are paid in full at sight unless the credit states otherwise.";

export const ESCROW_LOCATION_NOTE =
  "Escrow is not offered on every corridor. Where buyer jurisdiction, banks, and compliance allow, an escrow structure may be agreed as an alternative to documentary credit — terms are deal-specific.";

export const BUYER_DATA_SECURITY_NOTE =
  "Buyer and counterparty data shared with Finekarts — company profiles, banking messages, and portal submissions — is handled with access controls, encrypted transport, and least-privilege staff access. We do not sell customer data. Details appear in our Privacy Policy.";

export const LC_INSTRUMENTS_HIGHLIGHT =
  "Irrevocable LC at Sight · Irrevocable Transferable Revolving LC at Sight · SBLC backup for large programmes · Escrow where location and banks support it.";

export const LC_ACCEPTED_BANKS_NOTE =
  "Documentary credits are accepted from institutions on Finekarts’ approved bank list, including issuers among the world’s top fifty international banks, subject to compliance screening and transaction-specific approval. Payment terms have commercial limits, but alternative structures may be agreed in writing when risk and corridor support them. Additional payment channels will be added over time to facilitate trade.";

export const SWIFT_INSTRUMENT_NOTE =
  "MT700, MT760, MT103, and similar references are SWIFT message types — not separate banking instruments. The underlying instrument (LC, SBLC, guarantee, or payment) creates the relevant legal and banking undertaking. SWIFT describes FIN as a service for exchanging MT-format financial messages.";
