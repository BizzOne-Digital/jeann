import { UPLOAD_MIME_TYPES } from "@/lib/uploads/constants";

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/** Non-standard types some browsers send. */
const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
};

function mimeFromExtension(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return EXT_TO_MIME[ext] ?? null;
}

function mimeFromMagic(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif";
  }
  return null;
}

/**
 * Resolve a supported image MIME type from browser metadata, filename, and bytes.
 * Returns null when the file is not a supported admin image type.
 */
export function resolveImageUploadMime(file: File, buffer: Buffer): string | null {
  const declared = (file.type || "").trim().toLowerCase();
  const normalizedDeclared = MIME_ALIASES[declared] ?? declared;

  const declaredExt = normalizedDeclared ? UPLOAD_MIME_TYPES[normalizedDeclared] : undefined;
  if (declaredExt && ["jpg", "png", "webp", "gif"].includes(declaredExt)) {
    return normalizedDeclared;
  }

  const fromName = mimeFromExtension(file.name);
  if (fromName) return fromName;

  const fromMagic = mimeFromMagic(buffer);
  if (fromMagic) return fromMagic;

  return null;
}
