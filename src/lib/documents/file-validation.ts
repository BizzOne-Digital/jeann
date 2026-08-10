export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const ALLOWED_DOCUMENT_MIMES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
] as const;

export type AllowedDocumentMime = (typeof ALLOWED_DOCUMENT_MIMES)[number];

export const MIME_TO_EXTENSIONS: Record<AllowedDocumentMime, string[]> = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

/** Magic-byte signatures for basic content sniffing (not a substitute for AV scan). */
const MAGIC: Array<{ mime: AllowedDocumentMime; bytes: number[]; offset?: number }> = [
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

export interface FileValidationInput {
  filename: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface FileValidationResult {
  ok: boolean;
  mimeType?: AllowedDocumentMime;
  errors: string[];
}

function extensionOf(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx).toLowerCase() : "";
}

function sniffMime(buffer: Buffer): AllowedDocumentMime | null {
  for (const rule of MAGIC) {
    const offset = rule.offset ?? 0;
    if (buffer.length < offset + rule.bytes.length) continue;
    const match = rule.bytes.every((b, i) => buffer[offset + i] === b);
    if (match) return rule.mime;
  }
  return null;
}

export function validateUpload(input: FileValidationInput): FileValidationResult {
  const errors: string[] = [];

  if (input.size <= 0) errors.push("Empty file");
  if (input.size > MAX_UPLOAD_BYTES) {
    errors.push(`File exceeds maximum size of ${MAX_UPLOAD_BYTES} bytes`);
  }

  const ext = extensionOf(input.filename);
  const declared = input.mimeType.toLowerCase() as AllowedDocumentMime;
  if (!ALLOWED_DOCUMENT_MIMES.includes(declared)) {
    errors.push("Unsupported file type");
  }

  const allowedExts = MIME_TO_EXTENSIONS[declared];
  if (allowedExts && ext && !allowedExts.includes(ext)) {
    errors.push("File extension does not match declared type");
  }

  const sniffed = sniffMime(input.buffer);
  if (!sniffed) {
    errors.push("Unable to verify file content");
  } else if (sniffed !== declared) {
    errors.push("File content does not match declared MIME type");
  }

  if (errors.length) return { ok: false, errors };

  return { ok: true, mimeType: sniffed ?? declared, errors: [] };
}

export function assertValidUpload(input: FileValidationInput): AllowedDocumentMime {
  const result = validateUpload(input);
  if (!result.ok || !result.mimeType) {
    throw new Error(result.errors.join("; ") || "Invalid upload");
  }
  return result.mimeType;
}
