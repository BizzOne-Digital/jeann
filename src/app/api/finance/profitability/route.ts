import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  calculateTransactionProfitability,
  calculateDealGroupProfitability,
  saveProfitabilitySnapshot,
} from "@/lib/finance/profitability-service";
import { assertProfitabilityAccess } from "@/lib/finance/access";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;
    assertProfitabilityAccess(auth.ctx);

    const transactionId = request.nextUrl.searchParams.get("transactionId");
    const dealGroupId = request.nextUrl.searchParams.get("dealGroupId");

    if (dealGroupId) {
      const result = await calculateDealGroupProfitability(dealGroupId);
      return NextResponse.json({
        scope: "deal_group",
        dealGroupId,
        ...result,
        labels: {
          revenue: "Operational Revenue",
          procurementCost: "Procurement Cost",
          grossTradingMargin: "Gross Trading Margin",
          directOperationalCosts: "Direct Operational Costs",
          contributionProfit: "Contribution Profit",
        },
      });
    }

    if (transactionId) {
      const result = await calculateTransactionProfitability(transactionId);
      return NextResponse.json({
        scope: "transaction",
        transactionId,
        ...result,
        labels: {
          revenue: "Operational Revenue",
          procurementCost: "Procurement Cost",
          grossTradingMargin: "Gross Trading Margin",
          directOperationalCosts: "Direct Operational Costs",
          contributionProfit: "Contribution Profit",
        },
      });
    }

    return NextResponse.json({ error: "transactionId or dealGroupId required." }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;
    assertProfitabilityAccess(auth.ctx);

    const body = await request.json();
    const { snapshot, result } = await saveProfitabilitySnapshot({
      transactionId: body.transactionId,
      dealGroupId: body.dealGroupId,
      shipmentLotId: body.shipmentLotId,
      reportingPeriodLabel: body.reportingPeriodLabel,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      snapshotId: String(snapshot._id),
      ...result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
