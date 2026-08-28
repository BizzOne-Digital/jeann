import { createHash, randomBytes } from "crypto";
import { nanoid } from "nanoid";
import { getStorageProvider } from "@/lib/storage";
import type { KybDocumentType } from "@/models/KybDocument";

export const KYB_MAX_BYTES = 10 * 1024 * 1024;
export const KYB_ALLOWED_MIME = new Set(["application/pdf", "image/jpeg", "image/png"]);

export function validateKybUpload(file: {
  filename: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}): { ok: true } | { ok: false; error: string } {
  if (file.size <= 0 || file.size > KYB_MAX_BYTES) {
    return { ok: false, error: "File exceeds the 10 MB limit or is empty." };
  }

  const ext = file.filename.toLowerCase().split(".").pop() ?? "";
  const allowedExt = new Set(["pdf", "jpg", "jpeg", "png"]);
  if (!allowedExt.has(ext)) {
    return { ok: false, error: "Unsupported file extension." };
  }

  if (!KYB_ALLOWED_MIME.has(file.mimeType)) {
    return { ok: false, error: "Unsupported file type." };
  }

  // Basic magic-byte checks
  const head = file.buffer.subarray(0, 4);
  if (file.mimeType === "application/pdf" && head[0] !== 0x25 && head[1] !== 0x50) {
    return { ok: false, error: "File content does not match PDF." };
  }
  if (file.mimeType === "image/png" && head[0] !== 0x89) {
    return { ok: false, error: "File content does not match PNG." };
  }
  if (file.mimeType === "image/jpeg" && head[0] !== 0xff) {
    return { ok: false, error: "File content does not match JPEG." };
  }

  return { ok: true };
}

export function checksumBuffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function storeKybDocument(input: {
  organizationId: string;
  cisProfileId: string;
  cisVersion: number;
  documentType: KybDocumentType;
  filename: string;
  mimeType: string;
  buffer: Buffer;
  uploadedBy: string;
}) {
  const validation = validateKybUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    size: input.buffer.length,
    buffer: input.buffer,
  });
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const storageKey = `kyb/${input.organizationId}/${input.cisProfileId}/v${input.cisVersion}/${nanoid(16)}-${randomBytes(4).toString("hex")}`;
  const storage = getStorageProvider();
  await storage.putPrivate({
    key: storageKey,
    body: input.buffer,
    mimeType: input.mimeType,
    filename: input.filename,
  });

  return {
    storageKey,
    checksum: checksumBuffer(input.buffer),
    sizeBytes: input.buffer.length,
  };
}
