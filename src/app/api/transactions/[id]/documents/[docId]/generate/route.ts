import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { generateDocumentPdf } from "@/lib/transactions/trade-document-service";

export const runtime = "nodejs";

const schema = z.object({
  structuredData: z.record(z.string(), z.unknown()),
  clauseTexts: z.array(z.string()).optional(),
  isDraft: z.boolean().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    const { id: transactionId, docId } = await params;
    const body = schema.parse(await request.json());
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const result = await generateDocumentPdf({
      documentId: docId,
      actorUserId: auth.ctx.userId,
      structuredData: body.structuredData,
      clauseTexts: body.clauseTexts,
      isDraft: body.isDraft ?? true,
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
