import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { uploadSignedDocument } from "@/lib/transactions/trade-document-service";
import { auditRequestMeta } from "@/lib/api/request-meta";
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
    const access = await assertBuyerTransactionAccess(auth.ctx.userId);

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
      method: "controlled_upload",
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
