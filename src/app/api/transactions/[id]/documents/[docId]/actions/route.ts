import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertDocumentAllowed } from "@/lib/transactions/step-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { submitDocumentRevision, reviewDocumentRevision, sendDocumentToBuyer } from "@/lib/transactions/trade-document-service";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id: actionTxId, docId } = await params;
    const { Document: DocModel, Transaction: TxModel } = await import("@/models");
    const owned = await DocModel.exists({ _id: docId, transactionId: actionTxId });
    if (!owned) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const body = z.object({
      action: z.enum(["submit", "review", "send", "share_banking"]),
      versionId: z.string().optional(),
      shared: z.boolean().optional(),
      decision: z.enum(["approved", "changes_requested", "rejected"]).optional(),
      comments: z.string().optional(),
    }).parse(await request.json());

    if (body.action === "share_banking") {
      if (!auth.ctx.permissions.includes("documents:write")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const shared = body.shared ?? true;
      await DocModel.updateOne({ _id: docId }, { $set: { bankingVisible: shared } });
      await writeAuditEvent({
        action: shared ? "document.shared_with_banking" : "document.unshared_from_banking",
        targetType: "document",
        targetId: docId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ ok: true, bankingVisible: shared });
    }
    if (!body.versionId) {
      return NextResponse.json({ error: "versionId required." }, { status: 422 });
    }
    const versionId = body.versionId;

    if (body.action === "submit") {
      if (!auth.ctx.permissions.includes("documents:write")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const version = await submitDocumentRevision({
        documentId: docId,
        versionId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ ok: true, status: version.status });
    }

    if (body.action === "review") {
      if (!auth.ctx.permissions.includes("documents:approve")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const version = await reviewDocumentRevision({
        documentId: docId,
        versionId,
        reviewerUserId: auth.ctx.userId,
        decision: body.decision ?? "approved",
        comments: body.comments,
      });
      return NextResponse.json({ ok: true, status: version.status });
    }

    if (!auth.ctx.permissions.includes("documents:write")) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    const sendTx = await TxModel.findById(actionTxId).select("side transactionType").lean();
    const sendDoc = await DocModel.findById(docId).select("documentType").lean();
    if (sendTx && sendDoc?.documentType) {
      await assertDocumentAllowed({
        tx: { _id: actionTxId, side: sendTx.side, transactionType: sendTx.transactionType },
        isInternal: true,
        documentType: sendDoc.documentType,
        action: "send",
      });
    }
    const version = await sendDocumentToBuyer({
      documentId: docId,
      versionId,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({ ok: true, status: version.status });
  } catch (error) {
    return handleApiError(error);
  }
}
