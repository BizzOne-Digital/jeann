import type { TradeDocumentType } from "@/models/Document";

export type ContractSide = "buyer" | "supplier";
export type FlowActor = "staff" | "buyer" | "supplier";

export type FlowDocument = {
  /** Slug used as the template key prefix: `${slug}_${side}`. Undefined = no template (upload only). */
  slug?: string;
  documentType: TradeDocumentType | "rwa";
  label: string;
  fullName: string;
  note?: string;
};

export type FlowStep = {
  number: number;
  stepKey: string;
  title: string;
  actor: FlowActor;
  documents: FlowDocument[];
  direction: string;
};

export const DOC_SCO: FlowDocument = { slug: "sco", documentType: "sco", label: "SCO", fullName: "Soft Corporate Offer" };
export const DOC_FCO: FlowDocument = { slug: "fco", documentType: "fco", label: "FCO", fullName: "Full Corporate Offer" };
export const DOC_LOI: FlowDocument = { slug: "loi", documentType: "loi", label: "LOI", fullName: "Letter of Intent" };
export const DOC_ICPO: FlowDocument = {
  slug: "icpo",
  documentType: "icpo",
  label: "ICPO",
  fullName: "Irrevocable Corporate Purchase Order",
};
export const DOC_SPA: FlowDocument = {
  slug: "spa",
  documentType: "spa",
  label: "SPA / PSA",
  fullName: "Sales and Purchase Agreement (PSA)",
};
export const DOC_LC: FlowDocument = {
  slug: "lc_wording",
  documentType: "proposed_lc_wording",
  label: "LC wording",
  fullName: "Proposed Letter of Credit wording",
};
export const DOC_PROFORMA: FlowDocument = {
  slug: "proforma_invoice",
  documentType: "proforma_invoice",
  label: "Proforma invoice",
  fullName: "Proforma invoice",
};
export const DOC_PASSPORT: FlowDocument = {
  documentType: "passport_copy",
  label: "Signed PSA with passport copies",
  fullName: "Signed PSA/SPA with signer passport copies",
  note: "Uploaded by the signing party. No template needed.",
};
export const DOC_RWA: FlowDocument = {
  documentType: "rwa",
  label: "LC details / RWA",
  fullName: "LC details and RWA (where applicable)",
  note: "Banking instrument details are recorded in the Banking step. Upload only.",
};

/** Template key for a document slug on a portal side. Keys must match /^[a-z0-9_]{2,64}$/. */
export function templateKeyFor(slug: string, side: ContractSide): string {
  return `${slug}_${side}`;
}

/** Maps a stored trade document type to the template slug (undefined when no template applies). */
export function templateSlugForDocumentType(type: string | undefined | null): string | undefined {
  switch (type) {
    case "sco":
    case "fco":
    case "loi":
    case "icpo":
    case "spa":
    case "proforma_invoice":
      return type;
    case "proposed_lc_wording":
      return "lc_wording";
    default:
      return undefined;
  }
}

export function contractFlow(side: ContractSide): FlowStep[] {
  if (side === "buyer") {
    return [
      {
        number: 1, stepKey: "sco_fco", title: "Finekarts sends SCO or FCO", actor: "staff",
        documents: [DOC_SCO, DOC_FCO],
        direction: "Staff creates the offer from the agreed commercial terms, can adjust the price, then sends it to the buyer. Use SCO for a soft offer and FCO for a full offer.",
      },
      {
        number: 2, stepKey: "icpo", title: "Buyer replies with LOI / ICPO", actor: "buyer",
        documents: [DOC_LOI, DOC_ICPO],
        direction: "The buyer confirms interest with a LOI or an ICPO. Staff reviews it and marks it received.",
      },
      {
        number: 3, stepKey: "psa_lc", title: "Finekarts sends SPA / PSA, LC wording and proforma invoice", actor: "staff",
        documents: [DOC_SPA, DOC_LC, DOC_PROFORMA],
        direction: "Staff generates the three documents from the commercial terms, reviews them, then sends them to the buyer together.",
      },
      {
        number: 4, stepKey: "buyer_sign", title: "Buyer signs the PSA with passport copies", actor: "buyer",
        documents: [DOC_PASSPORT],
        direction: "The buyer signs and stamps the PSA and uploads it with signer passport copies. Staff checks the upload before countersigning.",
      },
      {
        number: 5, stepKey: "finekarts_sign", title: "Finekarts countersigns", actor: "staff",
        documents: [DOC_SPA],
        direction: "Staff countersigns and returns the fully executed PSA to the buyer.",
      },
      {
        number: 6, stepKey: "banking", title: "Banking: LC details / RWA", actor: "buyer",
        documents: [DOC_RWA],
        direction: "The buyer proceeds with the agreed banking instrument. Staff tracks it in the Banking step.",
      },
    ];
  }
  return [
    {
      number: 1, stepKey: "supplier_sco_fco", title: "Supplier SCO / FCO received (or skip with reason)", actor: "supplier",
      documents: [DOC_SCO, DOC_FCO],
      direction: "The supplier sends their offer. Staff uploads or records it. Staff can skip this step with a written reason.",
    },
    {
      number: 2, stepKey: "finekarts_icpo", title: "Finekarts sends LOI / ICPO", actor: "staff",
      documents: [DOC_LOI, DOC_ICPO],
      direction: "Staff generates the purchase order from the commercial terms and sends it to the supplier.",
    },
    {
      number: 3, stepKey: "supplier_psa_lc", title: "Supplier replies with SPA / PSA, LC wording and proforma invoice", actor: "supplier",
      documents: [DOC_SPA, DOC_LC, DOC_PROFORMA],
      direction: "The supplier returns the contract, LC wording and proforma. Staff reviews them against the agreed terms.",
    },
    {
      number: 4, stepKey: "finekarts_sign", title: "Finekarts signs the PSA with passport copies", actor: "staff",
      documents: [DOC_PASSPORT],
      direction: "Staff signs and stamps the PSA and attaches signer passport copies.",
    },
    {
      number: 5, stepKey: "supplier_sign", title: "Supplier returns the executed counterpart", actor: "supplier",
      documents: [DOC_SPA],
      direction: "The supplier signs and returns the executed PSA. Staff checks it.",
    },
    {
      number: 6, stepKey: "banking", title: "Banking: LC details / RWA", actor: "staff",
      documents: [DOC_RWA],
      direction: "Finekarts proceeds with the agreed banking instrument. Track it in the Banking step.",
    },
  ];
}

export const HOW_TO_STEPS: string[] = [
  "Create or qualify the buyer request, then convert it to a transaction.",
  "Generate the SCO/FCO (adjust the price if needed) and send it.",
  "Receive the ICPO or LOI from the buyer.",
  "Generate the PSA/SPA, LC wording and proforma invoice, then send them.",
  "The buyer signs; Finekarts countersigns.",
  "LC / banking proceeds.",
];
export const HOW_TO_NOTE =
  "Step 1 (SCO/FCO) can be skipped when the deal started elsewhere, but a reason must be recorded.";
