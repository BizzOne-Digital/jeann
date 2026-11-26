/** Pure placeholder merge for document templates. Missing values render as a blank line marker. */

export const PLACEHOLDERS = [
  "buyerName",
  "sellerName",
  "product",
  "quantity",
  "unitPrice",
  "totalValue",
  "incoterm",
  "loadingPort",
  "destinationPort",
  "paymentTerms",
  "shipmentSchedule",
  "packaging",
  "inspection",
  "transactionNumber",
  "date",
  "currency",
  "buyerContact",
  "buyerAddress",
  "buyerTelephone",
  "buyerEmail",
  "buyerSignatory",
  "sellerRepresentative",
  "origin",
  "contractDuration",
  "trancheValue",
  "productLine",
  "specificationBlock",
  "requiredDocuments",
  "sellerAddress",
  "sellerContact",
  "consigneeCompany",
  "consigneeContact",
  "consigneeAddress",
  "consigneeVat",
  "consigneeEmail",
  "deliveryTerms",
  "liquidatedDamages",
  "documentsAddress",
  "buyerInquiryRef",
  "icpoRef",
  "psaRef",
  "proformaNumber",
  "commercialInvoiceNumber",
  "amountInWords",
  "lcNumber",
  "lcIssueDate",
  "lcExpiryDate",
  "lcExpiryCountry",
  "latestShipmentDate",
  "confirmationInstructions",
  "lcDocuments",
  "productLineUpper",
  "buyerSignature",
  "buyerTitle",
  "lcDeadlineHours",
  "cropYear",
  "buyerSalutation",
  "sellerRegNumber",
  "sellerTitle",
  "buyerRegNumber",
  "hsCode",
  "productGrade",
  "etaDays",
  "purityCompliance",
  "importStandards",
  "sellerBankName",
  "sellerBankAddress",
  "sellerBankSwift",
  "sellerBankAccount",
  "sellerBankOfficer",
  "sellerBankContact",
  "performanceBondPercent",
  "commission",
  "sellerTelephone",
  "sellerEmail",
  "supplierRegNumber",
  "finekartsRegNumber",
  "supplierScoRef",
  "supplierCapacity",
  "shelfLife",
  "partialShipments",
  "transshipment",
  "lcForm",
  "consigneePhone",
  "issuingBank",
] as const;

export type TemplateBlock = { type?: string; content: string; order?: number };

/** Prefill uses `buyer`/`seller`; templates use `buyerName`/`sellerName`. */
export function placeholderValues(
  data: Record<string, unknown>,
  extra: { transactionNumber?: string; date?: string } = {},
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || v === undefined || v === null || v === "") continue;
    out[k] = String(v);
  }
  if (out.buyer && !out.buyerName) out.buyerName = out.buyer;
  if (out.seller && !out.sellerName) out.sellerName = out.seller;
  if (extra.transactionNumber) out.transactionNumber = extra.transactionNumber;
  out.date = extra.date ?? new Date().toISOString().slice(0, 10);
  return out;
}

export function mergePlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_m, key: string) => values[key] ?? "________");
}

