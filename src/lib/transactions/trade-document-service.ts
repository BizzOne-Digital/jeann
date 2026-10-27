import { randomBytes } from "crypto";
import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { getStorageProvider } from "@/lib/storage";
import { checksumBuffer } from "@/lib/files/kyb-upload";
import { writeAuditEvent } from "@/lib/audit/log";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { TradeDocumentType, TradeDocumentStatus } from "@/models/Document";
import { defaultStepForDocument, stepNumberFor, documentFilename } from "@/lib/transactions/document-steps";
import type { DocumentVersionStatus } from "@/models/DocumentVersion";

const TEST_WATERMARK = "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY";

export async function createTradeDocument(input: {
  transactionId: string;
  organizationId: string;
  documentType: TradeDocumentType;
  title: string;
  createdByUserId: string;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  internalOnly?: boolean;
  templateKey?: string;
  templateVersion?: number;
  stepKey?: string;
}) {
  await tryConnectMongo();
  const { Document, Transaction } = await import("@/models");
  let stepKey = input.stepKey;
  if (!stepKey) {
    const t = await Transaction.findById(input.transactionId).select("side").lean();
    stepKey = defaultStepForDocument(input.documentType, t?.side === "supplier" ? "supplier" : "buyer")?.stepKey;
  }
  return Document.create({
    stepKey,
    organizationId: new Types.ObjectId(input.organizationId),
    transactionId: new Types.ObjectId(input.transactionId),
    documentType: input.documentType,
    category: input.documentType,
    title: input.title,
    templateKey: input.templateKey,
    templateVersion: input.templateVersion,
    buyerVisible: input.buyerVisible ?? false,
    supplierVisible: input.supplierVisible ?? false,
    internalOnly: input.internalOnly ?? true,
    workflowStatus: "draft",
    createdByUserId: new Types.ObjectId(input.createdByUserId),
    ownerOrganizationId: new Types.ObjectId(input.organizationId),
    sensitivity: "confidential",
  });
}

export async function generateDocumentPdf(input: {
  documentId: string;
  actorUserId: string;
  structuredData: Record<string, unknown>;
  clauseTexts?: string[];
  isDraft?: boolean;
  transactionNumber?: string;
  documentType?: string;
}) {
  await tryConnectMongo();
  const { Document, DocumentVersion, Transaction } = await import("@/models");
  const doc = await Document.findById(input.documentId);
  if (!doc || doc.deletedAt) throw new Error("document_not_found");
  const txForStep = doc.transactionId
    ? await Transaction.findById(doc.transactionId).select("side transactionNumber").lean()
    : null;
  const side = txForStep?.side === "supplier" ? "supplier" : "buyer";
  if (!doc.stepKey) {
    const def = defaultStepForDocument(doc.documentType, side);
    if (def) doc.stepKey = def.stepKey;
  }
  const stepNumber = stepNumberFor(doc.stepKey, side);
  const txNumber = input.transactionNumber ?? txForStep?.transactionNumber ?? "";

  const latest = await DocumentVersion.findOne({ documentId: doc._id })
    .sort({ version: -1 })
    .lean();
  const version = latest ? latest.version + 1 : 1;

  const pdfBytes = await buildPdf({
    title: doc.title,
    transactionNumber: txNumber,
    documentType: doc.documentType ?? input.documentType ?? "document",
    stepNumber,
    version,
    isDraft: input.isDraft ?? true,
    structuredData: input.structuredData,
    clauseTexts: input.clauseTexts ?? [],
  });

  const buffer = Buffer.from(pdfBytes);
  const pdfName = documentFilename({
    transactionNumber: txNumber,
    stepNumber,
    documentType: doc.documentType,
    version,
  });
  const storageKey = `trade/${doc.organizationId}/${doc.transactionId}/${doc._id}/v${version}-${nanoid(12)}`;
  const storage = getStorageProvider();
  await storage.putPrivate({
    key: storageKey,
    body: buffer,
    mimeType: "application/pdf",
    filename: pdfName,
  });

  const versionDoc = await DocumentVersion.create({
    documentId: doc._id,
    version,
    storageKey,
    checksum: checksumBuffer(buffer),
    mimeType: "application/pdf",
    size: buffer.length,
    originalFilename: pdfName,
    uploadedBy: new Types.ObjectId(input.actorUserId),
    status: "draft",
    watermarkPolicy: input.isDraft ? "draft" : "none",
    locked: false,
    structuredData: input.structuredData,
    selectedClauseIds: [],
  });

  doc.currentVersionId = versionDoc._id;
  doc.workflowStatus = "draft";
  await doc.save();

  return { document: doc, version: versionDoc };
}

