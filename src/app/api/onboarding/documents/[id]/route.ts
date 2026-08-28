import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getOrCreateDraftCis } from "@/lib/onboarding/cis-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { getStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ requireEmailVerified: true });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { KybDocument } = await import("@/models");
    const doc = await KybDocument.findOne({ _id: id, deletedAt: null });
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const allowed =
      auth.ctx.isInternal ||
      auth.ctx.memberships.some((m) => m.organizationId === String(doc.organizationId));
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const draft = await getOrCreateDraftCis(String(doc.organizationId));
    if (String(doc.cisProfileId) !== String(draft._id)) {
      return NextResponse.json({ error: "Cannot delete documents from locked submission." }, { status: 409 });
    }

    doc.deletedAt = new Date();
    await doc.save();

    try {
      await getStorageProvider().delete(doc.storageKey);
    } catch {
      // file may already be removed
    }

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "file.deleted",
      targetType: "kyb_document",
      targetId: id,
      actorUserId: auth.ctx.userId,
      organizationId: String(doc.organizationId),
      ...meta,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
