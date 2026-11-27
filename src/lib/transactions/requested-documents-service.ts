import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import type { RequestedDocumentStatus } from "@/models/RequestedDocument";

/**
 * The documents the buyer asks for are managed inside each transaction, by the people running it.
 * Whatever is requested from Finekarts is requested, in the same words, from its supplier (the linked
 * supplier order). Nothing is final: staff can add, change or remove any item at any time.
 */

export type RequestedDocumentView = {
  id: string;
  title: string;
  notes: string;
  requestedBy: "buyer" | "staff";
  status: RequestedDocumentStatus;
  createdAt: string;
};

export const REQUESTED_DOCUMENT_STATUS_LABEL: Record<RequestedDocumentStatus, string> = {
  requested: "Requested",
  received_from_supplier: "Received from the supplier",
  provided_to_buyer: "Provided to the buyer",
};

function view(d: {
  _id: unknown;
  title: string;
  notes?: string | null;
  requestedBy: "buyer" | "staff";
  status: RequestedDocumentStatus;
  createdAt?: Date | string;
}): RequestedDocumentView {
  return {
    id: String(d._id),
    title: d.title,
    notes: d.notes ?? "",
    requestedBy: d.requestedBy,
    status: d.status,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
  };
}

export async function listRequestedDocuments(transactionId: string): Promise<RequestedDocumentView[]> {
  await tryConnectMongo();
  const { RequestedDocument } = await import("@/models");
  const rows = await RequestedDocument.find({ transactionId: new Types.ObjectId(transactionId), deletedAt: null })
    .sort({ createdAt: 1 })
    .lean();
  return rows.map(view);
}

async function linkedSupplierOrder(buyerTransactionId: Types.ObjectId) {
  const { Transaction } = await import("@/models");
  return Transaction.findOne({ linkedTransactionId: buyerTransactionId, side: "supplier", deletedAt: null })
    .select("_id organizationId")
    .lean();
}

/** Adds one requested document to a transaction. On a buyer order it is mirrored on the supplier order. */
export async function addRequestedDocument(input: {
  transaction: { _id: Types.ObjectId; organizationId: Types.ObjectId; side?: string };
  title: string;
  notes?: string;
  requestedBy: "buyer" | "staff";
  userId: string;
}): Promise<RequestedDocumentView> {
  await tryConnectMongo();
  const { RequestedDocument } = await import("@/models");
  const side = input.transaction.side === "supplier" ? "supplier" : "buyer";
  const item = await RequestedDocument.create({
    transactionId: input.transaction._id,
    organizationId: input.transaction.organizationId,
    side,
    title: input.title,
    notes: input.notes || undefined,
    requestedBy: input.requestedBy,
    requestedByUserId: new Types.ObjectId(input.userId),
    status: "requested",
  });

  if (side === "buyer") {
    const supplierOrder = await linkedSupplierOrder(input.transaction._id);
    if (supplierOrder) {
      const mirror = await RequestedDocument.create({
        transactionId: supplierOrder._id,
        organizationId: supplierOrder.organizationId,
        side: "supplier",
        title: input.title,
        notes: input.notes || undefined,
        requestedBy: "staff",
        requestedByUserId: new Types.ObjectId(input.userId),
        status: "requested",
        mirroredItemId: item._id,
      });
      item.mirroredItemId = mirror._id;
      await item.save();
    }
  }

  await writeAuditEvent({
    action: "requested_document.added",
    targetType: "transaction",
    targetId: String(input.transaction._id),
    actorUserId: input.userId,
    organizationId: String(input.transaction.organizationId),
    metadata: { title: input.title, requestedBy: input.requestedBy },
  });
  return view(item);
}

/** Staff change anything about an item at any time. The mirrored supplier item follows the title and notes. */
export async function updateRequestedDocument(input: {
  transactionId: string;
  itemId: string;
  patch: { title?: string; notes?: string; status?: RequestedDocumentStatus };
  userId: string;
}): Promise<RequestedDocumentView | null> {
  await tryConnectMongo();
  const { RequestedDocument } = await import("@/models");
  const item = await RequestedDocument.findOne({
    _id: input.itemId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  });
  if (!item) return null;

  if (input.patch.title !== undefined) item.title = input.patch.title;
  if (input.patch.notes !== undefined) item.notes = input.patch.notes || undefined;
  if (input.patch.status !== undefined) item.status = input.patch.status;
  await item.save();

  if (item.mirroredItemId) {
    const mirrorPatch: Record<string, unknown> = {};
    if (input.patch.title !== undefined) mirrorPatch.title = item.title;
    if (input.patch.notes !== undefined) mirrorPatch.notes = item.notes;
    // The supplier side only needs to know whether Finekarts has received it.
    if (input.patch.status !== undefined) {
      mirrorPatch.status = input.patch.status === "requested" ? "requested" : "received_from_supplier";
    }
    if (Object.keys(mirrorPatch).length) {
      await RequestedDocument.updateOne({ _id: item.mirroredItemId, deletedAt: null }, { $set: mirrorPatch });
    }
  }

  await writeAuditEvent({
    action: "requested_document.updated",
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
    metadata: { itemId: input.itemId, ...input.patch },
  });
  return view(item);
}

export async function removeRequestedDocument(input: {
  transactionId: string;
  itemId: string;
  userId: string;
  /** Only the buyer's own item that is still just requested may be withdrawn by the buyer. */
  onlyIfBuyerOwnAndRequested?: boolean;
}): Promise<boolean> {
  await tryConnectMongo();
  const { RequestedDocument } = await import("@/models");
  const filter: Record<string, unknown> = {
    _id: input.itemId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  };
  if (input.onlyIfBuyerOwnAndRequested) {
    filter.requestedBy = "buyer";
    filter.status = "requested";
  }
  const item = await RequestedDocument.findOne(filter);
  if (!item) return false;
  const now = new Date();
  item.deletedAt = now;
  await item.save();
  if (item.mirroredItemId) {
    await RequestedDocument.updateOne({ _id: item.mirroredItemId }, { $set: { deletedAt: now } });
  }
  await writeAuditEvent({
    action: "requested_document.removed",
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
    metadata: { itemId: input.itemId, title: item.title },
  });
  return true;
}

/** When the supplier order is opened, everything the buyer already requested is requested from the supplier too. */
export async function copyRequestedDocumentsToSupplierOrder(input: {
  buyerTransactionId: Types.ObjectId;
  supplierTransactionId: Types.ObjectId;
  supplierOrganizationId: Types.ObjectId;
  userId: string;
}): Promise<number> {
  await tryConnectMongo();
  const { RequestedDocument } = await import("@/models");
  const items = await RequestedDocument.find({ transactionId: input.buyerTransactionId, deletedAt: null, mirroredItemId: null });
  let copied = 0;
  for (const item of items) {
    const mirror = await RequestedDocument.create({
      transactionId: input.supplierTransactionId,
      organizationId: input.supplierOrganizationId,
      side: "supplier",
      title: item.title,
      notes: item.notes,
      requestedBy: "staff",
      requestedByUserId: new Types.ObjectId(input.userId),
      status: item.status === "requested" ? "requested" : "received_from_supplier",
      mirroredItemId: item._id,
    });
    item.mirroredItemId = mirror._id;
    await item.save();
    copied += 1;
  }
  return copied;
}
