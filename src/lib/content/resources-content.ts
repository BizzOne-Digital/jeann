export const RESOURCES_PILLARS = [
  {
    id: "banking",
    title: "Banking & SPA",
    summary: "Illustrative PSA clauses for LC, SBLC, guarantees, and collections.",
    icon: "bank",
  },
  {
    id: "payments",
    title: "Payment structures",
    summary: "How 12-month commodity programmes are commonly ranked for buyer and seller risk.",
    icon: "chart",
  },
  {
    id: "documents",
    title: "Trade documents",
    summary: "Commercial, transport, origin, quality, and negotiation instruments explained.",
    icon: "folder",
  },
  {
    id: "downloads",
    title: "Downloads",
    summary: "Checklists and counsel-approved PDF references for internal review.",
    icon: "download",
  },
] as const;

export type ResourcesTabId = (typeof RESOURCES_PILLARS)[number]["id"];

export const RESOURCES_DOWNLOADS = [
  {
    title: "Commercial document checklist",
    href: "/docs/commercial-document-checklist.txt",
    note: "Plain-text starter list for buyer–seller document discussions.",
    type: "Checklist",
  },
];

export const RESOURCES_DOCUMENT_GROUPS = [
  {
    id: "commercial",
    title: "Commercial documents",
    items: [
      {
        name: "Commercial invoice",
        note: "Seller billing document — must align with contract and LC wording when documentary credit is used.",
      },
      {
        name: "Packing list",
        note: "Packages, weights, and marks — must match invoice and transport documents.",
      },
      {
        name: "Proforma invoice",
        note: "Often used pre-shipment for buyer approval or LC opening.",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport documents",
    items: [
      {
        name: "Bill of lading",
        note: "Key ocean transport document — negotiability depends on type and bank requirements.",
      },
      {
        name: "Sea waybill",
        note: "Non-negotiable transport document where title follows contract.",
      },
      {
        name: "Charter party references",
        note: "Bulk vessel programmes may reference charter terms alongside BL or survey reports.",
      },
    ],
  },
  {
    id: "origin",
    title: "Origin & compliance",
    items: [
      {
        name: "Certificate of origin",
        note: "Corridor-specific — confirms declared origin for customs and banking.",
      },
      {
        name: "Phytosanitary certificate",
        note: "Required for many agricultural imports — scope varies by destination.",
      },
      {
        name: "Health / veterinary certificates",
        note: "Product and corridor dependent.",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality & quantity",
    items: [
      {
        name: "Certificate of analysis",
        note: "Laboratory results against contractual specifications.",
      },
      {
        name: "Certificate of weight & quantity",
        note: "Independent determination of loaded quantity.",
      },
      {
        name: "Inspection certificates",
        note: "Issued by mutually agreed independent inspection companies.",
      },
    ],
  },
  {
    id: "instruments",
    title: "Negotiation instruments",
    items: [
      {
        name: "LOI — Letter of Intent",
        note: "Non-binding expression of interest for further negotiation.",
      },
      {
        name: "SCO / FCO",
        note: "Indicative corporate offers — binding effect depends on wording.",
      },
      {
        name: "PSA / SPA",
        note: "Purchase and sale agreement defining specs, price, delivery, and remedies.",
      },
      {
        name: "Letter of Credit (LC)",
        note: "Bank instrument — type and document compliance are negotiated per deal.",
      },
    ],
  },
];

export const RESOURCES_RELATED_LINKS = [
  { href: "/logistics", label: "Logistics" },
  { href: "/inspections", label: "Inspections" },
  { href: "/shipping-documents", label: "Shipping documents" },
  { href: "/insights", label: "Insights" },
];
