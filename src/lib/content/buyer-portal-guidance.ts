/** Copy for buyer portal only (registration, CIS, PO / ICPO / LOI). */

export const BUYER_PROFILE_MAINTENANCE_DISCLAIMER =
  "Your company profile is stored after registration. If your company name, registered address, ownership, or primary contact details change, you must update your Corporate Information Sheet (CIS) promptly. Outdated information may delay trade desk review, banking, or shipment documentation.";

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
  "Payment structure must match an admin-enabled term (e.g. Irrevocable LC at sight, SBLC, or agreed ICC structure).",
  "LC wording and required shipping documents should align with the PSA before bank presentation.",
  "Mismatched Incoterms, ports, or quantities between ICPO and payment instructions cause avoidable delays.",
];

export const BUYER_ICPO_LEGAL_WARNING =
  "Submitting an Irrevocable Corporate Purchase Order (ICPO) is a serious commercial step. Finekarts prefers to discuss volume, specification, Incoterms, and payment structure with you before you treat an ICPO as final. Nothing on this portal is a binding offer or acceptance until a Sales Purchase Agreement (PSA) is issued and executed per its terms.";

export const BUYER_LOI_REVIEW_NOTICE =
  "You uploaded a Letter of Intent (LOI). An LOI is non-binding and does not oblige either party to proceed. Review typically takes longer because specifications, payment, and logistics are discussed from scratch.";

export const BUYER_ICPO_REVIEW_NOTICE =
  "Your ICPO has been submitted for review. Our trade desk will verify key fields against our payment terms and programme rules. If accepted in principle, we will respond with a Sales Purchase Agreement (PSA) incorporating the commercial points from your ICPO.";

export const BUYER_PO_AI_PROMPT_HINT =
  "Ask about ICPO fields, FOB vs CIF, or what must match our payment terms. I cannot provide binding prices, legal advice, or approve your order.";
