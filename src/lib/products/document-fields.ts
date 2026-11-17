/**
 * Product-driven lines of a trade document. Everything that depends on the product (specification,
 * packaging, origin, inspection, the documents the bank requires) is read from the product record,
 * so when the product changes these lines change with it and the document stays bank-compliant.
 */

/** Used when the product has no inspection companies set. */
export const DEFAULT_INSPECTION = "SGS, Intertek, or Bureau Veritas (BV)";

/** "Label: value" lines to formatted lines, with the label in bold. */
export function specificationToBlock(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(":");
      if (i > 0 && i < 80) return "**" + line.slice(0, i).trim() + ":** " + line.slice(i + 1).trim();
      return line;
    })
    .join("\n");
}

/** Documents the bank asks for at presentation when the product does not list its own. */
const STANDARD_LC_DOCUMENTS = [
  "**Signed Commercial Invoice:** one (1) original and three (3) copies.",
  "**Full Set (3/3) Clean \"On Board\" Marine Bills of Lading:** made out \"To Order\" and blank endorsed, notifying the Applicant.",
  "**Packing List:** one (1) original and three (3) copies.",
  "**Certificate of Origin:** issued or endorsed by the Chamber of Commerce of the exporting country.",
  "**Certificate of Quality, Quantity, and Weight:** issued by an independent inspection company at the port of loading.",
];

const INSURANCE_LINE =
  "**Marine Cargo Insurance Policy/Certificate (CIF requirement):** issued for 110% of the CIF invoice value covering Institute Cargo Clauses (A), War Risk, and Strikes, payable in USD at the destination.";

/**
 * Numbered list of the documents required for LC presentation. The product's own list is used when
 * it has one. For a CIF order the insurance document is always included, because CIF requires it.
 */
export function requiredDocumentsBlock(labels: string[], incoterm?: string): string {
  const own = labels.map((l) => l.trim()).filter(Boolean).map((l) => "**" + l + "**");
  const lines = own.length ? own : [...STANDARD_LC_DOCUMENTS];
  const isCif = (incoterm ?? "").toUpperCase() === "CIF";
  if (isCif && !lines.some((l) => /insurance/i.test(l))) lines.push(INSURANCE_LINE);
  return lines.map((l, i) => i + 1 + ". " + l).join("\n");
}

/** Product name with its grade, for the commodity line. */
export function productLine(name: string | undefined, grade: string | undefined): string | undefined {
  if (!name) return undefined;
  return grade && grade.trim() ? name + ", " + grade.trim() : name;
}
