import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { getStorageProvider } from "@/lib/storage";
import { checksumBuffer, validateKybUpload } from "@/lib/files/kyb-upload";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  submitDocumentRevision,
  reviewDocumentRevision,
} from "@/lib/transactions/trade-document-service";

const TEST_MARKER = "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY";

export async function uploadShippingDocument(input: {
  shipmentLotId: string;
  organizationId: string;
  transactionId: string;
  checklistRequirementId?: string;
  shippingDocumentType: string;
  title: string;
  actorUserId: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  bankingVisible?: boolean;
  responsibleParty?: string;
}) {
  await tryConnectMongo();
  const validation = validateKybUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    size: input.buffer.length,
    buffer: input.buffer,
  });
  if (!validation.ok) throw new Error(validation.error);

  const { Document, DocumentVersion, ShipmentDocumentRequirement } = await import("@/models");

  let doc = await Document.findOne({
    shipmentLotId: new Types.ObjectId(input.shipmentLotId),
    shippingDocumentType: input.shippingDocumentType,
    checklistRequirementId: input.checklistRequirementId
      ? new Types.ObjectId(input.checklistRequirementId)
      : undefined,
    deletedAt: null,
  });

  if (!doc) {
    doc = await Document.create({
      organizationId: new Types.ObjectId(input.organizationId),
      transactionId: new Types.ObjectId(input.transactionId),
      shipmentLotId: new Types.ObjectId(input.shipmentLotId),
      checklistRequirementId: input.checklistRequirementId
        ? new Types.ObjectId(input.checklistRequirementId)
        : undefined,
      shippingDocumentType: input.shippingDocumentType,
      category: "shipping",
      title: input.title,
      buyerVisible: input.buyerVisible ?? false,
      supplierVisible: input.supplierVisible ?? false,
      bankingVisible: input.bankingVisible ?? false,
      internalOnly: false,
      workflowStatus: "draft",
      sensitivity: "confidential",
      createdByUserId: new Types.ObjectId(input.actorUserId),
      ownerOrganizationId: new Types.ObjectId(input.organizationId),
    });
  }

  const latest = await DocumentVersion.findOne({ documentId: doc._id }).sort({ version: -1 }).lean();
  const versionNum = latest ? latest.version + 1 : 1;

  const storageKey = `shipping/${input.organizationId}/${input.shipmentLotId}/${doc._id}/v${versionNum}-${nanoid(12)}`;
  const storage = getStorageProvider();
  await storage.putPrivate({
    key: storageKey,
    body: input.buffer,
    mimeType: input.mimeType,
    filename: input.filename,
  });

  const version = await DocumentVersion.create({
    documentId: doc._id,
    version: versionNum,
    storageKey,
    checksum: checksumBuffer(input.buffer),
    mimeType: input.mimeType,
    size: input.buffer.length,
    originalFilename: input.filename,
    uploadedBy: new Types.ObjectId(input.actorUserId),
    status: "draft",
    watermarkPolicy: "confidential",
    locked: false,
    structuredData: { qaMarker: TEST_MARKER },
  });

  doc.currentVersionId = version._id;
  doc.workflowStatus = "draft";
  await doc.save();

  if (input.checklistRequirementId) {
    await ShipmentDocumentRequirement.updateOne(
      { _id: input.checklistRequirementId },
      {
        $set: {
          linkedDocumentId: doc._id,
          uploadStatus: "uploaded",
        },
      },
    );
  }

  await writeAuditEvent({
    action: "shipping_document.uploaded",
    targetType: "document",
    targetId: String(doc._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: {
      shipmentLotId: input.shipmentLotId,
      version: versionNum,
      shippingDocumentType: input.shippingDocumentType,
    },
  });

  return { document: doc, version };
}

export async function submitShippingDocumentRevision(input: {
  documentId: string;
  versionId: string;
  actorUserId: string;
}) {
  const version = await submitDocumentRevision(input);
  await writeAuditEvent({
    action: "shipping_document.submitted",
    targetType: "document",
    targetId: input.documentId,
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { versionId: input.versionId },
  });
  return version;
}

export async function reviewShippingDocumentRevision(input: {
  documentId: string;
  versionId: string;
  reviewerUserId: string;
  decision: "approved" | "changes_requested" | "rejected";
  comments?: string;
  checklistRequirementId?: string;
}) {
  const version = await reviewDocumentRevision(input);
  const { ShipmentDocumentRequirement } = await import("@/models");

  if (input.checklistRequirementId) {
    const statusMap = {
      approved: "approved",
      changes_requested: "changes_requested",
      rejected: "rejected",
    };
    await ShipmentDocumentRequirement.updateOne(
      { _id: input.checklistRequirementId },
      {
        $set: {
          approvalStatus: statusMap[input.decision],
          validationStatus: input.decision === "approved" ? "passed" : "failed",
          uploadStatus: input.decision === "changes_requested" ? "changes_requested" : "uploaded",
          presentationStatus:
            input.decision === "approved" ? "presentation_ready" : "not_started",
        },
      },
    );
  }

  await writeAuditEvent({
    action: "shipping_document.reviewed",
    targetType: "document",
    targetId: input.documentId,
    actorUserId: input.reviewerUserId,
    result: "success",
    metadata: { decision: input.decision, versionId: input.versionId },
  });

  return version;
}
