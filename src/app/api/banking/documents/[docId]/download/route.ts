import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getDocumentDownloadUrl } from "@/lib/transactions/trade-document-service";
import { isBankingAdviserDocument } from "@/lib/banking/adviser-documents";

export const runtime = "nodejs";

/** Signed download for a document of a deal assigned to the calling banking adviser (or staff). */
export async function GET(_req: Request, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;
    const { docId } = await params;
    if (!Types.ObjectId.isValid(docId)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    const { Document, BankingInstrument, BankingPartyAssignment } = await import("@/models");
    const doc = await Document.findById(docId).lean();
    if (!doc || doc.deletedAt || !doc.transactionId || !isBankingAdviserDocument(doc)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (!auth.ctx.isInternal) {
      const instrument = await BankingInstrument.findOne({ transactionId: doc.transactionId })
        .select("_id")
        .lean();
      const assigned = instrument
        ? await BankingPartyAssignment.exists({
            bankingInstrumentId: instrument._id,
            userId: new Types.ObjectId(auth.ctx.userId),
            bankingRole: "external_banking_adviser",
            active: true,
          })
        : null;
      if (!assigned) return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    const result = await getDocumentDownloadUrl({
      documentId: docId,
      userId: auth.ctx.userId,
      external: !auth.ctx.isInternal,
    });
    return NextResponse.json({ ok: true, url: result.url, filename: result.filename });
  } catch (error) {
    return handleApiError(error);
  }
}
