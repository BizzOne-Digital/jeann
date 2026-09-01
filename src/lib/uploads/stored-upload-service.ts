import { randomBytes } from "crypto";
import type { UploadFolder } from "@/models/StoredUpload";
import {
  UPLOAD_MIME_TYPES,
  buildUploadPublicUrl,
  parseUploadPublicUrl,
} from "@/lib/uploads/constants";
import { tryConnectMongo } from "@/lib/db/mongoose";

export function extensionForMime(mimeType: string): string | null {
  return UPLOAD_MIME_TYPES[mimeType] ?? null;
}

export function generateUploadFilename(mimeType: string): string | null {
  const ext = extensionForMime(mimeType);
  if (!ext) return null;
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function saveStoredUpload(input: {
  folder: UploadFolder;
  mimeType: string;
  buffer: Buffer;
}): Promise<{ url: string; filename: string; size: number; folder: UploadFolder } | null> {
  const conn = await tryConnectMongo();
  if (!conn) return null;

  const filename = generateUploadFilename(input.mimeType);
  if (!filename) return null;

  const { StoredUpload } = await import("@/models");
  await StoredUpload.create({
    folder: input.folder,
    filename,
    mimeType: input.mimeType,
    size: input.buffer.length,
    data: input.buffer,
  });

  return {
    folder: input.folder,
    filename,
    size: input.buffer.length,
    url: buildUploadPublicUrl(input.folder, filename),
  };
}

export async function getStoredUploadBinary(
  folder: UploadFolder,
  filename: string,
): Promise<{ mimeType: string; size: number; data: Buffer } | null> {
  const conn = await tryConnectMongo();
  if (!conn) return null;

  const { StoredUpload } = await import("@/models");
  const doc = await StoredUpload.findOne({ folder, filename }).select("+data").lean();
  if (!doc?.data) return null;

  return {
    mimeType: doc.mimeType,
    size: doc.size,
    data: Buffer.from(doc.data),
  };
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadPublicUrl(url);
  if (!parsed) return false;

  const conn = await tryConnectMongo();
  if (!conn) return false;

  const { StoredUpload } = await import("@/models");
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}

export { parseUploadPublicUrl };
