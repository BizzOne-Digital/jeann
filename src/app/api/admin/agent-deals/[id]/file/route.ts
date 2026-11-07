import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminApiSession())) return adminDeniedResponse();
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { AgentDeal } = await import("@/models");
  const doc = await AgentDeal.findById(id).select("+fileData filename mimeType").lean();
  if (!doc?.fileData) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const bytes = Buffer.from(doc.fileData as unknown as Buffer);
  const safeName = String(doc.filename).replace(/[^\w.\- ]+/g, "_");
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
