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
    structure: "LC at Sight",
    primaryFunction: "Payment",
    iccCode: "UCP 600",
    buyerProtection: 5,
    sellerProtection: 5,
    recommended: true,
    enabledByDefault: true,
  },
  {
    id: "lc-at-sight-sblc",
    structure: "LC at Sight + SBLC",
    primaryFunction: "Payment + backup security",
    iccCode: "UCP 600 / ISP98",
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
    body: "For long-term contracts, the Buyer may additionally provide an Irrevocable Standby Letter of Credit (SBLC) in favor of the Seller as contractual security, subject to ISP98, unless otherwise agreed in writing.",
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
  "For Finekarts-style 12-month commodity programmes, Irrevocable LC at Sight with SBLC backup is often positioned as the preferred structure, while BG, D/P, D/A, and T/T remain alternative structures only when specifically negotiated.";

export const SWIFT_INSTRUMENT_NOTE =
  "MT700, MT760, MT103, and similar references are SWIFT message types — not separate banking instruments. The underlying instrument (LC, SBLC, guarantee, or payment) creates the relevant legal and banking undertaking. SWIFT describes FIN as a service for exchanging MT-format financial messages.";
