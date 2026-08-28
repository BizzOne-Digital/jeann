import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createTradeDocument,
  generateDocumentPdf,
  submitDocumentRevision,
  reviewDocumentRevision,
  sendDocumentToBuyer,
  uploadSignedDocument,
} from "@/lib/transactions/trade-document-service";
import { assertOrgScope } from "@/lib/authorization/authorize";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const createSchema = z.object({
  documentType: z.enum(["loi", "sco", "fco", "icpo", "spa", "proposed_lc_wording", "contract_amendment", "other"]),
  title: z.string().min(1),
  buyerVisible: z.boolean().optional(),
  templateKey: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:read" });
    if ("error" in auth) return auth.error;

    const { id: transactionId } = await params;
    const { Transaction, Document } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:read");
    }

    const filter: Record<string, unknown> = {
      transactionId: tx._id,
      deletedAt: null,
    };
    if (!auth.ctx.isInternal) {
      filter.buyerVisible = true;
      filter.internalOnly = false;
    }

    const docs = await Document.find(filter).lean();
    return NextResponse.json({ items: docs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    const { id: transactionId } = await params;
    const body = createSchema.parse(await request.json());
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(transactionId);
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const doc = await createTradeDocument({
      transactionId,
      organizationId: String(tx.organizationId),
      documentType: body.documentType,
      title: body.title,
      createdByUserId: auth.ctx.userId,
      buyerVisible: body.buyerVisible,
      internalOnly: !body.buyerVisible,
      templateKey: body.templateKey,
    });

    return NextResponse.json({ ok: true, documentId: String(doc._id) });
  } catch (error) {
    return handleApiError(error);
  }
}
