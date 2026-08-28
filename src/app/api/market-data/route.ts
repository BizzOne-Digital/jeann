import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { syncMarketObservations, evaluateMarketAlerts } from "@/lib/integrations/market-data-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const { MarketDataObservation, MarketAlert } = await import("@/models");
    const observations = await MarketDataObservation.find()
      .sort({ observationDate: -1 })
      .limit(100)
      .lean();
    const alerts = await MarketAlert.find({ userId: auth.ctx.userId }).lean();

    return NextResponse.json({
      observations: observations.map((o) => ({
        id: String(o._id),
        commodity: o.commodity,
        marketRegion: o.marketRegion,
        value: o.value?.toString(),
        currency: o.currency,
        unit: o.unit,
        observationDate: o.observationDate,
        licensingClassification: o.licensingClassification,
      })),
      alerts,
      disclaimer: "Market data is informational — not trading advice or guaranteed pricing.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireApiAuth({ permissions: "integrations:manage" });
    if ("error" in auth) return auth.error;

    if (body.action === "sync") {
      const result = await syncMarketObservations(
        body.commodity ?? "sunflower_oil",
        body.region ?? "EU",
        auth.sessionUserId,
      );
      return NextResponse.json(result);
    }

    if (body.action === "evaluate_alerts") {
      const result = await evaluateMarketAlerts(auth.sessionUserId);
      return NextResponse.json(result);
    }

    if (body.action === "create_alert") {
      const { MarketAlert } = await import("@/models");
      const { Types } = await import("mongoose");
      const alert = await MarketAlert.create({
        userId: new Types.ObjectId(auth.sessionUserId),
        commodity: body.commodity,
        marketRegion: body.region,
        condition: body.condition ?? "above",
        threshold: body.threshold
          ? Types.Decimal128.fromString(String(body.threshold))
          : undefined,
        currency: body.currency ?? "USD",
        unit: body.unit ?? "MT",
        frequency: body.frequency ?? "daily",
        active: true,
        notificationChannels: ["in_app"],
      });
      return NextResponse.json({ id: String(alert._id) });
    }

    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
