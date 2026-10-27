import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { buildFinanceSummary } from "@/lib/finance/transaction-summary-service";

export const runtime = "nodejs";

function parseDate(v: string | null): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const sp = request.nextUrl.searchParams;
    const summary = await buildFinanceSummary({
      q: sp.get("q")?.slice(0, 100) || undefined,
      status: sp.get("status") || undefined,
      transactionId: sp.get("transactionId") || undefined,
      from: parseDate(sp.get("from")),
      to: parseDate(sp.get("to")),
    });
    return NextResponse.json(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
