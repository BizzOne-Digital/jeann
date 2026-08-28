import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { closeFinancialPeriod, reopenFinancialPeriod } from "@/lib/finance/period-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const { FinancialPeriod } = await import("@/models");
    const periods = await FinancialPeriod.find().sort({ startDate: -1 }).limit(50).lean();
    return NextResponse.json({ items: periods });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;

    if (body.action === "close") {
      const period = await closeFinancialPeriod({
        periodType: body.periodType ?? "month",
        startDate: body.startDate,
        endDate: body.endDate,
        actorUserId: auth.sessionUserId,
      });
      return NextResponse.json({ period });
    }

    if (body.action === "reopen") {
      const authReopen = await requireApiAuth({ permissions: "finance:export" });
      if ("error" in authReopen) return authReopen.error;
      const period = await reopenFinancialPeriod({
        periodId: body.periodId,
        reason: body.reason,
        actorUserId: authReopen.sessionUserId,
      });
      return NextResponse.json({ period });
    }

    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
