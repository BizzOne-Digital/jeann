import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { bankFileTab, isBankingAdviserDocument } from "@/lib/banking/adviser-documents";
import { assembleBankFile, type BankFileEntry } from "@/lib/banking/bank-file-pdf";
import { readPrivateObject } from "@/lib/storage/local";

export const runtime = "nodejs";

/** The whole bank file of one order as a single PDF with numbered, labelled tabs. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const { Document, DocumentVersion, Transaction, BankingInstrument, BankingPartyAssignment } = await import("@/models");

    if (!auth.ctx.isInternal) {
      const instrument = await BankingInstrument.findOne({ transactionId: id }).select("_id").lean();
      const assigned = instrument
        ? await BankingPartyAssignment.exists({
            bankingInstrumentId: instrument._id,
            userId: new Types.ObjectId(auth.ctx.userId),
            bankingRole: "external_banking_adviser",
            active: true,
          })
        : null;
      if (!assigned) return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const tx = await Transaction.findById(id).select("transactionNumber").lean();
    const docs = (await Document.find({ transactionId: id, deletedAt: null }).sort({ createdAt: 1 }).lean()).filter((d) =>
      isBankingAdviserDocument(d),
    );
    const entries: BankFileEntry[] = [];
    for (const d of docs) {
      const v = d.currentVersionId ? await DocumentVersion.findById(d.currentVersionId).lean() : null;
      const tab = bankFileTab(d.documentType);
      let bytes: Uint8Array | undefined;
      const isPdf = v?.mimeType === "application/pdf" || Boolean(v?.originalFilename?.toLowerCase().endsWith(".pdf"));
      if (v?.storageKey && isPdf) {
        try {
          bytes = await readPrivateObject(v.storageKey);
        } catch {
          bytes = undefined;
        }
      }
      entries.push({ tabNumber: tab.tabNumber, tabLabel: tab.tabLabel, title: d.title, filename: v?.originalFilename, bytes });
    }
    if (!entries.length) return NextResponse.json({ error: "No released documents for this order yet." }, { status: 404 });

    const pdf = await assembleBankFile({ transactionNumber: tx?.transactionNumber, entries });
    const name = (tx?.transactionNumber ?? "order").replace(/[^A-Za-z0-9-]+/g, "-") + "_BANK-FILE.pdf";
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${name}"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
