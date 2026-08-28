import { customAlphabet } from "nanoid";
import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyAdmins } from "@/lib/notifications/service";
import { tryConnectMongo } from "@/lib/db/mongoose";
import type { SupplierOfferStatus } from "@/models/SupplierOffer";

const offerNano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

export function generateSupplierOfferId(): string {
  const year = new Date().getUTCFullYear();
  return `SO-${year}-${offerNano()}`;
}

export async function createSupplierOfferDraft(input: {
  organizationId: string;
  userId: string;
  productName: string;
  productId?: string;
  productCategory?: string;
  specification?: string;
  origin?: string;
  availableQuantity?: string;
  unit?: string;
  monthlyCapacity?: string;
  price?: string;
  currency?: string;
  loadingPort?: string;
  incoterm?: string;
  packaging?: string;
  inspectionAvailability?: string;
  certifications?: string[];
  offerValidity?: string;
}) {
  await tryConnectMongo();
  const { SupplierOffer } = await import("@/models");

  const offer = await SupplierOffer.create({
    offerId: generateSupplierOfferId(),
    source: "portal",
    organizationId: new Types.ObjectId(input.organizationId),
    submittedByUserId: new Types.ObjectId(input.userId),
    productName: input.productName,
    productId: input.productId ? new Types.ObjectId(input.productId) : undefined,
    productCategory: input.productCategory,
    specification: input.specification,
    origin: input.origin,
    availableQuantity: input.availableQuantity,
    unit: input.unit,
    monthlyCapacity: input.monthlyCapacity,
    price: input.price,
    currency: input.currency,
    loadingPort: input.loadingPort,
    incoterm: input.incoterm,
    packaging: input.packaging,
    inspectionAvailability: input.inspectionAvailability,
    certifications: input.certifications,
    offerValidity: input.offerValidity,
    supportingFiles: [],
    status: "draft",
  });

  await writeAuditEvent({
    action: "supplier_offer.created",
    targetType: "supplier_offer",
    targetId: String(offer._id),
    actorUserId: input.userId,
    organizationId: input.organizationId,
    result: "success",
  });

  return offer;
}

export async function submitSupplierOffer(offerId: string, userId: string, organizationId: string) {
  await tryConnectMongo();
  const { SupplierOffer } = await import("@/models");
  const offer = await SupplierOffer.findOne({
    _id: offerId,
    organizationId: new Types.ObjectId(organizationId),
  });
  if (!offer) throw new Error("not_found");
  if (offer.status !== "draft" && offer.status !== "more_information_required") {
    throw new Error("invalid_status");
  }

  offer.status = "submitted";
  offer.submittedByUserId = new Types.ObjectId(userId);
  await offer.save();

  await writeAuditEvent({
    action: "supplier_offer.submitted",
    targetType: "supplier_offer",
    targetId: String(offer._id),
    actorUserId: userId,
    organizationId,
    result: "success",
  });

  await notifyAdmins({
    type: "supplier_offer_submitted",
    title: "Supplier offer submitted",
    body: `Offer ${offer.offerId} submitted for review.`,
    href: `/admin/supplier-offers`,
  });

  return offer;
}

export async function reviewSupplierOffer(input: {
  offerId: string;
  actorUserId: string;
  action: "under_review" | "more_info" | "qualify" | "decline" | "spam";
  notes?: string;
  reason?: string;
}) {
  await tryConnectMongo();
  const { SupplierOffer } = await import("@/models");
  const offer = await SupplierOffer.findById(input.offerId);
  if (!offer) throw new Error("not_found");

  const statusMap: Record<string, SupplierOfferStatus> = {
    under_review: "under_review",
    more_info: "more_information_required",
    qualify: "qualified",
    decline: "declined",
    spam: "spam",
  };

  offer.status = statusMap[input.action];
  if (input.notes) offer.reviewNotes = input.notes;
  if (input.reason) offer.declinedReason = input.reason;
  await offer.save();

  await writeAuditEvent({
    action: `supplier_offer.${input.action}`,
    targetType: "supplier_offer",
    targetId: String(offer._id),
    actorUserId: input.actorUserId,
    organizationId: String(offer.organizationId),
    result: "success",
    metadata: { notes: input.notes, reason: input.reason },
  });

  return offer;
}
