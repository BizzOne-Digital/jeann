import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import type { InspectionRequestStatus } from "@/models/InspectionRequest";

/**
 * The buyer's inspection request at the loading port (client, 2026-11-28). The buyer asks in the buyer portal (stage 1).
 * When Finekarts grants it, the supplier order (stage 2) asks the supplier for the inspection report, and the report is
 * received and handed to the buyer from there.
 */

export const INSPECTION_STATUS_LABEL: Record<InspectionRequestStatus, string> = {
  requested: "Requested",
  granted: "Granted",
  declined: "Declined",
  report_received: "Report received",
};

export const INSPECTION_REPORT_TITLE = "Inspection report at the loading port";

export type InspectionRequestView = {
  id: string;
  inspectionCompany: string;
  scope: string;
  loadingPort: string;
  requestedBy: "buyer" | "staff";
  status: InspectionRequestStatus;
  statusLabel: string;
  decisionNote: string;
  decidedAt: string | null;
  reportReceivedAt: string | null;
  createdAt: string;
};

function view(d: {
  _id: unknown;
  inspectionCompany?: string | null;
  scope?: string | null;
  loadingPort?: string | null;
  requestedBy: "buyer" | "staff";
  status: InspectionRequestStatus;
  decisionNote?: string | null;
  decidedAt?: Date | null;
  reportReceivedAt?: Date | null;
  createdAt?: Date | string;
}): InspectionRequestView {
  return {
    id: String(d._id),
    inspectionCompany: d.inspectionCompany ?? "",
    scope: d.scope ?? "",
    loadingPort: d.loadingPort ?? "",
    requestedBy: d.requestedBy,
    status: d.status,
    statusLabel: INSPECTION_STATUS_LABEL[d.status],
    decisionNote: d.decisionNote ?? "",
    decidedAt: d.decidedAt ? new Date(d.decidedAt).toISOString() : null,
    reportReceivedAt: d.reportReceivedAt ? new Date(d.reportReceivedAt).toISOString() : null,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
  };
}

export async function listInspectionRequests(transactionId: string): Promise<InspectionRequestView[]> {
  await tryConnectMongo();
  const { InspectionRequest } = await import("@/models");
  const rows = await InspectionRequest.find({ transactionId: new Types.ObjectId(transactionId), deletedAt: null })
    .sort({ createdAt: 1 })
    .lean();
  return rows.map(view);
}

export async function createInspectionRequest(input: {
  transaction: { _id: Types.ObjectId; organizationId: Types.ObjectId };
  inspectionCompany?: string;
  scope?: string;
  loadingPort?: string;
  requestedBy: "buyer" | "staff";
  userId: string;
}): Promise<InspectionRequestView> {
  await tryConnectMongo();
  const { InspectionRequest } = await import("@/models");
  const row = await InspectionRequest.create({
    transactionId: input.transaction._id,
    organizationId: input.transaction.organizationId,
    inspectionCompany: input.inspectionCompany || undefined,
    scope: input.scope || undefined,
    loadingPort: input.loadingPort || undefined,
    requestedBy: input.requestedBy,
    requestedByUserId: new Types.ObjectId(input.userId),
    status: "requested",
  });
  await writeAuditEvent({
    action: "inspection_request.created",
    targetType: "transaction",
    targetId: String(input.transaction._id),
    actorUserId: input.userId,
    organizationId: String(input.transaction.organizationId),
    metadata: { requestedBy: input.requestedBy },
  });
  return view(row);
}

/**
 * Makes sure the supplier order asks for the inspection report of a granted request. Safe to call again: it never
 * creates the same item twice. Returns the id of the requested document, or null when there is no supplier order yet.
 */
export async function ensureInspectionReportItem(requestId: Types.ObjectId | string, userId: string): Promise<Types.ObjectId | null> {
  await tryConnectMongo();
  const { InspectionRequest, Transaction, RequestedDocument } = await import("@/models");
  const request = await InspectionRequest.findById(requestId);
  if (!request || request.deletedAt) return null;
  if (request.reportRequestedDocumentId) {
    const live = await RequestedDocument.exists({ _id: request.reportRequestedDocumentId, deletedAt: null });
    if (live) return request.reportRequestedDocumentId;
  }
  const supplierOrder = await Transaction.findOne({ linkedTransactionId: request.transactionId, side: "supplier", deletedAt: null })
    .select("_id organizationId")
    .lean();
  if (!supplierOrder) return null;
  const details = [request.inspectionCompany && "Inspection company: " + request.inspectionCompany, request.loadingPort && "Loading port: " + request.loadingPort, request.scope]
    .filter(Boolean)
    .join(". ");
  const item = await RequestedDocument.create({
    transactionId: supplierOrder._id,
    organizationId: supplierOrder.organizationId,
    side: "supplier",
    title: INSPECTION_REPORT_TITLE,
    notes: details || undefined,
    requestedBy: "staff",
    requestedByUserId: new Types.ObjectId(userId),
    status: "requested",
  });
  request.reportRequestedDocumentId = item._id;
  await request.save();
  return item._id;
}

/** Staff decide the request, and later record that the report arrived. */
export async function decideInspectionRequest(input: {
  transactionId: string;
  requestId: string;
  status: Exclude<InspectionRequestStatus, "requested">;
  note?: string;
  userId: string;
}): Promise<InspectionRequestView | null> {
  await tryConnectMongo();
  const { InspectionRequest, RequestedDocument } = await import("@/models");
  const row = await InspectionRequest.findOne({
    _id: input.requestId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  });
  if (!row) return null;
  row.status = input.status;
  if (input.note !== undefined) row.decisionNote = input.note || undefined;
  row.decidedAt = new Date();
  row.decidedByUserId = new Types.ObjectId(input.userId);
  if (input.status === "report_received") row.reportReceivedAt = new Date();
  await row.save();

  if (input.status === "granted" || input.status === "report_received") {
    const itemId = await ensureInspectionReportItem(row._id, input.userId);
    if (itemId && input.status === "report_received") {
      await RequestedDocument.updateOne({ _id: itemId }, { $set: { status: "received_from_supplier" } });
    }
  }

  await writeAuditEvent({
    action: "inspection_request." + input.status,
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
    metadata: { requestId: input.requestId },
  });
  return view(row);
}

/** The buyer can withdraw their own request while nobody has decided it. */
export async function withdrawInspectionRequest(input: { transactionId: string; requestId: string; userId: string; onlyIfOwnAndRequested: boolean }): Promise<boolean> {
  await tryConnectMongo();
  const { InspectionRequest } = await import("@/models");
  const filter: Record<string, unknown> = {
    _id: input.requestId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  };
  if (input.onlyIfOwnAndRequested) {
    filter.requestedBy = "buyer";
    filter.status = "requested";
  }
  const row = await InspectionRequest.findOne(filter);
  if (!row) return false;
  row.deletedAt = new Date();
  await row.save();
  await writeAuditEvent({
    action: "inspection_request.withdrawn",
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
  });
  return true;
}

/** When the supplier order is opened, every request that is already granted asks the supplier for its report. */
export async function openInspectionReportsOnSupplierOrder(buyerTransactionId: Types.ObjectId, userId: string): Promise<number> {
  await tryConnectMongo();
  const { InspectionRequest } = await import("@/models");
  const granted = await InspectionRequest.find({
    transactionId: buyerTransactionId,
    deletedAt: null,
    status: { $in: ["granted", "report_received"] },
  })
    .select("_id")
    .lean();
  let opened = 0;
  for (const g of granted) {
    if (await ensureInspectionReportItem(g._id, userId)) opened += 1;
  }
  return opened;
}
