import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { uploadSignedDocument } from "@/lib/transactions/trade-document-service";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { assertSignAllowed } from "@/lib/transactions/step-service";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    const { id: transactionId, docId } = await params;
    const { Transaction, Document } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const doc = await Document.findById(docId)
      .select("transactionId buyerVisible supplierVisible internalOnly")
      .lean();
    if (!doc || String(doc.transactionId) !== String(tx._id)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    // Buyer signs on buyer transactions; supplier signs on supplier purchases; staff record Finekarts signature.
    let access: { organizationId: string };
    if (auth.ctx.isInternal) {
      access = { organizationId: String(tx.organizationId) };
    } else if (tx.side === "supplier") {
      access = await assertSupplierTransactionAccess(auth.ctx.userId);
    } else {
      access = await assertBuyerTransactionAccess(auth.ctx.userId);
    }
    if (String(tx.organizationId) !== access.organizationId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (!auth.ctx.isInternal) {
      const visible = tx.side === "supplier" ? doc.supplierVisible : doc.buyerVisible;
      if (!visible || doc.internalOnly) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    const signer = auth.ctx.isInternal ? "staff" : "external";
    await assertSignAllowed({ tx, signer });

    const form = await request.formData();
    const file = form.get("file");
    const versionId = String(form.get("versionId") ?? "");
    const signatoryName = String(form.get("signatoryName") ?? "");
    const signatoryTitle = form.get("signatoryTitle") ? String(form.get("signatoryTitle")) : undefined;

    if (!(file instanceof File) || !versionId || !signatoryName) {
      return NextResponse.json({ error: "Invalid signature upload." }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = auditRequestMeta(request);

    const result = await uploadSignedDocument({
      documentId: docId,
      versionId,
      actorUserId: auth.ctx.userId,
      signatoryName,
      signatoryTitle,
      buffer,
      filename: file.name,
      mimeType: file.type || "application/pdf",
      method: auth.ctx.isInternal ? "admin_recorded_external" : "controlled_upload",
      signer,
      organizationId: access.organizationId,
      transactionId,
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({ ok: true, checksum: result.checksum });
  } catch (error) {
    return handleApiError(error);
  }
}
