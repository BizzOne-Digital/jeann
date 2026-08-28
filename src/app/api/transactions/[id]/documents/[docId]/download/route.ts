import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getDocumentDownloadUrl } from "@/lib/transactions/trade-document-service";
import { assertOrgScope } from "@/lib/authorization/authorize";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:download" });
    if ("error" in auth) return auth.error;

    const { id: transactionId, docId } = await params;
    const versionId = request.nextUrl.searchParams.get("versionId") ?? undefined;

    const { Transaction, Document } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const doc = await Document.findById(docId).lean();
    if (!doc || String(doc.transactionId) !== String(tx._id)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:download");
      if (doc.internalOnly) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const isBuyer = tx.side === "buyer";
      if (isBuyer && !doc.buyerVisible) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      if (!isBuyer && !doc.supplierVisible) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    const result = await getDocumentDownloadUrl({
      documentId: docId,
      versionId,
      userId: auth.ctx.userId,
    });

    return NextResponse.json({ ok: true, url: result.url, filename: result.filename });
  } catch (error) {
    if (error instanceof Error && error.message === "document_not_found") {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }
    return handleApiError(error);
  }
}
