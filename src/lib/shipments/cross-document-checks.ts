import type { ValidationFinding } from "@/lib/shipments/document-validation";

/**
 * Header fields that must be IDENTICAL across shipping documents (exact-match mindset:
 * a single character difference can trigger a bank amendment). Values come from a
 * document version's structuredData; documents without data are simply skipped.
 */
export type ShippingDocFields = {
  documentType: string;
  label?: string;
  amount?: string | number;
  currency?: string;
  consignee?: string;
  shipper?: string;
  blNumber?: string;
  quantity?: string | number;
  quantityUnit?: string;
  product?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  vesselName?: string;
  /** ISO date strings */
  issueDate?: string;
  shippedOnBoardDate?: string;
  lcNumber?: string;
};

type TextField =
  | "consignee"
  | "shipper"
  | "blNumber"
  | "product"
  | "portOfLoading"
  | "portOfDischarge"
  | "vesselName"
  | "lcNumber"
  | "currency";

const TEXT_FIELDS: Array<{ key: TextField; label: string }> = [
  { key: "consignee", label: "Consignee" },
  { key: "shipper", label: "Shipper" },
  { key: "blNumber", label: "B/L number" },
  { key: "product", label: "Product description" },
  { key: "portOfLoading", label: "Port of loading" },
  { key: "portOfDischarge", label: "Port of discharge" },
  { key: "vesselName", label: "Vessel name" },
  { key: "lcNumber", label: "LC number" },
  { key: "currency", label: "Currency" },
];

const present = (v: unknown): v is string | number =>
  v !== undefined && v !== null && String(v).trim() !== "";

/** Whitespace-only differences are reported as a warning; any other difference is blocking. */
function normalizeSpaces(v: string): string {
  return v.replace(/\s+/g, " ").trim();
}

function describeDiff(a: string, b: string): string {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return `first difference at character ${i + 1} ("${a.slice(i, i + 12)}" vs "${b.slice(i, i + 12)}")`;
}

const docName = (d: ShippingDocFields) => d.label ?? d.documentType.replace(/_/g, " ");

export function compareShippingDocumentFields(docs: ShippingDocFields[]): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  for (const { key, label } of TEXT_FIELDS) {
    const withValue = docs.filter((d) => present(d[key]));
    if (withValue.length < 2) continue;
    const base = withValue[0];
    const baseVal = String(base[key]);
    for (const other of withValue.slice(1)) {
      const val = String(other[key]);
      if (val === baseVal) continue;
      const sameIgnoringSpaces = normalizeSpaces(val) === normalizeSpaces(baseVal);
      const sameIgnoringCase = val.toLowerCase() === baseVal.toLowerCase();
      findings.push({
        severity: sameIgnoringSpaces || sameIgnoringCase ? "warning" : "blocking",
        field: key,
        message: `${label} differs between ${docName(base)} and ${docName(other)}: ${describeDiff(baseVal, val)}. Banks require exact match (including spaces, commas, case).`,
        expected: baseVal,
        actual: val,
        suggestion: `Correct the ${label.toLowerCase()} so both documents are identical before presentation.`,
      });
    }
  }

  const amounts = docs.filter((d) => present(d.amount));
  if (amounts.length >= 2) {
    const base = amounts[0];
    for (const other of amounts.slice(1)) {
      if (Number(base.amount) !== Number(other.amount) || Number.isNaN(Number(other.amount))) {
        findings.push({
          severity: "blocking",
          field: "amount",
          message: `Amount differs between ${docName(base)} and ${docName(other)}.`,
          expected: String(base.amount),
          actual: String(other.amount),
          suggestion: "Align invoice, draft and LC amounts exactly.",
        });
      }
    }
  }

  const quantities = docs.filter((d) => present(d.quantity));
  if (quantities.length >= 2) {
    const base = quantities[0];
    for (const other of quantities.slice(1)) {
      const unitMismatch =
        present(base.quantityUnit) &&
        present(other.quantityUnit) &&
        String(base.quantityUnit).toLowerCase() !== String(other.quantityUnit).toLowerCase();
      if (Number(base.quantity) !== Number(other.quantity) || Number.isNaN(Number(other.quantity)) || unitMismatch) {
        findings.push({
          severity: "blocking",
          field: "quantity",
          message: `Quantity differs between ${docName(base)} and ${docName(other)}.`,
          expected: `${base.quantity} ${base.quantityUnit ?? ""}`.trim(),
          actual: `${other.quantity} ${other.quantityUnit ?? ""}`.trim(),
          suggestion: "Align quantity and unit across invoice, packing list, B/L and inspection certificates.",
        });
      }
    }
  }

  // Date logic: no document may be issued before... shipped-on-board must not be after any inspection/issue date check is
  // limited to what can be asserted deterministically: shipped-on-board cannot be later than B/L issue date.
  for (const d of docs) {
    if (present(d.issueDate) && present(d.shippedOnBoardDate)) {
      const issue = new Date(String(d.issueDate)).getTime();
      const sob = new Date(String(d.shippedOnBoardDate)).getTime();
      if (!Number.isNaN(issue) && !Number.isNaN(sob) && sob > issue) {
        findings.push({
          severity: "blocking",
          field: "shippedOnBoardDate",
          message: `${docName(d)}: shipped-on-board date is after the issue date.`,
          expected: `on or before ${d.issueDate}`,
          actual: String(d.shippedOnBoardDate),
        });
      }
    }
  }

  return findings;
}

/** Compare document fields to the shipment lot / LC reference values. */
export function compareToLotReference(
  docs: ShippingDocFields[],
  ref: { product?: string; portOfLoading?: string; portOfDischarge?: string; quantity?: number; quantityUnit?: string },
): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  for (const d of docs) {
    if (ref.portOfDischarge && present(d.portOfDischarge) && d.portOfDischarge !== ref.portOfDischarge) {
      findings.push({
        severity: "blocking",
        field: "portOfDischarge",
        message: `${docName(d)}: port of discharge does not match the shipment lot.`,
        expected: ref.portOfDischarge,
        actual: String(d.portOfDischarge),
      });
    }
    if (ref.portOfLoading && present(d.portOfLoading) && d.portOfLoading !== ref.portOfLoading) {
      findings.push({
        severity: "blocking",
        field: "portOfLoading",
        message: `${docName(d)}: port of loading does not match the shipment lot.`,
        expected: ref.portOfLoading,
        actual: String(d.portOfLoading),
      });
    }
    if (ref.product && present(d.product) && d.product !== ref.product) {
      findings.push({
        severity: "warning",
        field: "product",
        message: `${docName(d)}: product description differs from the shipment lot (check against LC wording).`,
        expected: ref.product,
        actual: String(d.product),
      });
    }
    if (ref.quantity !== undefined && present(d.quantity) && Number(d.quantity) !== ref.quantity) {
      findings.push({
        severity: "warning",
        field: "quantity",
        message: `${docName(d)}: quantity differs from the shipment lot quantity.`,
        expected: String(ref.quantity),
        actual: String(d.quantity),
      });
    }
  }
  return findings;
}
