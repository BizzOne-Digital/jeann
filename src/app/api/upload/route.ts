import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { UPLOAD_MAX_BYTES, isUploadFolder } from "@/lib/uploads/constants";
import { resolveImageUploadMime } from "@/lib/uploads/resolve-image-mime";
import {
  deleteStoredUploadByUrl,
  saveStoredUpload,
} from "@/lib/uploads/stored-upload-service";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const folderRaw = String(formData.get("folder") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (!isUploadFolder(folderRaw)) {
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 8MB limit." }, { status: 422 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = resolveImageUploadMime(file, buffer);
  if (!mimeType) {
    return NextResponse.json(
      {
        error:
          "Unsupported image type. Use JPEG, PNG, WebP, or GIF (not HEIC). On iPhone: Settings → Camera → Formats → Most Compatible.",
      },
      { status: 422 },
    );
  }

  const saved = await saveStoredUpload({ folder: folderRaw, mimeType, buffer });
  if (!saved) {
    return NextResponse.json(
      {
        error:
          "Unable to store upload. Check that MONGODB_URI is set on the server and the database is reachable.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    success: true,
    url: saved.url,
    filename: saved.filename,
    size: saved.size,
    folder: saved.folder,
  });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  const deleted = await deleteStoredUploadByUrl(url);
  if (!deleted) {
    return NextResponse.json({ error: "Upload not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
