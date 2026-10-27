import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { estimateCorporateTax } from "@/lib/finance/corporate-tax";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

const schema = z.object({
  periodLabel: z.string().min(1).max(40),
  currency: z.string().length(3),
  operationalProfit: z.string().regex(/^-?\d+(\.\d+)?$/),
  rate: z.string().max(10).optional(),
});

export async function POST(request: Request) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:export" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const result = await estimateCorporateTax({
      periodLabel: parsed.data.periodLabel,
      currency: parsed.data.currency.toUpperCase(),
      operationalProfit: parsed.data.operationalProfit,
      rateOverride: parsed.data.rate,
    });
    await writeAuditEvent({
      action: "finance.corporate_tax_estimate_requested",
      targetType: "period_report",
      targetId: parsed.data.periodLabel,
      actorUserId: auth.ctx.userId,
      result: "success",
      metadata: { status: result.status },
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
