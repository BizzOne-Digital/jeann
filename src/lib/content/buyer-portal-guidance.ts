/** Copy for buyer portal only (registration, CIS, PO / ICPO / LOI). */

export const BUYER_PROFILE_MAINTENANCE_DISCLAIMER =
  "Your company profile is stored after registration. If your company name, registered address, ownership, or primary contact details change, you must update your Corporate Information Sheet (CIS) promptly. Outdated information may delay trade desk review, banking, or shipment documentation.";

/** PSA = Purchase and Sale Agreement — the contract between buyer and seller. */
export const BUYER_PSA_DEFINITION =
  "The PSA (Purchase and Sale Agreement) is the binding contract between the buyer and the seller. Portal submissions and ICPOs are not the contract until a PSA is issued, signed, and stamped by both parties.";

export const BUYER_TRADE_DOCUMENT_FLOW = [
  {
    step: "1",
    title: "ICPO or LOI",
    body:
      "You submit an Irrevocable Corporate Purchase Order (ICPO) or, optionally, a non-binding Letter of Intent (LOI).",
  },
  {
    step: "2",
    title: "PSA — contract",
    body:
      "After review, Finekarts issues a PSA for signature. The PSA is the sale contract between buyer and seller.",
  },
  {
    step: "3",
    title: "Proforma Invoice (PI)",
    body:
      "After the PSA is signed and stamped, Finekarts provides a Proforma Invoice — a pre-shipment specification document, not a demand for payment.",
  },
  {
    step: "4",
    title: "Payment",
    body:
      "For Letter of Credit (LC) transactions, your bank drafts the credit using the PSA and PI. For Telegraphic Transfer (TT), payment follows the contract and PI; LC bank wording does not apply.",
  },
] as const;

export const BUYER_PI_TRANSFER_TRANSACTION_NOTE =
  "In a transfer transaction (for example transferable LC or switch structures), the buyer may request a Proforma Invoice, but a PI is not required by regulation. Finekarts will provide a PI when requested or when commercially appropriate.";

export const BUYER_ICPO_REQUIRED_FIELDS = [
  "Legal buyer company name (matching registration)",
  "Product name(s) and total quantity in metric tons (MT)",
  "Port of discharge / destination port",
  "Incoterms — FOB or CIF as agreed with Finekarts",
  "Price per MT (currency as stated on the ICPO)",
  "Product specification (grade, quality, or reference standard)",
  "Packaging type (FIBC, flexitank, bulk vessel, drums, etc.)",
  "Authorized signatory and company stamp where your jurisdiction requires it",
];

export const BUYER_PAYMENT_ALIGNMENT_HINTS = [
  "Payment structure must match an enabled payment term (e.g. Irrevocable LC at sight, SBLC, or agreed ICC structure).",
  "LC wording and required shipping documents should align with the PSA contract before bank presentation.",
  "Mismatched Incoterms, ports, or quantities between ICPO and payment instructions cause avoidable delays.",
  "TT (wire) transactions use different payment terms than LC-backed deals.",
];

export const BUYER_ICPO_LEGAL_WARNING =
  "Submitting an Irrevocable Corporate Purchase Order (ICPO) is a serious commercial step. Finekarts prefers to discuss volume, specification, Incoterms, and payment structure with you before you treat an ICPO as final. Nothing on this portal is a binding contract until a Purchase and Sale Agreement (PSA) is issued, signed, and stamped by both parties.";

export const BUYER_LOI_REVIEW_NOTICE =
  "You uploaded a Letter of Intent (LOI). An LOI is non-binding and does not oblige either party to proceed. Review typically takes longer because specifications, payment, and logistics are discussed from scratch.";

export const BUYER_ICPO_REVIEW_NOTICE =
  "Your ICPO has been submitted for review. Our trade desk will verify key fields against our payment terms and the requirements of the future PSA contract. If accepted in principle, we will respond with a Purchase and Sale Agreement (PSA) incorporating the commercial points from your ICPO.";

export const BUYER_PO_AI_PROMPT_HINT =
  "Ask about ICPO fields, FOB vs CIF, PSA contract steps, or what must match our payment terms. I cannot provide binding prices, legal advice, or approve your order.";

/** Shown under "Product specification" on the buyer ICPO form and printed on generated ICPO PDFs. */
export const ICPO_SPECIFICATION_NOTE =
  "Note: Indicative commercial specifications only. Final quality parameters and tolerances must be confirmed by the supplier's Certificate of Analysis (CoA), applicable standards, and signed SPA.";
