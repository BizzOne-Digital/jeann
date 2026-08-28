import { createHash } from "crypto";
import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { notifyPresentationPackageReady } from "@/lib/shipments/notifications";
import { validateShippingDocuments } from "@/lib/shipments/document-validation";

export async function createPresentationPackage(input: {
  shipmentLotId: string;
  bankingInstrumentId: string;
  checklistId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { PresentationPackage, Document } = await import("@/models");

  const validation = await validateShippingDocuments(input.shipmentLotId);
  if (validation.blocking.length > 0) {
    throw new Error("blocking_validation_errors");
  }

  const docs = await Document.find({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    workflowStatus: { $in: ["approved", "signed"] },
    deletedAt: null,
  }).lean();

  const manifest = docs.map((d) => String(d._id));
  const checksum = createHash("sha256").update(manifest.join("|")).digest("hex");
  const packageReference = `PKG-${input.shipmentLotId.slice(-6)}-${Date.now()}`;

  const pkg = await PresentationPackage.create({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    bankingInstrumentId: new Types.ObjectId(input.bankingInstrumentId),
    checklistId: new Types.ObjectId(input.checklistId),
    packageReference,
    documentManifest: manifest,
    checksum,
    status: validation.warnings.length > 0 ? "validation_pending" : "draft",
    validationSummary: JSON.stringify({
      blocking: validation.blocking.length,
      warnings: validation.warnings.length,
    }),
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "presentation_package.created",
    targetType: "presentation_package",
    targetId: String(pkg._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return pkg;
}

export async function approvePresentationPackage(input: {
  packageId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { PresentationPackage } = await import("@/models");
  const pkg = await PresentationPackage.findById(input.packageId);
  if (!pkg) throw new Error("not_found");

  const validation = await validateShippingDocuments(String(pkg.shipmentLotId));
  if (validation.blocking.length > 0) {
    pkg.status = "blocked";
    await pkg.save();
    throw new Error("blocking_validation_errors");
  }

  pkg.status = "approved";
  pkg.approvedByUserId = new Types.ObjectId(input.actorUserId);
  pkg.approvedAt = new Date();
  await pkg.save();

  await writeAuditEvent({
    action: "presentation_package.approved",
    targetType: "presentation_package",
    targetId: String(pkg._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  await notifyPresentationPackageReady({
    packageReference: pkg.packageReference,
    lotId: String(pkg.shipmentLotId),
  });

  return pkg;
}

export async function linkPresentationToBankPresentation(input: {
  packageId: string;
  bankPresentationId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { PresentationPackage } = await import("@/models");
  const pkg = await PresentationPackage.findById(input.packageId);
  if (!pkg) throw new Error("not_found");

  pkg.bankPresentationId = new Types.ObjectId(input.bankPresentationId);
  pkg.status = "ready_for_presentation";
  await pkg.save();

  await writeAuditEvent({
    action: "presentation_package.linked_bank_presentation",
    targetType: "presentation_package",
    targetId: String(pkg._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { bankPresentationId: input.bankPresentationId },
  });

  return pkg;
}
