import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { buildAdviserDocumentRow, isBankingAdviserDocument } from "@/lib/banking/adviser-documents";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

/** Presentation packages and courier records for banking adviser assigned instruments. */
export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const isAdviser = auth.ctx.memberships.some((m) => m.roles.includes("banking_advisor"));
    if (!isAdviser && !auth.ctx.isInternal) {
      return NextResponse.json({ error: "Banking adviser role required." }, { status: 403 });
    }

    const { BankingPartyAssignment, PresentationPackage, CourierRecord, BankingInstrument, Document, DocumentVersion, Transaction } =
      await import("@/models");

    const assignments = await BankingPartyAssignment.find({
      userId: new Types.ObjectId(auth.ctx.userId),
      bankingRole: "external_banking_adviser",
      active: true,
    }).lean();

    const instrumentIds = assignments.map((a) => a.bankingInstrumentId);
    const instruments = await BankingInstrument.find({ _id: { $in: instrumentIds } }).lean();
    const instrumentMap = new Map(instruments.map((i) => [String(i._id), i]));

    const [packages, couriers] = await Promise.all([
      PresentationPackage.find({ bankingInstrumentId: { $in: instrumentIds } })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      CourierRecord.find({ bankingInstrumentId: { $in: instrumentIds } })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    // Steps 1-6 documents for assigned deals only (buyer-sale and supplier-purchase alike).
    const txIds = instruments.map((i) => i.transactionId);
    const [rawDocs, txs] = await Promise.all([
      txIds.length
        ? Document.find({ transactionId: { $in: txIds }, deletedAt: null }).sort({ createdAt: 1 }).limit(500).lean()
        : Promise.resolve([]),
      txIds.length ? Transaction.find({ _id: { $in: txIds } }).select("transactionNumber").lean() : Promise.resolve([]),
    ]);
    const txNumber = new Map(txs.map((t) => [String(t._id), t.transactionNumber]));
    const sideByTx = new Map(instruments.map((i) => [String(i.transactionId), i.transactionSide]));
    const released = rawDocs.filter((d) => isBankingAdviserDocument(d));
    const versionIds = released.map((d) => d.currentVersionId).filter(Boolean);
    const versions = versionIds.length
      ? await DocumentVersion.find({ _id: { $in: versionIds } }).select("originalFilename mimeType").lean()
      : [];
    const versionMap = new Map(versions.map((v) => [String(v._id), v]));
    const documents = released
      .map((d) => {
        const v = d.currentVersionId ? versionMap.get(String(d.currentVersionId)) : undefined;
        return buildAdviserDocumentRow(d, {
          side: (sideByTx.get(String(d.transactionId)) ?? "buyer_sale") as "buyer_sale" | "supplier_purchase",
          transactionNumber: txNumber.get(String(d.transactionId)),
          filename: v?.originalFilename,
          mimeType: v?.mimeType,
        });
      })
      .sort((a, b) => (a.transactionNumber ?? "").localeCompare(b.transactionNumber ?? "") || (a.stepNumber ?? 99) - (b.stepNumber ?? 99));

    return NextResponse.json({
      documents,
      packages: packages.map((p) => {
        const instrument = instrumentMap.get(String(p.bankingInstrumentId));
        return {
          id: String(p._id),
          packageReference: p.packageReference,
          status: p.status,
          checksum: p.checksum,
          documentCount: p.documentManifest?.length ?? 0,
          instrumentId: instrument?.instrumentId ?? String(p.bankingInstrumentId),
          instrumentDbId: String(p.bankingInstrumentId),
          createdAt: p.createdAt,
        };
      }),
      couriers: couriers.map((c) => {
        const instrument = instrumentMap.get(String(c.bankingInstrumentId));
        return {
          id: String(c._id),
          courierCompany: c.courierCompany,
          trackingNumber: c.trackingNumber,
          sender: c.sender,
          recipient: c.recipient,
          status: c.status,
          dispatchDate: c.dispatchDate,
          expectedDeliveryDate: c.expectedDeliveryDate,
          packageDescription: c.packageDescription,
          instrumentId: instrument?.instrumentId ?? String(c.bankingInstrumentId),
          instrumentDbId: String(c.bankingInstrumentId),
          presentationPackageId: c.presentationPackageId ? String(c.presentationPackageId) : undefined,
          recipientBankName: c.recipientBankName,
          receivedDate: c.receivedDate,
          verificationStatus: c.verificationStatus ?? "pending",
          paymentStatus: c.paymentStatus ?? "pending",
          paymentConfirmedAt: c.paymentConfirmedAt,
          createdAt: c.createdAt,
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
