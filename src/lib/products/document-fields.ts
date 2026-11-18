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
      if (i > 0 && i < 80) {
        // "Label: value | test method" puts the test method in the third column of Schedule A.
        const [value, method] = line.slice(i + 1).split("|").map((x) => x.trim());
        return "**" + line.slice(0, i).trim() + ":** " + value + (method ? " (Test method: " + method + ")" : "");
      }
      return line;
    })
    .join("\n");
}

/** Documents the bank asks for at presentation when the product does not list its own. */
const STANDARD_LC_DOCUMENTS = [
  "**Signed Commercial Invoice:** Issued by the First Beneficiary (or substituted invoices of the Second Beneficiary pursuant to UCP 600 Article 38), in one (1) original and three (3) copies stating Contract/LC number, HS Code, quantity, unit price, and total value.",
  "**Full Set (3/3) Clean \"On Board\" Marine Bills of Lading:** Made out \"To Order\" and blank endorsed, marked \"Freight Prepaid\" (for CIF/CFR), showing Port of Loading, Port of Discharge, vessel name, and voyage number.",
  "**Packing List:** One (1) original and three (3) copies detailing package/bag/flexitank count, container numbers, seal numbers, net weight, and gross weight.",
  "**Certificate of Origin (COO):** Issued or endorsed by the Chamber of Commerce in the country of origin.",
  "**Certificate of Quality, Quantity & Weight:** Issued by an independent inspection company at the port of loading.",
  "**Certificate of Analysis (COA):** Accredited laboratory analysis confirming compliance with all chemical, physical, and MRL specifications.",
];

const INSURANCE_LINE =
  "**Marine Cargo Insurance Policy/Certificate (CIF requirement):** issued for 110% of the CIF invoice value covering Institute Cargo Clauses (A), War Risk, and Strikes, payable in USD at the destination.";

/**
 * Numbered list of the documents required for LC presentation. The product's own list is used when
 * it has one. For a CIF order the insurance document is always included, because CIF requires it.
 */
export function requiredDocumentsBlock(labels: string[], incoterm?: string): string {
  const own = labels
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":");
      return i > 0 && i < 100 ? "**" + l.slice(0, i).trim() + ":**" + l.slice(i + 1) : "**" + l + "**";
    });
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

/** The documents required, as numbered capital-letter lines for the SWIFT MT700 field 46A. */
export function lcDocumentsBlock(labels: string[], incoterm?: string): string {
  return requiredDocumentsBlock(labels, incoterm)
    .split("\n")
    .map((line) => line.replace(/\*\*/g, "").toUpperCase())
    .join("\n");
}
