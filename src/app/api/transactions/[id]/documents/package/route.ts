import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getDocumentDownloadUrl } from "@/lib/transactions/trade-document-service";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import { assertOrgScope } from "@/lib/authorization/authorize";
import { createZip, safeFileName, type ZipEntry } from "@/lib/files/zip";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

const MAX_DOCUMENTS = 100;

function extensionOf(filename: string): string {
  const m = /\.[A-Za-z0-9]{1,8}$/.exec(filename);
  return m ? m[0].toLowerCase() : ".pdf";
}

/**
 * One ZIP with the documents of ONE transaction, for the bank. It only ever contains documents
 * that belong to this transaction (buyer side or supplier side), never another transaction's.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:download" });
    if ("error" in auth) return auth.error;

    const { id: transactionId } = await params;
    const { Transaction, Document, Organization } = await import("@/models");
    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const filter: Record<string, unknown> = { transactionId: tx._id, deletedAt: null };
    if (!auth.ctx.isInternal) {
      await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:download");
      const access =
        tx.side === "supplier"
          ? await assertSupplierTransactionAccess(auth.ctx.userId)
          : await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      if (tx.side === "supplier") filter.supplierVisible = true;
      else filter.buyerVisible = true;
      filter.internalOnly = false;
    }

    const docs = await Document.find(filter).sort({ createdAt: 1 }).limit(MAX_DOCUMENTS).lean();
    const org = await Organization.findById(tx.organizationId).select("legalName").lean();

    const entries: ZipEntry[] = [];
    const index: string[] = [];
    let n = 0;
    for (const doc of docs) {
      try {
        const { url, filename } = await getDocumentDownloadUrl({
          documentId: String(doc._id),
          userId: auth.ctx.userId,
          external: !auth.ctx.isInternal,
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error("fetch_failed");
        const data = new Uint8Array(await res.arrayBuffer());
        n += 1;
        const name = `${String(n).padStart(2, "0")} - ${safeFileName(doc.title)}${extensionOf(filename)}`;
        entries.push({ name, data });
        index.push(`${name}   [${doc.documentType ?? "document"}, ${String(doc.workflowStatus).replaceAll("_", " ")}]`);
      } catch {
        index.push(`(not available yet) ${doc.title}`);
      }
    }

    if (entries.length === 0) {
      return NextResponse.json({ error: "There are no documents to download for this transaction yet." }, { status: 404 });
    }

    const header = [
      `Transaction: ${tx.transactionNumber}`,
      `Company: ${org?.legalName ?? ""}`,
      `Side: ${tx.side === "supplier" ? "supplier" : "buyer"}`,
      `Packaged: ${new Date().toISOString()}`,
      "",
      "Documents in this package (latest released version of each):",
    ];
    entries.unshift({
      name: "00 - Index.txt",
      data: new TextEncoder().encode([...header, ...index].join("\r\n")),
    });

    const zip = createZip(entries);
    await writeAuditEvent({
      action: "file.download",
      targetType: "transaction",
      targetId: String(tx._id),
      actorUserId: auth.ctx.userId,
      metadata: { package: true, documents: entries.length - 1 },
    });

    const filename = `${safeFileName(String(tx.transactionNumber))} documents.zip`;
    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename.replace(/[^\x20-\x7e]/g, "_")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
