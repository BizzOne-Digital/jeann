import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { Types } from "mongoose";

export const runtime = "nodejs";

/** Instruments assigned to the current banking adviser. */
export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const isAdviser = auth.ctx.memberships.some((m) =>
      m.roles.includes("banking_advisor"),
    );
    if (!isAdviser) {
      return NextResponse.json({ error: "Banking adviser role required." }, { status: 403 });
    }

    const { BankingPartyAssignment, BankingInstrument } = await import("@/models");
    const assignments = await BankingPartyAssignment.find({
      userId: new Types.ObjectId(auth.ctx.userId),
      bankingRole: "external_banking_adviser",
      active: true,
    }).lean();

    const ids = assignments.map((a) => a.bankingInstrumentId);
    const instruments = await BankingInstrument.find({ _id: { $in: ids } }).lean();

    return NextResponse.json({
      items: instruments.map((i) => ({
        id: String(i._id),
        instrumentId: i.instrumentId,
        transactionSide: i.transactionSide,
        currentStatus: i.currentStatus,
        currency: i.currency,
        amount: i.amount?.toString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
