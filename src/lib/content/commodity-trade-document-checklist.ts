/** Educational index only — not a binding document list. Official buyer CIS: BUYER_CIS_PDF. */
export const COMMODITY_TRADE_DOCUMENT_CHECKLIST_TITLE =
  "Commodity trade document checklist (educational reference)";

export const COMMODITY_TRADE_DOCUMENT_CHECKLIST_SECTIONS = [
  {
    title: "Buyer & corporate information",
    items: [
      "Company profile",
      "Certificate of incorporation / business registration",
      "Corporate KYC information",
      "Buyer corporate information sheet (CIS)",
      "Authorized signatory identification",
      "Business address and contact information",
      "Importer / import license, where applicable",
      "Tax or VAT registration, where applicable",
    ],
  },
  {
    title: "Purchase & transaction documents",
    items: [
      "Letter of intent (LOI), where applicable",
      "Irrevocable corporate purchase order (ICPO), where applicable",
      "Purchase order (PO)",
      "Product specification",
      "Required quantity and delivery schedule",
      "Destination port or final delivery location",
      "Agreed incoterm",
      "Quotation / commercial offer",
      "Proforma invoice",
      "Purchase and sale agreement (PSA)",
    ],
  },
  {
    title: "Banking & payment documents",
    items: [
      "Proof of funds (POF), where required",
      "Bank comfort letter (BCL), where applicable",
      "Readiness to proceed / RWA, where applicable",
      "Letter of credit (LC) requirements",
      "Documentary credit / LC wording",
      "SBLC or bank guarantee, where specifically agreed",
      "Agreed payment terms and banking instructions",
      "SWIFT banking documentation, where applicable",
    ],
  },
  {
    title: "Compliance & verification",
    items: [
      "Buyer KYC / AML documentation",
      "Sanctions and restricted-party screening",
      "Beneficial ownership information, where required",
      "Import and regulatory documentation",
      "End-use or end-buyer information, where applicable",
      "Required certificates or government approvals",
    ],
  },
  {
    title: "Product & quality documentation",
    items: [
      "Product specification sheet",
      "Certificate of analysis (COA), where applicable",
      "Certificate of origin",
      "Health / sanitary / phytosanitary certificate, where applicable",
      "Quality certificate",
      "Inspection certificate",
      "Weight / quantity certificate",
      "Fumigation certificate, where applicable",
      "Other commodity-specific certificates",
    ],
  },
  {
    title: "Shipping & export documentation",
    items: [
      "Commercial invoice",
      "Packing list, where applicable",
      "Bill of lading / transport document",
      "Certificate of origin",
      "Export declaration, where applicable",
      "Insurance certificate for CIF transactions",
      "Inspection documentation",
      "Shipping instructions",
      "Customs documentation",
      "Other destination-country import documents",
    ],
  },
  {
    title: "Transaction completion",
    items: [
      "Final shipping documents reviewed",
      "Documentary compliance confirmed",
      "Payment / banking conditions satisfied",
      "Cargo released for shipment",
      "Shipment tracking information provided",
      "Arrival / delivery documentation",
      "Final transaction records",
    ],
  },
] as const;

export const COMMODITY_TRADE_DOCUMENT_CHECKLIST_NOTE =
  "This checklist is an educational reference for discussions — it is not a contract, not a complete document set, and not a substitute for the official Buyer Corporate Information Sheet (CIS) PDF or transaction-specific requirements. Not every item applies to every trade. Finekarts confirms the documents required for each programme in the signed PSA and with your bank.";
