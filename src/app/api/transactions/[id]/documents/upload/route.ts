import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertDocumentAllowed } from "@/lib/transactions/step-service";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
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
    "proforma_invoice",
    "passport_copy",
    "rwa",
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
      const access =
        tx.side === "supplier"
          ? await assertSupplierTransactionAccess(auth.ctx.userId)
          : await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File is too large (15 MB maximum)." }, { status: 413 });
    }
    await assertDocumentAllowed({
      tx,
      isInternal: auth.ctx.isInternal,
      documentType: parsed.data.documentType,
      action: "upload",
    });

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
