import type { UploadFolder } from "@/models/StoredUpload";

export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export const UPLOAD_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export const CAREER_RESUME_MAX_BYTES = 5 * 1024 * 1024;

export function isUploadFolder(value: string): value is UploadFolder {
  return (
    value === "products" ||
    value === "gallery" ||
    value === "pages" ||
    value === "misc" ||
    value === "careers"
  );
}

export function buildUploadPublicUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseUploadPublicUrl(
  url: string,
): { folder: UploadFolder; filename: string } | null {
  const trimmed = url.trim();
  const match = trimmed.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const folder = match[1];
  const filename = match[2];
  if (!isUploadFolder(folder)) return null;
  if (!filename || filename.includes("..") || filename.includes("/")) return null;
  return { folder, filename };
}
