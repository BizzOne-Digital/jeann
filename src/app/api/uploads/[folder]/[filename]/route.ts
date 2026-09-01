import { NextRequest, NextResponse } from "next/server";
import { isUploadFolder } from "@/lib/uploads/constants";
import { getStoredUploadBinary } from "@/lib/uploads/stored-upload-service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

function sanitizeFilename(filename: string): string | null {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return filename;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { folder, filename: rawFilename } = await context.params;
  const filename = sanitizeFilename(rawFilename);

  if (!filename || !isUploadFolder(folder)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const file = await getStoredUploadBinary(folder, filename);
  if (!file) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
