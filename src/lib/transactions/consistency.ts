import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type ConsistencyIssue = {
  severity: "error" | "warning";
  document?: string;
  revision?: number;
  field: string;
  expected?: string;
  actual?: string;
  message: string;
};

export async function validateTransactionConsistency(
  transactionId: string,
): Promise<{ blocking: ConsistencyIssue[]; warnings: ConsistencyIssue[] }> {
  if (!isMongoConfigured()) return { blocking: [], warnings: [] };
  await tryConnectMongo();

  const { Transaction, CommercialTerms, PurchaseRequest, Document, DocumentVersion } =
    await import("@/models");

  const tx = await Transaction.findById(transactionId).lean();
  if (!tx) return { blocking: [{ severity: "error", field: "transaction", message: "Not found" }], warnings: [] };

  const terms = await CommercialTerms.findOne({ transactionId: tx._id })
    .sort({ version: -1 })
    .lean();
  const pr = tx.sourcePurchaseRequestId
    ? await PurchaseRequest.findById(tx.sourcePurchaseRequestId).lean()
    : null;

  const blocking: ConsistencyIssue[] = [];
  const warnings: ConsistencyIssue[] = [];

  if (!terms) {
    blocking.push({
      severity: "error",
      field: "commercial_terms",
      message: "Commercial terms missing",
    });
    return { blocking, warnings };
  }

  const docs = await Document.find({ transactionId: tx._id, deletedAt: null }).lean();
  for (const doc of docs) {
    const version = doc.currentVersionId
      ? await DocumentVersion.findById(doc.currentVersionId).lean()
      : null;
    if (!version?.structuredData) continue;

    const data = version.structuredData as Record<string, unknown>;
    compareField(blocking, warnings, "productName", String(terms.productName), data.productName, doc.documentType, version.version);
    compareField(blocking, warnings, "quantity", terms.quantity?.toString(), data.quantity, doc.documentType, version.version);
    compareField(blocking, warnings, "currency", terms.currency, data.currency, doc.documentType, version.version);
    compareField(blocking, warnings, "unitPrice", terms.unitPrice?.toString(), data.unitPrice, doc.documentType, version.version);
    compareField(blocking, warnings, "incoterm", terms.incoterm, data.incoterm, doc.documentType, version.version);
    compareField(blocking, warnings, "loadingPort", terms.loadingPort, data.loadingPort, doc.documentType, version.version);
    compareField(blocking, warnings, "destinationPort", terms.destinationPort, data.destinationPort, doc.documentType, version.version);
  }

  if (pr) {
    if (pr.productName && pr.productName !== terms.productName) {
      warnings.push({
        severity: "warning",
        document: "purchase_request",
        field: "productName",
        expected: terms.productName,
        actual: pr.productName,
        message: "Product name differs from commercial terms",
      });
    }
    if (pr.incoterm && pr.incoterm !== terms.incoterm) {
      blocking.push({
        severity: "error",
        document: "purchase_request",
        field: "incoterm",
        expected: terms.incoterm,
        actual: pr.incoterm,
        message: "Incoterm mismatch between request and commercial terms",
      });
    }
  }

  const total = money(terms.totalEstimatedValue?.toString() ?? "0");
  const unit = money(terms.unitPrice?.toString() ?? "0");
  const qty = money(terms.quantity?.toString() ?? "0");
  const computed = unit.times(qty);
  if (total.gt(0) && computed.gt(0) && total.minus(computed).abs().gt(money("1"))) {
    warnings.push({
      severity: "warning",
      field: "totalEstimatedValue",
      expected: computed.toString(),
      actual: total.toString(),
      message: "Total value may not match quantity × unit price",
    });
  }

  return { blocking, warnings };
}

function compareField(
  blocking: ConsistencyIssue[],
  warnings: ConsistencyIssue[],
  field: string,
  expected?: string,
  actual?: unknown,
  document?: string,
  revision?: number,
) {
  if (!expected || actual === undefined || actual === null || actual === "") return;
  const actualStr = String(actual);
  if (expected.trim().toLowerCase() !== actualStr.trim().toLowerCase()) {
    blocking.push({
      severity: "error",
      document,
      revision,
      field,
      expected,
      actual: actualStr,
      message: `${field} mismatch`,
    });
  }
}
