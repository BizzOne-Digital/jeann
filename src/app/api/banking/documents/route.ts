import { NextResponse } from "next/server";
import { Types } from "mongoose";
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

    const { BankingPartyAssignment, PresentationPackage, CourierRecord, BankingInstrument } =
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

    return NextResponse.json({
      packages: packages.map((p) => {
        const instrument = instrumentMap.get(String(p.bankingInstrumentId));
        return {
          id: String(p._id),
          packageReference: p.packageReference,
          status: p.status,
          checksum: p.checksum,
          documentCount: p.documentManifest?.length ?? 0,
          instrumentId: instrument?.instrumentId ?? String(p.bankingInstrumentId),
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
          createdAt: c.createdAt,
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
