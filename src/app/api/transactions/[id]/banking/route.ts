import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  selectBankingInstrument,
  confirmIssuanceRequested,
  recordBuyerLcDetails,
  ALLOWED_INSTRUMENT_TYPES,
} from "@/lib/transactions/banking-service";
import { assertOrgScope } from "@/lib/authorization/authorize";
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
    const { BankingInstrumentRecord, Transaction } = await import("@/models");
    if (!auth.ctx.isInternal) {
      const t = await Transaction.findById(id).select("organizationId").lean();
      if (!t) return NextResponse.json({ error: "Not found." }, { status: 404 });
      await assertOrgScope(auth.ctx.userId, String(t.organizationId), "transactions:read");
    }
    const record = await BankingInstrumentRecord.findOne({
      transactionId: id,
    }).lean();
    const safeRecord =
      record && !auth.ctx.isInternal
        ? {
            instrumentType: record.instrumentType,
            status: record.status,
            lcNumber: record.lcNumber,
            issuingBank: record.issuingBank,
            advisingBank: record.advisingBank,
            amount: record.amount,
            currency: record.currency,
            expiryDate: record.expiryDate,
            buyerNotes: record.buyerNotes,
            buyerInstructions: record.buyerInstructions,
            issuanceReference: record.issuanceReference,
          }
        : record;

    return NextResponse.json({
      record: safeRecord,
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

const lcSchema = z.object({
  action: z.literal("record_lc_details"),
  instrumentType: z.string(),
  lcNumber: z.string().max(80).optional(),
  issuingBank: z.string().max(200).optional(),
  advisingBank: z.string().max(200).optional(),
  amount: z.string().regex(/^d+(.d{1,2})?$/, "Enter the amount as a number, for example 250000.00").optional(),
  currency: z.string().length(3).optional(),
  expiryDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
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

    if (raw.action === "record_lc_details") {
      const auth = await requireApiAuth({ permissions: "transactions:read" });
      if ("error" in auth) return auth.error;
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      const body = lcSchema.parse(raw);
      const record = await recordBuyerLcDetails({
        transactionId: id,
        organizationId: access.organizationId,
        userId: auth.ctx.userId,
        details: body,
      });
      return NextResponse.json({ ok: true, status: record.status });
    }

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
