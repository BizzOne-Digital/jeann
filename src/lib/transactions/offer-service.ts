import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  createTradeDocument,
  generateDocumentPdf,
} from "@/lib/transactions/trade-document-service";

export type OfferInput = {
  transactionId: string;
  actorUserId: string;
  documentType: "sco" | "fco";
  /** Existing SCO/FCO document to revise (creates a new version; sent versions stay immutable). */
  documentId?: string;
  productName: string;
  unitPrice: string;
  currency: string;
  quantity: string;
  quantityUnit: string;
  incoterm: string;
  loadingPort?: string;
  destinationPort?: string;
  paymentTerms?: string;
  validity?: string;
  notes?: string;
};

/** Staff-only. Price is entered per offer (prefill from Product.internalPrice via getOfferPrefill). */
export async function createOrReviseOffer(input: OfferInput) {
  await tryConnectMongo();
  const { Transaction, Document } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("not_found");
  if (tx.transactionType !== "buyer_sale") throw new Error("not_buyer_transaction");
  if (!/^\d+(\.\d+)?$/.test(input.unitPrice) || Number(input.unitPrice) <= 0) {
    throw new Error("invalid_price");
  }

  let documentId = input.documentId;
  if (documentId) {
    const existing = await Document.findOne({
      _id: documentId,
      transactionId: tx._id,
      documentType: { $in: ["sco", "fco"] },
    }).lean();
    if (!existing) throw new Error("document_not_found");
  } else {
    const doc = await createTradeDocument({
      transactionId: String(tx._id),
      organizationId: String(tx.organizationId),
      documentType: input.documentType,
      title: `${input.documentType.toUpperCase()} ${tx.transactionNumber}`,
      createdByUserId: input.actorUserId,
      buyerVisible: false,
      internalOnly: true,
    });
    documentId = String(doc._id);
  }

  const structuredData = {
    documentType: input.documentType,
    product: input.productName,
    unitPrice: input.unitPrice,
    currency: input.currency.toUpperCase(),
    quantity: input.quantity,
    quantityUnit: input.quantityUnit,
    incoterm: input.incoterm,
    loadingPort: input.loadingPort,
    destinationPort: input.destinationPort,
    paymentTerms: input.paymentTerms,
    offerValidity: input.validity,
    notes: input.notes,
  };
  const result = await generateDocumentPdf({
    documentId,
    actorUserId: input.actorUserId,
    structuredData,
    isDraft: true,
    transactionNumber: tx.transactionNumber,
  });

  await writeAuditEvent({
    action: "offer.revision_created",
    targetType: "document",
    targetId: documentId,
    actorUserId: input.actorUserId,
    organizationId: String(tx.organizationId),
    metadata: {
      version: result.version.version,
      unitPrice: input.unitPrice,
      currency: input.currency,
      revisedExisting: Boolean(input.documentId),
    },
  });

  return {
    documentId,
    versionId: String(result.version._id),
    version: result.version.version,
  };
}

/** Staff-only prefill: product internalPrice is never exposed outside staff routes. */
export async function getOfferPrefill(transactionId: string) {
  await tryConnectMongo();
  const { Transaction, Product, CommercialTerms } = await import("@/models");
  const tx = await Transaction.findById(transactionId).lean();
  if (!tx) throw new Error("not_found");
  const terms = await CommercialTerms.findOne({ transactionId: tx._id })
    .sort({ version: -1 })
    .lean();
  const productId = tx.productId ?? terms?.productId;
  const product = productId
    ? await Product.findById(productId).select("name internalPrice").lean()
    : null;
  return {
    productName: terms?.productName ?? product?.name ?? "",
    internalPrice: product?.internalPrice ?? "",
    unitPrice: terms?.unitPrice ? String(terms.unitPrice) : "",
    currency: terms?.currency ?? "USD",
    quantity: terms?.quantity ? String(terms.quantity) : "",
    quantityUnit: terms?.quantityUnit ?? "MT",
    incoterm: terms?.incoterm ?? "FOB",
    loadingPort: terms?.loadingPort ?? "",
    destinationPort: terms?.destinationPort ?? "",
    paymentTerms: terms?.paymentProposal ?? "",
  };
}
