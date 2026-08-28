import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { submitDocumentRevision, reviewDocumentRevision, sendDocumentToBuyer } from "@/lib/transactions/trade-document-service";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const { docId } = await params;
    const body = z.object({
      action: z.enum(["submit", "review", "send"]),
      versionId: z.string(),
      decision: z.enum(["approved", "changes_requested", "rejected"]).optional(),
      comments: z.string().optional(),
    }).parse(await request.json());

    if (body.action === "submit") {
      if (!auth.ctx.permissions.includes("documents:write")) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const version = await submitDocumentRevision({
        documentId: docId,
        versionId: body.versionId,
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
        versionId: body.versionId,
        reviewerUserId: auth.ctx.userId,
        decision: body.decision ?? "approved",
        comments: body.comments,
      });
      return NextResponse.json({ ok: true, status: version.status });
    }

    if (!auth.ctx.permissions.includes("documents:write")) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    const version = await sendDocumentToBuyer({
      documentId: docId,
      versionId: body.versionId,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({ ok: true, status: version.status });
  } catch (error) {
    return handleApiError(error);
  }
}