/** Renders blocks (sorted by order) to flat text lines for PDF output. */
export function renderTemplateLines(blocks: TemplateBlock[], values: Record<string, string>): string[] {
  const sorted = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const lines: string[] = [];
  for (const b of sorted) {
    const merged = mergePlaceholders(b.content, values);
    if (b.type === "heading") lines.push(merged.toUpperCase());
    else lines.push(...merged.split(/\r?\n/));
    lines.push("");
  }
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** What each field is, shown in red in the document while it is not filled in (the client's template style). */
export const PLACEHOLDER_LABELS: Record<string, string> = {
  buyerName: "BUYER LEGAL COMPANY NAME",
  sellerName: "SUPPLIER COMPANY NAME",
  product: "COMMODITY NAME",
  productLine: "COMMODITY NAME & GRADE",
  quantity: "QUANTITY IN MT",
  unitPrice: "XXX.XX",
  totalValue: "XXX,XXX,XXX.XX",
  trancheValue: "XX,XXX,XXX.XX",
  incoterm: "CIF / CFR / FOB",
  loadingPort: "PORT NAME, COUNTRY",
  destinationPort: "PORT NAME, COUNTRY",
  paymentTerms: "PAYMENT TERMS",
  shipmentSchedule: "SINGLE SHIPMENT OR MONTHLY / QUARTERLY TRANCHES OF XX,XXX MT",
  packaging: "PACKAGING",
  inspection: "INSPECTION COMPANY",
  transactionNumber: "ORDER NUMBER",
  date: "DD MONTH YYYY",
  currency: "USD",
  buyerContact: "NAME & TITLE",
  buyerAddress: "STREET, CITY, POSTAL CODE, COUNTRY",
  buyerTelephone: "PHONE",
  buyerEmail: "CORPORATE EMAIL",
  buyerSignatory: "BUYER AUTHORIZED SIGNATORY",
  buyerRegNumber: "BUYER REGISTRATION NO.",
  buyerInquiryRef: "BUYER LOI / ICPO REF. NO.",
  icpoRef: "BUYER ICPO REF. NO.",
  psaRef: "PSA REF.",
  proformaNumber: "PROFORMA INVOICE NO.",
  commercialInvoiceNumber: "COMMERCIAL INVOICE NO.",
  amountInWords: "Amount in Words",
  lcNumber: "BUYER'S LC REF NUMBER",
  lcIssueDate: "YYYYMMDD",
  lcExpiryDate: "YYYYMMDD",
  lcExpiryCountry: "COUNTRY OF ADVISING BANK",
  latestShipmentDate: "YYYYMMDD",
  confirmationInstructions: "CONFIRMATION REQUESTED OR NOT",
  lcDocuments: "DOCUMENTS REQUIRED",
  productLineUpper: "COMMODITY NAME AND GRADE",
  buyerSignature: "SIGNATURE",
  buyerTitle: "Buyer Title",
  lcDeadlineHours: "48 business",
  buyerSalutation: "Mr./Ms. Last Name",
  sellerRepresentative: "AUTHORIZED SIGNATORY",
  sellerTitle: "TITLE",
  sellerRegNumber: "ONTARIO / FEDERAL CORP. NO.",
  sellerAddress: "SUPPLIER ADDRESS",
  sellerContact: "CONTACT PERSON",
  origin: "COUNTRY / REGION OF ORIGIN",
  contractDuration: "SPOT SINGLE SHIPMENT OR 12-MONTH REVOLVING SUPPLY CONTRACT",
  hsCode: "6- TO 10-DIGIT HS CODE",
  productGrade: "GRADE / QUALITY",
  cropYear: "YEAR",
  etaDays: "30-45",
  purityCompliance: "NON-GMO / 100% FIT FOR HUMAN CONSUMPTION",
  importStandards: "CFIA CANADA / FDA USA / EU / CHINA GACC",
  specificationBlock: "PARAMETER, CONTRACTUAL STANDARD / LIMIT, TEST METHOD",
  requiredDocuments: "STIPULATED SHIPPING DOCUMENTS",
  sellerBankName: "SELLER'S BANK NAME",
  sellerBankAddress: "STREET ADDRESS, CITY, PROVINCE, COUNTRY",
  sellerBankSwift: "8- OR 11-CHARACTER SWIFT CODE",
  sellerBankAccount: "ACCOUNT NUMBER",
  sellerBankOfficer: "OFFICER NAME",
  sellerBankContact: "TELEPHONE / BANK EMAIL",
  performanceBondPercent: "2% - 5%",
  commission: "X.XX",
  consigneeCompany: "FINAL CONSIGNEE COMPANY",
  consigneeContact: "CONSIGNEE CONTACT PERSON",
  consigneeAddress: "CONSIGNEE ADDRESS",
  consigneeVat: "VAT NUMBER",
  consigneeEmail: "CONSIGNEE EMAIL",
  deliveryTerms: "ETA",
  liquidatedDamages: "AMOUNT, e.g. 250,000",
  documentsAddress: "ADDRESS FOR ORIGINAL DOCUMENTS",
  sellerTelephone: "SUPPLIER PHONE",
  sellerEmail: "SUPPLIER CORPORATE EMAIL",
  supplierRegNumber: "SUPPLIER REGISTRATION / EXPORT LICENSE NO.",
  finekartsRegNumber: "ONTARIO / FEDERAL CORP. NO.",
  supplierScoRef: "SUPPLIER SCO / OFFER REF. NO.",
  supplierCapacity: "TITLE HOLDER / MANUFACTURER / REFINERY / MANDATED EXPORT SUPPLIER",
  shelfLife: "12-24 MONTHS; STORE IN A COOL, DRY PLACE AWAY FROM DIRECT SUNLIGHT",
  partialShipments: "ALLOWED / NOT ALLOWED",
  transshipment: "ALLOWED / NOT ALLOWED",
  lcForm: "IRREVOCABLE / IRREVOCABLE TRANSFERABLE",
  consigneePhone: "CONSIGNEE PHONE",
  issuingBank: "BUYER'S ISSUING BANK NAME, BRANCH & SWIFT BIC",
};

/**
 * Like mergePlaceholders, but a field that is not filled in becomes a red label in square brackets
 * (for example [BUYER LEGAL COMPANY NAME]). Once the field is filled the same place prints in black.
 */
export function mergePlaceholdersRed(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    const value = values[key];
    if (value !== undefined && value !== "") return value;
    return "[[" + (PLACEHOLDER_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").toUpperCase()) + "]]";
  });
}

/**
 * Renders blocks (sorted by order) to formatted text for the PDF renderer (see lib/documents/rich-text.ts).
 * A heading block becomes a large bold heading; paragraph blocks keep any formatting written in them.
 */
export function renderTemplateRich(blocks: TemplateBlock[], values: Record<string, string>): string {
  const sorted = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const out: string[] = [];
  for (const b of sorted) {
    const merged = mergePlaceholdersRed(b.content, values);
    const lines = merged.split(/\r?\n/);
    if (b.type === "heading") {
      out.push(...lines.filter((l) => l.trim()).map((l) => "# " + l.replace(/^#+\s*/, "")));
    } else {
      out.push(...lines);
    }
  }
  return out.join("\n");
}

/** Wraps text to a max character width on word boundaries. */
export function wrapLine(line: string, width = 88): string[] {
  if (line.length <= width) return [line];
  const out: string[] = [];
  let cur = "";
  for (const word of line.split(/\s+/)) {
    if (word.length > width) {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      for (let i = 0; i < word.length; i += width) out.push(word.slice(i, i + width));
      continue;
    }
    if ((cur + " " + word).trim().length > width) {
      out.push(cur);
      cur = word;
    } else cur = (cur + " " + word).trim();
  }
  if (cur) out.push(cur);
  return out;
}
