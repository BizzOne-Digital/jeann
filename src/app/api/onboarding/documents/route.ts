import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getOrCreateDraftCis } from "@/lib/onboarding/cis-service";
import { storeKybDocument } from "@/lib/files/kyb-upload";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { KYB_DOCUMENT_TYPES } from "@/models/KybDocument";

export const runtime = "nodejs";

const metaSchema = z.object({
  organizationId: z.string(),
  documentType: z.enum(KYB_DOCUMENT_TYPES),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ requireEmailVerified: true });
    if ("error" in auth) return auth.error;

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File required." }, { status: 422 });
    }

    const metaParsed = metaSchema.safeParse({
      organizationId: form.get("organizationId"),
      documentType: form.get("documentType"),
    });
    if (!metaParsed.success) {
      return NextResponse.json({ error: "Invalid upload metadata." }, { status: 422 });
    }

    const { organizationId, documentType } = metaParsed.data;
    const allowed =
      auth.ctx.isInternal ||
      auth.ctx.memberships.some((m) => m.organizationId === organizationId);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const draft = await getOrCreateDraftCis(organizationId);

    const stored = await storeKybDocument({
      organizationId,
      cisProfileId: String(draft._id),
      cisVersion: draft.version,
      documentType,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      buffer,
      uploadedBy: auth.ctx.userId,
    });

    const { KybDocument } = await import("@/models");
    const doc = await KybDocument.create({
      organizationId,
      cisProfileId: draft._id,
      cisVersion: draft.version,
      documentType,
      storageKey: stored.storageKey,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: stored.sizeBytes,
      checksum: stored.checksum,
      uploadedBy: auth.ctx.userId,
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "file.upload",
      targetType: "kyb_document",
      targetId: String(doc._id),
      actorUserId: auth.ctx.userId,
      organizationId,
      ...meta,
      metadata: { documentType, filename: file.name },
    });

    return NextResponse.json({
      ok: true,
      documentId: String(doc._id),
      filename: file.name,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unsupported")) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return handleApiError(error);
  }
}
