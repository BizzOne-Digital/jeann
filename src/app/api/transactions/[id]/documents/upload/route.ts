import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { uploadTransactionDocument } from "@/lib/transactions/trade-document-service";
import { assertOrgScope } from "@/lib/authorization/authorize";

export const runtime = "nodejs";

const metaSchema = z.object({
  documentType: z.enum([
    "loi",
    "sco",
    "fco",
    "icpo",
    "spa",
    "proposed_lc_wording",
    "contract_amendment",
    "other",
  ]),
  title: z.string().min(1).max(200),
  submitForReview: z.enum(["true", "false"]).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    const { id: transactionId } = await params;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File required." }, { status: 422 });
    }

    const parsed = metaSchema.safeParse({
      documentType: form.get("documentType"),
      title: form.get("title"),
      submitForReview: form.get("submitForReview") ?? "true",
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid upload metadata." }, { status: 422 });
    }

    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:write");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isBuyerSide = tx.side === "buyer";
    const result = await uploadTransactionDocument({
      transactionId,
      organizationId: String(tx.organizationId),
      actorUserId: auth.ctx.userId,
      documentType: parsed.data.documentType,
      title: parsed.data.title,
      buffer,
      filename: file.name,
      mimeType: file.type || "application/pdf",
      buyerVisible: isBuyerSide || auth.ctx.isInternal,
      supplierVisible: !isBuyerSide || auth.ctx.isInternal,
      submitForReview: parsed.data.submitForReview !== "false",
    });

    return NextResponse.json({
      ok: true,
      documentId: String(result.document._id),
      versionId: String(result.version._id),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
