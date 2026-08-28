import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  selectBankingInstrument,
  confirmIssuanceRequested,
  ALLOWED_INSTRUMENT_TYPES,
} from "@/lib/transactions/banking-service";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { BankingInstrumentRecord } = await import("@/models");
    const record = await BankingInstrumentRecord.findOne({
      transactionId: id,
    }).lean();

    return NextResponse.json({
      record,
      allowedInstrumentTypes: ALLOWED_INSTRUMENT_TYPES,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

const selectSchema = z.object({
  instrumentType: z.string(),
  proposedWordingDocumentId: z.string().optional(),
  internalNotes: z.string().optional(),
  buyerInstructions: z.string().optional(),
});

const confirmSchema = z.object({
  action: z.literal("confirm_issuance"),
  reference: z.string().optional(),
  buyerInstructions: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const raw = await request.json();

    if (raw.action === "confirm_issuance") {
      const auth = await requireApiAuth({ permissions: "transactions:read" });
      if ("error" in auth) return auth.error;
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      const body = confirmSchema.parse(raw);
      const record = await confirmIssuanceRequested({
        transactionId: id,
        organizationId: access.organizationId,
        reference: body.reference,
        buyerInstructions: body.buyerInstructions,
      });
      return NextResponse.json({ ok: true, status: record.status });
    }

    const auth = await requireApiAuth({ permissions: "banking:select" });
    if ("error" in auth) return auth.error;
    const body = selectSchema.parse(raw);

    const record = await selectBankingInstrument({
      transactionId: id,
      instrumentType: body.instrumentType,
      actorUserId: auth.ctx.userId,
      permissions: auth.ctx.permissions,
      proposedWordingDocumentId: body.proposedWordingDocumentId,
      internalNotes: body.internalNotes,
      buyerInstructions: body.buyerInstructions,
    });

    return NextResponse.json({ ok: true, status: record.status });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
