import { z } from "zod";

/**
 * Company details an organization (buyer, supplier, agent or broker) enters once in its own portal.
 * They fill the parts of every generated document that are otherwise printed red, such as the
 * contact person, telephone, signatory and bank details.
 */
export type OrgKind = "buyer" | "supplier" | "agent" | "broker";

export type DocumentDetailField = { key: string; label: string; kinds: OrgKind[]; multiline?: boolean };

const ALL: OrgKind[] = ["buyer", "supplier", "agent", "broker"];
const BUYER_SIDE: OrgKind[] = ["buyer", "agent", "broker"];

export const DOCUMENT_DETAIL_FIELDS: DocumentDetailField[] = [
  { key: "contactPerson", label: "Contact person (attention)", kinds: ALL },
  { key: "phone", label: "Company telephone", kinds: ALL },
  { key: "email", label: "Company email", kinds: ALL },
  { key: "signatoryName", label: "Authorized signatory (full name)", kinds: ALL },
  { key: "signatoryTitle", label: "Signatory title (for example President, Director)", kinds: ALL },
  { key: "issuingBank", label: "Issuing bank (name, branch, SWIFT)", kinds: BUYER_SIDE },
  { key: "consigneeCompany", label: "Final consignee company", kinds: BUYER_SIDE },
  { key: "consigneeContact", label: "Final consignee contact person", kinds: BUYER_SIDE },
  { key: "consigneeAddress", label: "Final consignee address", kinds: BUYER_SIDE, multiline: true },
  { key: "consigneeEmail", label: "Final consignee email", kinds: BUYER_SIDE },
  { key: "consigneePhone", label: "Final consignee telephone", kinds: BUYER_SIDE },
  { key: "consigneeVat", label: "Final consignee VAT number", kinds: BUYER_SIDE },
  { key: "sellerBankName", label: "Advising bank name", kinds: ["supplier"] },
  { key: "sellerBankAddress", label: "Advising bank address", kinds: ["supplier"], multiline: true },
  { key: "sellerBankSwift", label: "Bank SWIFT / BIC", kinds: ["supplier"] },
  { key: "sellerBankAccount", label: "Account number / IBAN", kinds: ["supplier"] },
  { key: "sellerBankOfficer", label: "Bank officer name", kinds: ["supplier"] },
  { key: "sellerBankContact", label: "Bank officer phone / email", kinds: ["supplier"] },
];

export const DOCUMENT_DETAIL_KEYS = DOCUMENT_DETAIL_FIELDS.map((f) => f.key);

export function fieldsForKind(kind: OrgKind): DocumentDetailField[] {
  return DOCUMENT_DETAIL_FIELDS.filter((f) => f.kinds.includes(kind));
}

export type DocumentDetails = Partial<Record<(typeof DOCUMENT_DETAIL_KEYS)[number], string>>;

/** Accepts only the fields that apply to this kind of organization; every value is trimmed and capped. */
export function documentDetailsSchemaFor(kind: OrgKind) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fieldsForKind(kind)) {
    shape[f.key] = z.string().trim().max(f.multiline ? 400 : 200).optional();
  }
  return z.object(shape).strict();
}

/** Keeps only the fields that apply to this kind of organization and drops empty values. */
export function cleanDocumentDetails(kind: OrgKind, raw: Record<string, unknown> | null | undefined): DocumentDetails {
  const out: DocumentDetails = {};
  if (!raw) return out;
  for (const f of fieldsForKind(kind)) {
    const v = raw[f.key];
    if (typeof v === "string" && v.trim()) out[f.key] = v.trim();
  }
  return out;
}

/**
 * The document keys filled from an organization's details. On the buyer side the organization is the
 * buyer; on the supplier side it is the seller (Finekarts is then the buyer, so those keys are not touched).
 */
export function documentPrefillFromDetails(details: DocumentDetails | null | undefined, supplierSide: boolean): Record<string, string> {
  const d = details ?? {};
  const out: Record<string, string> = {};
  const set = (key: string, value: string | undefined) => {
    if (value?.trim()) out[key] = value.trim();
  };
  if (supplierSide) {
    set("sellerContact", d.contactPerson);
    set("sellerTelephone", d.phone);
    set("sellerEmail", d.email);
    set("sellerRepresentative", d.signatoryName);
    set("sellerTitle", d.signatoryTitle);
    for (const k of ["sellerBankName", "sellerBankAddress", "sellerBankSwift", "sellerBankAccount", "sellerBankOfficer", "sellerBankContact"]) {
      set(k, d[k]);
    }
  } else {
    set("buyerContact", d.contactPerson);
    set("buyerTelephone", d.phone);
    set("buyerEmail", d.email);
    set("buyerSignatory", d.signatoryName);
    set("buyerTitle", d.signatoryTitle);
    for (const k of ["issuingBank", "consigneeCompany", "consigneeContact", "consigneeAddress", "consigneeEmail", "consigneePhone", "consigneeVat"]) {
      set(k, d[k]);
    }
  }
  return out;
}
