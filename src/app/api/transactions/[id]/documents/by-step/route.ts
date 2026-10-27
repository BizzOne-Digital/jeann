import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

/** Staff/banking view: documents grouped by workflow step. Add ?bankingOnly=1 for banking-shared only. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    const { Document } = await import("@/models");
    const filter: Record<string, unknown> = { transactionId: id, deletedAt: null };
    if (request.nextUrl.searchParams.get("bankingOnly") === "1") filter.bankingVisible = true;
    const docs = await Document.find(filter).sort({ createdAt: 1 }).lean();
    const steps: Record<string, unknown[]> = {};
    for (const d of docs) {
      const key = d.stepKey ?? "unassigned";
      (steps[key] ??= []).push({
        id: String(d._id),
        title: d.title,
        documentType: d.documentType,
        workflowStatus: d.workflowStatus,
        bankingVisible: Boolean(d.bankingVisible),
        currentVersionId: d.currentVersionId ? String(d.currentVersionId) : null,
      });
    }
    return NextResponse.json({ steps });
  } catch (error) {
    return handleApiError(error);
  }
}
