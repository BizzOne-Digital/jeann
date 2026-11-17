import { Types } from "mongoose";
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
  /** The product chosen from the list. Changing it updates every product-driven line of the documents. */
  productId?: string;
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
  /** Extra document fields (buyer contact, address, origin, tranche value ...). Only known keys are used. */
  details?: Record<string, string>;
};

export const OFFER_DETAIL_KEYS = [
  "buyerContact",
  "buyerAddress",
  "buyerTelephone",
  "buyerEmail",
  "buyerSignatory",
  "sellerRepresentative",
  "origin",
  "contractDuration",
  "shipmentSchedule",
  "packaging",
  "trancheValue",
  "buyerInquiryRef",
  "cropYear",
  "buyerSalutation",
  "sellerRegNumber",
  "sellerTitle",
  "buyerRegNumber",
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
] as const;

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

  // The product on the order follows the product chosen here. The packaging, origin and inspection
  // of the old product are cleared, so the new product's own values are used and the document
  // stays bank-compliant.
  if (input.productId && Types.ObjectId.isValid(input.productId)) {
    const { CommercialTerms, Product, ProductSpecificationVersion } = await import("@/models");
    const product = await Product.findOne({ _id: input.productId, deletedAt: null }).select("name").lean();
    if (!product) throw new Error("product_not_found");
    const terms = await CommercialTerms.findOne({ transactionId: tx._id }).sort({ version: -1 });
    if (terms && String(terms.productId ?? "") !== String(product._id)) {
      const spec = await ProductSpecificationVersion.findOne({ productId: product._id, active: true }).sort({ version: -1 }).select("_id").lean();
      terms.productId = product._id;
      terms.productName = product.name;
      terms.specificationVersionId = spec?._id;
      terms.packaging = undefined;
      terms.productOrigin = undefined;
      terms.inspectionCompany = undefined;
      await terms.save();
    }
    if (String(tx.productId ?? "") !== String(product._id)) {
      tx.productId = product._id;
      await tx.save();
    }
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

  const currency = input.currency.toUpperCase();
  const qtyNumber = Number(input.quantity.replace(/[^\d.]/g, ""));
  const total = qtyNumber > 0 ? (qtyNumber * Number(input.unitPrice)).toFixed(2) : "";
  const details: Record<string, string> = {};
  for (const key of OFFER_DETAIL_KEYS) {
    const value = input.details?.[key]?.trim();
    if (value) details[key] = value;
  }
  const structuredData = {
    ...details,
    documentType: input.documentType,
    product: input.productName,
    unitPrice: currency + " " + input.unitPrice,
    currency,
    quantity: input.quantity + " " + input.quantityUnit,
    quantityUnit: input.quantityUnit,
    ...(total ? { totalValue: currency + " " + total } : {}),
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
