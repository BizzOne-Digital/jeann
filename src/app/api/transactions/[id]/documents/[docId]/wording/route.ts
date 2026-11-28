import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { loadDocumentWording } from "@/lib/transactions/trade-document-service";

export const runtime = "nodejs";

/** Staff: the full wording of a document for this transaction, ready to edit. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string; docId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id: transactionId, docId } = await params;
    const { Document } = await import("@/models");
    const owned = await Document.exists({ _id: docId, transactionId, deletedAt: null });
    if (!owned) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const result = await loadDocumentWording(docId);
    if (!result) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
