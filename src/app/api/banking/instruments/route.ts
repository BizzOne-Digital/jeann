import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { selectInstrumentForTransaction } from "@/lib/banking/instrument-service";
import { BANKING_STATUS_LABELS } from "@/lib/banking/workflow";

export const runtime = "nodejs";

const selectSchema = z.object({
  transactionId: z.string(),
  instrumentTypeCode: z.string(),
  issuingBankId: z.string().optional(),
  advisingBankId: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const { BankingInstrument } = await import("@/models");
    const items = await BankingInstrument.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((i) => ({
        id: String(i._id),
        instrumentId: i.instrumentId,
        transactionId: String(i.transactionId),
        transactionSide: i.transactionSide,
        instrumentTypeCode: i.instrumentTypeCode,
        currentStatus: i.currentStatus,
        statusLabel: BANKING_STATUS_LABELS[i.currentStatus] ?? i.currentStatus,
        currency: i.currency,
        amount: i.amount?.toString(),
        issuedCopyVerificationStatus: i.issuedCopyVerificationStatus,
        adviceAuthenticationStatus: i.adviceAuthenticationStatus,
        createdAt: i.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:select" });
    if ("error" in auth) return auth.error;

    const body = selectSchema.parse(await request.json());
    const instrument = await selectInstrumentForTransaction({
      transactionId: body.transactionId,
      instrumentTypeCode: body.instrumentTypeCode,
      actorUserId: auth.ctx.userId,
      permissions: auth.ctx.permissions,
      issuingBankId: body.issuingBankId,
      advisingBankId: body.advisingBankId,
    });

    return NextResponse.json({
      id: String(instrument._id),
      instrumentId: instrument.instrumentId,
      currentStatus: instrument.currentStatus,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "forbidden") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      if (error.message === "instrument_exists") {
        return NextResponse.json({ error: "Instrument already exists." }, { status: 409 });
      }
    }
    return handleApiError(error);
  }
}
