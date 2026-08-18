/** Educational SPA / inspection linkage clauses — not a template contract. */

export const SPA_INSPECTION_CLAUSES = [
  {
    n: 1,
    title: "Appointment of inspector",
    text: "The independent inspection company shall be mutually agreed in writing before loading. Neither buyer nor seller shall appoint an inspector that is an affiliate of either party without disclosure.",
  },
  {
    n: 2,
    title: "Scope of inspection services",
    text: "The contract shall specify whether inspection covers quantity, quality, sampling, loading supervision, vessel/hold cleanliness, laboratory analysis, or a combination — referencing applicable GAFTA, FOSFA, or bespoke methods.",
  },
  {
    n: 3,
    title: "Timing of inspection",
    text: "State whether inspection occurs at origin (pre-shipment), during loading, at discharge, or at multiple points. Late appointment may shift cost and risk allocation.",
  },
  {
    n: 4,
    title: "Sampling procedures",
    text: "Sampling location, frequency, composite rules, sealing, retention periods, and laboratory routing must be defined. Ambiguity here is a common source of quality disputes.",
  },
  {
    n: 5,
    title: "Certificate as condition precedent",
    text: "If payment depends on inspection, the SPA or LC should state whether a clean certificate is a condition precedent to payment or merely evidence of conformity.",
  },
  {
    n: 6,
    title: "Documentary credit wording",
    text: "Where an LC is used, inspection certificate fields (issuer, wording, dates, ports) must mirror LC text. Discrepancies may delay or reject documents regardless of physical cargo condition.",
  },
  {
    n: 7,
    title: "Rejection and retention samples",
    text: "Define how long retention samples are held, who may request re-test, and whether split samples are sent to a referee laboratory.",
  },
  {
    n: 8,
    title: "Quantity determination method",
    text: "Specify weighbridge, draft survey, shore tank, or tally rules. For bulk vessels, state whether final quantity is loading, discharge, or average of both.",
  },
  {
    n: 9,
    title: "Quality specifications",
    text: "List measurable parameters (e.g. moisture, broken %, ICUMSA, FFA) with min/max limits and the standard or contract method of analysis.",
  },
  {
    n: 10,
    title: "Tolerance and pro-rata adjustment",
    text: "If quality or quantity falls outside tolerance, state whether price adjusts pro-rata, cargo is rejected, or parties renegotiate.",
  },
  {
    n: 11,
    title: "Loading supervision",
    text: "Clarify whether the inspector supervises only documentation or also physical loading, stowage, and seal application.",
  },
  {
    n: 12,
    title: "Vessel / hold suitability",
    text: "For bulk and bagged cargoes, contract should reference hold cleanliness, previous cargo, odour, water ingress, and pest risks — often via a separate hold certificate.",
  },
  {
    n: 13,
    title: "Costs of inspection",
    text: "Allocate inspection fees (buyer, seller, or shared) and state who pays re-inspection or referee testing if results are disputed.",
  },
  {
    n: 14,
    title: "Time limits for claims",
    text: "Quality claims often must be notified within a fixed period after discharge or certificate issuance. Missing deadlines can bar recovery.",
  },
  {
    n: 15,
    title: "Final and binding certificates",
    text: "Some contracts make the inspection certificate final and binding unless fraud or manifest error is proven. Understand this before signing.",
  },
  {
    n: 16,
    title: "Non-reliance on inspector for payment performance",
    text: "The inspector certifies condition at a point in time; it does not guarantee payment, title, or either party's contractual performance.",
  },
  {
    n: 17,
    title: "Accreditation and standards",
    text: "Reference ISO/IEC 17020 for inspection bodies and ISO/IEC 17025 for laboratories where applicable. Verify scope covers the specific test and location.",
  },
  {
    n: 18,
    title: "Electronic certificates",
    text: "If certificates are issued electronically, LC and SPA should accept digital format, issuer authentication, and amendment procedures.",
  },
  {
    n: 19,
    title: "Sanctions and compliance screening",
    text: "Parties may require inspection companies and laboratories to comply with export controls, sanctions, and anti-bribery policies.",
  },
  {
    n: 20,
    title: "Confidentiality of reports",
    text: "Inspection reports may contain commercial data. Define who may receive copies (banks, insurers, brokers) and publication restrictions.",
  },
  {
    n: 21,
    title: "Dispute resolution",
    text: "Commodity contracts often refer to GAFTA or FOSFA arbitration. Inspection disputes may be subject to the same forum unless separately agreed.",
  },
  {
    n: 22,
    title: "Partial shipment and inspection",
    text: "For split shipments, state whether each lot requires separate certificates and how composite quality is calculated across parcels.",
  },
  {
    n: 23,
    title: "Entire agreement on inspection",
    text: "Inspection terms in the SPA, LC, and any side letters must be read together. Conflicting clauses should be resolved before shipment — not at the bank.",
  },
] as const;
