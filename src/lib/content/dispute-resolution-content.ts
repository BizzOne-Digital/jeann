/** Trade assurance and dispute handling — educational summary, not legal advice. */

export const DISPUTE_HERO = {
  eyebrow: "Trade assurance",
  title: "How we handle disagreements",
  description:
    "Bulk trade depends on clear contracts, independent inspection where agreed, and disciplined banking. This page summarises our approach when parties disagree — always subject to the signed PSA/SPA and applicable ICC rules.",
  primaryCta: { href: "/contact", label: "Contact trade desk →" },
  secondaryCta: { href: "/resources#resources-hub", label: "Banking & programmes" },
};

export const DISPUTE_FAIRNESS = {
  eyebrow: "Our approach",
  title: "Commercial resolution first",
  lead:
    "Finekarts sells bulk commodities through documented programmes. We expect disputes to be rare when specifications, Incoterms, and payment instruments are agreed upfront.",
  paragraphs: [
    "When a difference arises, we begin with a structured commercial review: contract terms, inspection results, transport papers, and bank messages. The goal is a practical outcome without unnecessary delay.",
    "If the agreement references ICC rules — such as UCP 600 for documentary credits, ISP98 for standby instruments, or agreed arbitration clauses — those frameworks guide how banks and tribunals assess the matter.",
    "Where parties cannot align, the PSA/SPA sets the path forward, which may include ICC arbitration or courts of competent jurisdiction. This summary does not replace counsel-reviewed contract wording.",
  ],
};

export const DISPUTE_PROCESS_STEPS = [
  {
    title: "Review the file",
    body: "Trade desk and compliance review facts against the signed agreement and shipment record.",
  },
  {
    title: "Written positions",
    body: "Each party may set out its view with reference to specifications, inspection scope, and Incoterms.",
  },
  {
    title: "Contractual forum",
    body: "Unresolved matters proceed as the PSA/SPA provides — arbitration, expert determination, or litigation.",
  },
];

export const DISPUTE_RESPONSIBILITIES = {
  eyebrow: "Roles under contract",
  title: "Seller and buyer obligations",
  lead:
    "Duties and risk transfer follow the PSA/SPA and the Incoterm named in the contract (for example FOB or CIF under ICC Incoterms®). The points below are illustrative only.",
  sellerPoints: [
    "Deliver goods that meet agreed grade, quantity, and packaging within contractual tolerances.",
    "Manage origin handling and loading with attention to product safety through the point defined in the contract.",
    "Issue export and shipping documents required under the Incoterm and any documentary credit.",
    "Under CIF, arrange marine insurance and main carriage to the named port as stated in the SPA.",
    "Support agreed inspection milestones so quality and quantity can be confirmed before departure when that is the commercial structure.",
  ],
  buyerPoints: [
    "Confirm import, unloading, and customs requirements at destination before signing — and reflect them in the PSA or LC document list.",
    "Provide acceptable payment instruments from an approved bank according to the commercial schedule.",
    "Take delivery and clear goods when risk and cost pass under the Incoterm.",
    "Give timely notice of any claim in line with inspection and notice clauses.",
    "Participate in good-faith resolution and, if required, in arbitration or court proceedings as agreed.",
  ],
  riskTransferNote:
    "Risk generally passes at the point defined by the Incoterm. Insurance and inspection support the transaction but do not by themselves shift risk — the contract and Incoterms do.",
};

export const DISPUTE_QUALITY_SAFETY = {
  eyebrow: "Quality & safety",
  title: "Stewardship of the cargo",
  lead:
    "Specifications are agreed in the PSA, not implied from marketing copy. Handling and food-safety expectations are aligned to corridor rules and certificates stated in contract.",
  bullets: [
    "Grades and claims refer to agreed specifications and inspection scope.",
    "Independent inspection confirms quality and quantity only when contracted — it is never assumed by default.",
    "Phytosanitary and regulatory certificates are mapped to destination requirements during deal structuring.",
  ],
};

export const DISPUTE_DOCUMENTATION = {
  eyebrow: "Documentation",
  title: "Export papers and destination clearance",
  lead:
    "Finekarts coordinates the documentation it is responsible for under the contract so cargo can leave origin in compliance with export and transport rules.",
  body:
    "Destination clearance remains the buyer’s responsibility unless the SPA states otherwise. Importers should confirm permits, pre-arrival filings, and unloading constraints before execution. Early alignment reduces detention and demurrage risk at discharge ports.",
};

export const DISPUTE_PARTNERS = {
  eyebrow: "Specialist network",
  title: "Inspection, logistics, and insurance",
  lead:
    "We coordinate with established inspection firms, carriers, and insurers suited to bulk commodity corridors.",
  body:
    "Carriers, port authorities, and banks act within their own rules; we focus on clear milestones, documentary discipline, and communication when schedules change.",
};

export const DISPUTE_PAYMENTS = {
  eyebrow: "Payments",
  title: "Bankable structures for each programme",
  lead:
    "Payment mechanics are agreed per transaction — from a single trial shipment to twelve- or twenty-four-delivery contracts. Details and comparison tables are on Resources.",
  paragraphs: [
    "Short programmes often use an Irrevocable Documentary LC at Sight. Longer schedules may use an Irrevocable Transferable Revolving LC at Sight under a single facility, with drawing limits tied to shipment calendars where the buyer requires them.",
    "Larger or longer exposures may include an Irrevocable SBLC as contractual security. Escrow is considered only where jurisdiction and bank policy support it.",
    "Presentation follows the LC: the buyer’s bank examines documents and honours the credit when terms are met. Credits are accepted from institutions on our approved list after compliance review.",
  ],
  resourcesHref: "/resources#resources-hub",
};

export const DISPUTE_CTA = {
  title: "Start with a clear mandate",
  lead:
    "Share product, volume, destination, and preferred Incoterm. Signed-in buyers may submit a purchase request through the portal.",
  primary: { href: "/login", label: "Buyer portal" },
  secondary: { href: "/products", label: "Browse products" },
};

export const DISPUTE_DISCLAIMER =
  "This page is a general description of Finekarts’ trade-assurance practices. It is not legal, insurance, or tax advice. Rights and obligations are defined only in signed contracts and banking instruments.";