async function buildPdf(input: {
  title: string;
  transactionNumber: string;
  documentType: string;
  stepNumber?: number;
  version: number;
  isDraft: boolean;
  structuredData: Record<string, unknown>;
  clauseTexts: string[];
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(input.title);
  pdf.setSubject(
    `${input.transactionNumber} | Step ${input.stepNumber ?? "-"} | ${input.documentType} | v${input.version}`,
  );
  pdf.setKeywords([input.transactionNumber, input.documentType, `step-${input.stepNumber ?? 0}`]);
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = 800;

  const draw = (text: string, size = 10, useBold = false) => {
    if (y < 60) return;
    page.drawText(text.slice(0, 90), {
      x: 50,
      y,
      size,
      font: useBold ? bold : font,
      color: rgb(0.1, 0.1, 0.2),
    });
    y -= size + 4;
  };

  if (input.isDraft || process.env.NODE_ENV !== "production") {
    draw(TEST_WATERMARK, 12, true);
    y -= 8;
  }

  draw(input.title, 16, true);
  draw(`Transaction: ${input.transactionNumber}`);
  draw(`Document type: ${input.documentType} — Step ${input.stepNumber ?? "-"} — Version ${input.version}`);
  draw(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  y -= 8;

  for (const [key, value] of Object.entries(input.structuredData)) {
    if (value === undefined || value === null || value === "") continue;
    draw(`${key}: ${String(value)}`);
  }

  if (input.clauseTexts.length) {
    y -= 8;
    draw("Clauses:", 11, true);
    for (const clause of input.clauseTexts) {
      const lines = clause.split("\n").slice(0, 8);
      for (const line of lines) draw(line, 9);
      y -= 4;
    }
  }

  if (input.isDraft) {
    page.drawText("DRAFT", {
      x: 250,
      y: 400,
      size: 48,
      font: bold,
      color: rgb(0.85, 0.85, 0.85),
      rotate: degrees(45),
    });
  }

  return pdf.save();
}

export async function submitDocumentRevision(input: {
  documentId: string;
  versionId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Document, DocumentVersion } = await import("@/models");
  const version = await DocumentVersion.findOne({
    _id: input.versionId,
    documentId: input.documentId,
    status: "draft",
    locked: false,
  });
  if (!version) throw new Error("version_not_editable");

  version.status = "submitted";
  version.submittedAt = new Date();
  version.submittedByUserId = new Types.ObjectId(input.actorUserId);
  version.locked = true;
  await version.save();

  await Document.updateOne(
    { _id: input.documentId },
    { $set: { workflowStatus: "under_review" } },
  );

  return version;
}

export async function reviewDocumentRevision(input: {
  documentId: string;
  versionId: string;
  reviewerUserId: string;
  decision: "approved" | "changes_requested" | "rejected";
  comments?: string;
}) {
  await tryConnectMongo();
  const { Document, DocumentVersion, DocumentReview } = await import("@/models");

  const version = await DocumentVersion.findById(input.versionId);
  if (!version) throw new Error("version_not_found");

  if (input.decision === "changes_requested" && !input.comments?.trim()) {
    throw new Error("comment_required");
  }

  const statusMap: Record<string, DocumentVersionStatus> = {
    approved: "approved",
    changes_requested: "changes_requested",
    rejected: "rejected",
  };

  version.status = statusMap[input.decision];
  if (input.decision === "approved") version.locked = true;
  await version.save();

  await DocumentReview.create({
    documentVersionId: version._id,
    reviewerUserId: new Types.ObjectId(input.reviewerUserId),
    decision: input.decision,
    reason: input.comments,
  });

  const docStatusMap: Record<string, TradeDocumentStatus> = {
    approved: "approved",
    changes_requested: "changes_requested",
    rejected: "archived",
  };

  await Document.updateOne(
    { _id: input.documentId },
    { $set: { workflowStatus: docStatusMap[input.decision] } },
  );

  return version;
}

export async function sendDocumentToBuyer(input: {
  documentId: string;
  versionId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Document, DocumentVersion, Transaction } = await import("@/models");
  const version = await DocumentVersion.findOne({
    _id: input.versionId,
    documentId: input.documentId,
    status: "approved",
  });
  if (!version) throw new Error("version_not_approved");
  const docRow = await Document.findById(input.documentId).select("transactionId").lean();
  const sendTx = docRow?.transactionId
    ? await Transaction.findById(docRow.transactionId).select("side").lean()
    : null;
  const toSupplier = sendTx?.side === "supplier";

  version.status = "sent";
  version.locked = true;
  await version.save();

  await Document.updateOne(
    { _id: input.documentId },
    {
      $set: toSupplier
        ? { workflowStatus: "sent", supplierVisible: true, internalOnly: false, currentVersionId: version._id }
        : { workflowStatus: "sent", buyerVisible: true, internalOnly: false, currentVersionId: version._id },
    },
  );

  await writeAuditEvent({
    action: "document.sent",
    targetType: "document",
    targetId: input.documentId,
    actorUserId: input.actorUserId,
    metadata: { versionId: input.versionId },
  });

  return version;
}

export async function uploadSignedDocument(input: {
  documentId: string;
  versionId: string;
  actorUserId: string;
  signatoryName: string;
  signatoryTitle?: string;
  buffer: Buffer;
  filename: string;
  mimeType: string;
  method: "controlled_upload" | "admin_recorded_external";
  organizationId: string;
  transactionId: string;
  ipHash?: string;
  userAgent?: string;
}) {
  await tryConnectMongo();
  const { SignatureRecord, Document, DocumentVersion } = await import("@/models");

  const version = await DocumentVersion.findOne({
    _id: input.versionId,
    documentId: input.documentId,
    status: { $in: ["sent", "approved"] },
  });
  if (!version) throw new Error("version_not_signable");

  const passport = await Document.exists({
    transactionId: new Types.ObjectId(input.transactionId),
    documentType: "passport_copy",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });
  if (!passport) throw new Error("passport_required");

  const storageKey = `trade/signed/${input.transactionId}/${input.documentId}/${nanoid(16)}`;
  const storage = getStorageProvider();
  await storage.putPrivate({
    key: storageKey,
    body: input.buffer,
    mimeType: input.mimeType,
    filename: input.filename,
  });

  const checksum = checksumBuffer(input.buffer);

  await SignatureRecord.create({
    documentId: new Types.ObjectId(input.documentId),
    documentVersionId: version._id,
    transactionId: new Types.ObjectId(input.transactionId),
    signatoryUserId: new Types.ObjectId(input.actorUserId),
    signatoryOrganizationId: new Types.ObjectId(input.organizationId),
    signatoryName: input.signatoryName,
    signatoryTitle: input.signatoryTitle,
    signatureMethod: input.method,
    signedFileChecksum: checksum,
    signedStorageKey: storageKey,
    signedAt: new Date(),
    evidenceIpHash: input.ipHash,
    evidenceUserAgent: input.userAgent,
    status: "completed",
  });

  version.status = "signed";
  version.locked = true;
  await version.save();

  await Document.updateOne(
    { _id: input.documentId },
    { $set: { workflowStatus: "signed" } },
  );

  return { checksum, storageKey };
}

/** Upload a new trade document file (e.g. buyer ICPO, passport copy, supplier SPA). */
export async function uploadTransactionDocument(input: {
  transactionId: string;
  organizationId: string;
  actorUserId: string;
  documentType: TradeDocumentType;
  title: string;
  buffer: Buffer;
  filename: string;
  mimeType: string;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  submitForReview?: boolean;
}) {
  await tryConnectMongo();
  const doc = await createTradeDocument({
    transactionId: input.transactionId,
    organizationId: input.organizationId,
    documentType: input.documentType,
    title: input.title,
    createdByUserId: input.actorUserId,
    buyerVisible: input.buyerVisible ?? true,
    supplierVisible: input.supplierVisible ?? false,
    internalOnly: false,
  });

  const storageKey = `trade/${input.organizationId}/${input.transactionId}/${doc._id}/v1-${nanoid(12)}`;
  const storage = getStorageProvider();
  await storage.putPrivate({
    key: storageKey,
    body: input.buffer,
    mimeType: input.mimeType,
    filename: input.filename,
  });

  const { DocumentVersion } = await import("@/models");
  const versionDoc = await DocumentVersion.create({
    documentId: doc._id,
    version: 1,
    storageKey,
    checksum: checksumBuffer(input.buffer),
    mimeType: input.mimeType,
    size: input.buffer.length,
    originalFilename: input.filename,
    uploadedBy: new Types.ObjectId(input.actorUserId),
    status: input.submitForReview ? "submitted" : "draft",
    watermarkPolicy: "none",
    locked: Boolean(input.submitForReview),
    structuredData: {},
    selectedClauseIds: [],
    submittedAt: input.submitForReview ? new Date() : undefined,
    submittedByUserId: input.submitForReview
      ? new Types.ObjectId(input.actorUserId)
      : undefined,
  });

  doc.currentVersionId = versionDoc._id;
  doc.workflowStatus = input.submitForReview ? "under_review" : "draft";
  await doc.save();

  await writeAuditEvent({
    action: "document.uploaded",
    targetType: "document",
    targetId: String(doc._id),
    actorUserId: input.actorUserId,
    organizationId: input.organizationId,
    metadata: { documentType: input.documentType, filename: input.filename },
  });

  return { document: doc, version: versionDoc };
}

export async function getDocumentDownloadUrl(input: {
  documentId: string;
  versionId?: string;
  userId: string;
  /** Non-staff caller: only sent/signed versions or the caller's own uploads are downloadable. */
  external?: boolean;
}): Promise<{ url: string; filename: string }> {
  await tryConnectMongo();
  const { Document, DocumentVersion } = await import("@/models");
  const doc = await Document.findById(input.documentId).lean();
  if (!doc || doc.deletedAt) throw new Error("document_not_found");

  const version = input.versionId
    ? await DocumentVersion.findById(input.versionId).lean()
    : doc.currentVersionId
      ? await DocumentVersion.findById(doc.currentVersionId).lean()
      : await DocumentVersion.findOne({ documentId: doc._id }).sort({ version: -1 }).lean();

  if (!version?.storageKey) throw new Error("version_not_found");
  if (input.external) {
    const ok =
      ["sent", "signed"].includes(String(version.status)) ||
      String(version.uploadedBy) === input.userId;
    if (!ok || String(version.documentId) !== String(doc._id)) {
      // fall back to latest released version, if any
      const released = await DocumentVersion.findOne({
        documentId: doc._id,
        status: { $in: ["sent", "signed"] },
      })
        .sort({ version: -1 })
        .lean();
      if (!released?.storageKey || input.versionId) throw new Error("version_not_found");
      return getDocumentDownloadUrl({ ...input, versionId: String(released._id) });
    }
  }

  const storage = getStorageProvider();
  const url = await storage.getSignedUrl(version.storageKey, {
    expiresInSeconds: 300,
    filename: version.originalFilename ?? `${doc.title}.pdf`,
    disposition: "attachment",
  });

  await writeAuditEvent({
    action: "file.download",
    targetType: "document",
    targetId: input.documentId,
    actorUserId: input.userId,
    metadata: { versionId: String(version._id) },
  });

  return { url, filename: version.originalFilename ?? doc.title };
}
