/** Legal PDFs live in public/docs/legal/ — upload final counsel-approved files with these names. */

export type LegalDocument = {
  id: string;
  title: string;
  description: string;
  pdfHref: string;
  pageHref: string;
  category: "website" | "trade" | "buyer";
  /** Set true once the PDF is uploaded to public/docs/legal/. */
  pdfAvailable: boolean;
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "terms-of-use",
    title: "Website terms and conditions",
    description: "Governs access to the Finekarts marketing website and enquiry forms.",
    pdfHref: "/docs/legal/finekarts-terms-of-use.pdf",
    pageHref: "/terms-and-conditions",
    category: "website",
    pdfAvailable: false,
  },
  {
    id: "privacy-policy",
    title: "Privacy policy",
    description: "How personal data from forms, portals, and cookies may be collected and used.",
    pdfHref: "/docs/legal/finekarts-privacy-policy.pdf",
    pageHref: "/privacy-policy",
    category: "website",
    pdfAvailable: false,
  },
  {
    id: "buyer-terms",
    title: "Buyer submission terms",
    description: "Terms for purchase requests, RFQs, and buyer portal use.",
    pdfHref: "/docs/legal/finekarts-buyer-terms.pdf",
    pageHref: "/buyer-terms",
    category: "buyer",
    pdfAvailable: false,
  },
  {
    id: "general-conditions",
    title: "General conditions of sale (commodities)",
    description: "Draft framework for bulk agricultural commodity transactions — counsel to finalize.",
    pdfHref: "/docs/legal/finekarts-general-conditions-of-sale.pdf",
    pageHref: "/resources",
    category: "trade",
    pdfAvailable: false,
  },
  {
    id: "incoterms-reference",
    title: "Incoterms reference note",
    description: "Educational summary of FOB, CIF, and related trade terms — not legal advice.",
    pdfHref: "/docs/legal/finekarts-incoterms-reference.pdf",
    pageHref: "/logistics#incoterms",
    category: "trade",
    pdfAvailable: false,
  },
  {
    id: "anti-bribery",
    title: "Anti-bribery & compliance statement",
    description: "Finekarts compliance expectations for counterparties and agents.",
    pdfHref: "/docs/legal/finekarts-anti-bribery-compliance.pdf",
    pageHref: "/resources",
    category: "trade",
    pdfAvailable: false,
  },
];
