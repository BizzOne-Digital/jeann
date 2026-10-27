import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createCostEntry,
  approveFinancialEntry,
  postFinancialEntry,
  reverseFinancialEntry,
} from "@/lib/finance/entry-service";

export const runtime = "nodejs";

const costSchema = z.object({
  costCategoryCode: z.string(),
  description: z.string(),
  originalAmount: z.string(),
  currency: z.string(),
  entryDate: z.string(),
  entryType: z.enum(["procurement_cost", "direct_cost", "fee", "commission"]).optional(),
  transactionId: z.string().optional(),
  shipmentLotId: z.string().optional(),
  dealGroupId: z.string().optional(),
  bankingInstrumentId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const transactionId = request.nextUrl.searchParams.get("transactionId");
    if (!transactionId || !Types.ObjectId.isValid(transactionId)) {
      return NextResponse.json({ error: "transactionId required" }, { status: 400 });
    }
    const { FinancialEntry } = await import("@/models");
    const items = await FinancialEntry.find({ transactionId: new Types.ObjectId(transactionId) })
      .sort({ entryDate: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({
      items: items.map((e) => ({
        id: String(e._id),
        entryNumber: e.entryNumber,
        entryType: e.entryType,
        costCategoryCode: e.costCategoryCode,
        description: e.description,
        amount: e.originalAmount?.toString(),
        currency: e.originalCurrency,
        entryDate: e.entryDate,
        status: e.status,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "approve") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const entry = await approveFinancialEntry({
        entryId: body.entryId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(entry._id), status: entry.status });
    }

    if (body.action === "post") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const entry = await postFinancialEntry({
        entryId: body.entryId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(entry._id), status: entry.status });
    }

    if (body.action === "reverse") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const entry = await reverseFinancialEntry({
        entryId: body.entryId,
        reason: body.reason ?? "Correction",
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(entry._id), status: entry.status });
    }

    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    const parsed = costSchema.parse(body);
    const entry = await createCostEntry({
      ...parsed,
      entryType: parsed.entryType ?? "direct_cost",
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({
      id: String(entry._id),
      entryNumber: entry.entryNumber,
      status: entry.status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "separation_of_duties") {
      return NextResponse.json({ error: "Cannot approve own entry." }, { status: 403 });
    }
    if (error instanceof Error && error.message === "period_closed") {
      return NextResponse.json({ error: "Financial period is closed." }, { status: 400 });
    }
    return handleApiError(error);
  }
}
