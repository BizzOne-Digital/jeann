import { Types } from "mongoose";
import { generateLeadReference } from "@/lib/leads/persist";
import { hashIp } from "@/lib/db/ids";
import { money, mulMoney } from "@/lib/finance/money";
import { notifyAdmins } from "@/lib/notifications/service";
import { writeAuditEvent } from "@/lib/audit/log";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { PurchaseRequestStatus } from "@/models/PurchaseRequest";

const EDITABLE_STATUSES: PurchaseRequestStatus[] = ["draft", "more_information_required"];

export async function createBuyerRequestDraft(input: {
  organizationId: string;
  userId: string;
  data: Record<string, unknown>;
}) {
  await tryConnectMongo();
  const { PurchaseRequest } = await import("@/models");

  const reference = generateLeadReference("BR");
  const doc = await PurchaseRequest.create({
    reference,
    organizationId: new Types.ObjectId(input.organizationId),
    submittedByUserId: new Types.ObjectId(input.userId),
    source: "buyer_portal",
    status: "draft",
    productName: String(input.data.productName ?? "Unspecified product"),
    ...mapRequestFields(input.data),
  });

  return doc;
}

function mapRequestFields(data: Record<string, unknown>) {
  return {
    productId: data.productId ? new Types.ObjectId(String(data.productId)) : undefined,
    productCategoryId: data.productCategoryId
      ? new Types.ObjectId(String(data.productCategoryId))
      : undefined,
    specificationVersionId: data.specificationVersionId
      ? new Types.ObjectId(String(data.specificationVersionId))
      : undefined,
    requestedSpecification: data.requestedSpecification
      ? String(data.requestedSpecification)
      : undefined,
    quantity: data.quantity ? String(data.quantity) : undefined,
    unit: data.unit ? String(data.unit) : undefined,
    quantityTolerance: data.quantityTolerance ? String(data.quantityTolerance) : undefined,
    monthlyRequirement: data.monthlyRequirement ? String(data.monthlyRequirement) : undefined,
    contractDuration: data.contractDuration ? String(data.contractDuration) : undefined,
    originPreference: data.originPreference ? String(data.originPreference) : undefined,
    destinationCountry: data.destinationCountry ? String(data.destinationCountry) : undefined,
    destinationPort: data.destinationPort ? String(data.destinationPort) : undefined,
    loadingPort: data.loadingPort ? String(data.loadingPort) : undefined,
    incoterm: data.incoterm ? String(data.incoterm) : undefined,
    namedPortPlace: data.namedPortPlace ? String(data.namedPortPlace) : undefined,
    packaging: data.packaging ? String(data.packaging) : undefined,
    inspection: data.inspection ? String(data.inspection) : undefined,
    paymentPreference: data.paymentPreference ? String(data.paymentPreference) : undefined,
    paymentTermId: data.paymentTermId ? String(data.paymentTermId) : undefined,
    iccCode: data.iccCode ? String(data.iccCode) : undefined,
    timeline: data.timeline ? String(data.timeline) : undefined,
    requiredDocuments: Array.isArray(data.requiredDocuments)
      ? data.requiredDocuments.map(String)
      : undefined,
    notes: data.notes ? String(data.notes) : undefined,
    message: data.message ? String(data.message) : undefined,
    pricePerMt: typeof data.pricePerMt === "number" ? data.pricePerMt : undefined,
    contractYears: typeof data.contractYears === "number" ? data.contractYears : undefined,
    contractTotal: typeof data.contractTotal === "number" ? data.contractTotal : undefined,
  };
}

export async function updateBuyerRequestDraft(
  requestId: string,
  organizationId: string,
  data: Record<string, unknown>,
) {
  await tryConnectMongo();
  const { PurchaseRequest } = await import("@/models");
  const doc = await PurchaseRequest.findOne({
    _id: requestId,
    organizationId: new Types.ObjectId(organizationId),
    status: { $in: EDITABLE_STATUSES },
  });
  if (!doc) throw new Error("request_not_editable");

  Object.assign(doc, mapRequestFields(data));
  if (data.productName) doc.productName = String(data.productName);
  await doc.save();
  return doc;
}

export async function submitBuyerRequest(input: {
  requestId: string;
  organizationId: string;
  userId: string;
  ipHash?: string;
}) {
  await tryConnectMongo();
  const { PurchaseRequest } = await import("@/models");
  const doc = await PurchaseRequest.findOne({
    _id: input.requestId,
    organizationId: new Types.ObjectId(input.organizationId),
    status: { $in: EDITABLE_STATUSES },
  });
  if (!doc) throw new Error("request_not_editable");

  if (!doc.productName?.trim()) throw new Error("incomplete_request");

  doc.status = "submitted";
  doc.lockedAt = new Date();
  doc.ipHash = input.ipHash ?? hashIp(undefined);
  await doc.save();

  await notifyAdmins({
    type: "buyer_request_submitted",
    title: "Buyer purchase request submitted",
    body: `${doc.productName} — ${doc.reference}`,
    href: `/admin/buyer-requests`,
    emailSubject: "New buyer purchase request",
    emailText: `Request ${doc.reference} submitted for review.`,
  });

  return doc;
}

export async function reviewBuyerRequest(input: {
  requestId: string;
  action: "qualify" | "decline" | "more_info" | "spam" | "convert";
  actorUserId: string;
  comment?: string;
  reason?: string;
}) {
  await tryConnectMongo();
  const { PurchaseRequest } = await import("@/models");
  const doc = await PurchaseRequest.findById(input.requestId);
  if (!doc) throw new Error("not_found");

  switch (input.action) {
    case "qualify":
      doc.status = "qualified";
      doc.reviewComments = input.comment;
      break;
    case "decline":
      if (!input.reason?.trim()) throw new Error("reason_required");
      doc.status = "declined";
      doc.declineReason = input.reason;
      break;
    case "more_info":
      if (!input.comment?.trim()) throw new Error("comment_required");
      doc.status = "more_information_required";
      doc.reviewComments = input.comment;
      doc.lockedAt = undefined;
      break;
    case "spam":
      doc.status = "spam";
      break;
    case "convert":
      if (doc.status !== "qualified") throw new Error("must_be_qualified");
      break;
    default:
      throw new Error("invalid_action");
  }

  await doc.save();
  return doc;
}

export async function deleteBuyerRequestDraft(requestId: string, organizationId: string) {
  await tryConnectMongo();
  const { PurchaseRequest } = await import("@/models");
  const result = await PurchaseRequest.deleteOne({
    _id: requestId,
    organizationId: new Types.ObjectId(organizationId),
    status: "draft",
  });
  if (result.deletedCount === 0) throw new Error("not_found");
}
