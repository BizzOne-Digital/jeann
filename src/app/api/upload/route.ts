import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  UPLOAD_MAX_BYTES,
  UPLOAD_MIME_TYPES,
  isUploadFolder,
} from "@/lib/uploads/constants";
import {
  deleteStoredUploadByUrl,
  saveStoredUpload,
} from "@/lib/uploads/stored-upload-service";

export const runtime = "nodejs";

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

  const mimeType = file.type || "application/octet-stream";
  if (!UPLOAD_MIME_TYPES[mimeType]) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." },
      { status: 422 },
    );
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 8MB limit." }, { status: 422 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveStoredUpload({ folder: folderRaw, mimeType, buffer });
  if (!saved) {
    return NextResponse.json({ error: "Unable to store upload." }, { status: 503 });
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
