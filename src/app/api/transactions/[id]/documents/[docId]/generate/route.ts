import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { generateDocumentPdf } from "@/lib/transactions/trade-document-service";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";

export const runtime = "nodejs";

const schema = z.object({
  structuredData: z.record(z.string(), z.unknown()),
  clauseTexts: z.array(z.string()).optional(),
  isDraft: z.boolean().optional(),
  /** The whole wording, edited for this transaction only. */
  wordingOverride: z.string().max(200000).optional(),
  lcDeadlineHours: z.number().int().min(1).max(720).optional(),
  lcDeadlineBusinessHours: z.boolean().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id: transactionId, docId } = await params;
    const body = schema.parse(await request.json());
    await assertTransactionUnlocked(transactionId);
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    // Every transaction is separate: a document can only be generated through the transaction it belongs to.
    // Without this, a document of a closed transaction could be changed through the URL of an open one.
    const { Document } = await import("@/models");
    const owned = await Document.exists({ _id: docId, transactionId: tx._id, deletedAt: null });
    if (!owned) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const result = await generateDocumentPdf({
      documentId: docId,
      actorUserId: auth.ctx.userId,
      structuredData: body.structuredData,
      clauseTexts: body.clauseTexts,
      wordingOverride: body.wordingOverride,
      isDraft: body.isDraft ?? true,
      lcDeadlineHours: body.lcDeadlineHours,
      lcDeadlineBusinessHours: body.lcDeadlineBusinessHours,
      transactionNumber: tx.transactionNumber,
      documentType: body.structuredData.documentType as string | undefined,
    });

    return NextResponse.json({
      ok: true,
      versionId: String(result.version._id),
      version: result.version.version,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
