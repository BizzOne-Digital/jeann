import { NextRequest, NextResponse } from "next/server";
import { verifyStorageSignature } from "@/lib/storage/signing";
import { readPrivateObject } from "@/lib/storage/local";
import { requireApiAuth } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { assertOrganizationMembershipScope } from "@/lib/onboarding/duplicate-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const key = searchParams.get("key");
  const exp = searchParams.get("exp");
  const disposition = searchParams.get("disposition") ?? "attachment";
  const filename = searchParams.get("filename");
  const sig = searchParams.get("sig");

  if (!key || !exp || !sig) {
    return NextResponse.json({ error: "Invalid download link." }, { status: 400 });
  }

  const expiresAtSec = Number(exp);
  const params: Record<string, string> = { key, exp, disposition };
  if (filename) params.filename = filename;

  if (!verifyStorageSignature(params, expiresAtSec, sig)) {
    return NextResponse.json({ error: "Download link expired or invalid." }, { status: 403 });
  }

  const auth = await requireApiAuth();
  if ("error" in auth) {
    return auth.error;
  }

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const { KybDocument, DocumentVersion, Document } = await import("@/models");

    const kybDoc = await KybDocument.findOne({ storageKey: key, deletedAt: null }).lean();
    const versionDoc = kybDoc
      ? null
      : await DocumentVersion.findOne({ storageKey: key }).lean();

    let allowed = auth.ctx.isInternal || auth.ctx.permissions.includes("orgs:verify");

    if (kybDoc) {
      allowed =
        allowed ||
        (await assertOrganizationMembershipScope(auth.ctx.userId, String(kybDoc.organizationId)));
      const meta = auditRequestMeta(request);
      await writeAuditEvent({
        action: "file.download",
        targetType: "kyb_document",
        targetId: String(kybDoc._id),
        actorUserId: auth.ctx.userId,
        organizationId: String(kybDoc.organizationId),
        ...meta,
        metadata: { storageKey: key, filename: kybDoc.filename },
      });
    } else if (versionDoc) {
      const parent = await Document.findById(versionDoc.documentId).lean();
      if (!parent) {
        return NextResponse.json({ error: "File not found." }, { status: 404 });
      }
      if (!auth.ctx.isInternal) {
        allowed =
          (await assertOrganizationMembershipScope(
            auth.ctx.userId,
            String(parent.organizationId),
          )) &&
          (!parent.internalOnly || parent.buyerVisible);
      }
      const meta = auditRequestMeta(request);
      await writeAuditEvent({
        action: "file.download",
        targetType: "document_version",
        targetId: String(versionDoc._id),
        actorUserId: auth.ctx.userId,
        organizationId: String(parent.organizationId),
        ...meta,
        metadata: { storageKey: key },
      });
    } else {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  try {
    const buffer = await readPrivateObject(key);
    const headers = new Headers();
    headers.set("Content-Type", filename?.endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${filename ?? "document"}"`,
    );
    headers.set("Content-Length", String(buffer.length));
    return new NextResponse(new Uint8Array(buffer), { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
