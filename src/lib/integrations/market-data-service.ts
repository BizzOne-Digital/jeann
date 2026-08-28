import { Types } from "mongoose";
import { nanoid } from "nanoid";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isFeatureEnabled } from "@/lib/integrations/feature-flags";
import { getMarketDataProvider } from "@/lib/integrations/providers/market-data-registry";
import { enqueueIntegrationJob, completeIntegrationJob } from "@/lib/integrations/job-service";
import { money } from "@/lib/finance/money";

export async function syncMarketObservations(commodity: string, region: string, actorUserId: string) {
  if (!(await isFeatureEnabled("vesper_market_data"))) {
    throw new Error("feature_disabled");
  }

  const provider = getMarketDataProvider();
  const idempotencyKey = `market:${provider.adapterCode}:${commodity}:${region}:${new Date().toISOString().slice(0, 10)}`;
  const { job } = await enqueueIntegrationJob({
    providerAdapter: provider.adapterCode,
    jobType: "sync_market_observations",
    internalEntityType: "commodity",
    internalEntityId: `${commodity}:${region}`,
    idempotencyKey,
    correlationId: nanoid(),
  });

  await tryConnectMongo();
  const { MarketDataObservation } = await import("@/models");
  const result = await provider.fetchObservations(commodity, region);

  if (!result.ok) {
    await completeIntegrationJob(String(job._id), false, result.errorSummary);
    return { imported: 0, result };
  }

  let imported = 0;
  for (const obs of result.observations) {
    const dup = await MarketDataObservation.findOne({
      providerReference: obs.providerReference,
    }).lean();
    if (dup) continue;

    await MarketDataObservation.create({
      providerAdapter: provider.adapterCode,
      commodity: obs.commodity,
      marketRegion: obs.marketRegion,
      dataType: obs.dataType,
      unit: obs.unit,
      currency: obs.currency,
      observationDate: new Date(obs.observationDate),
      value: Types.Decimal128.fromString(money(obs.value).toString()),
      providerReference: obs.providerReference,
      licensingClassification: obs.licensingClassification ?? "internal_only",
      importedAt: new Date(),
    });
    imported += 1;
  }

  await completeIntegrationJob(String(job._id), true);
  await writeAuditEvent({
    action: "market_data.imported",
    targetType: "commodity",
    targetId: `${commodity}:${region}`,
    actorUserId,
    result: "success",
    metadata: { imported },
  });

  return { imported, result };
}

export async function evaluateMarketAlerts(actorUserId?: string) {
  if (!(await isFeatureEnabled("vesper_alerts"))) return { triggered: 0 };

  await tryConnectMongo();
  const { MarketAlert, MarketDataObservation, Notification } = await import("@/models");
  const alerts = await MarketAlert.find({ active: true }).lean();
  let triggered = 0;

  for (const alert of alerts) {
    const latest = await MarketDataObservation.findOne({
      commodity: alert.commodity,
      marketRegion: alert.marketRegion,
    })
      .sort({ observationDate: -1 })
      .lean();

    if (!latest) continue;
    const value = money(latest.value.toString());
    const threshold = alert.threshold ? money(alert.threshold.toString()) : null;

    let shouldTrigger = false;
    if (alert.condition === "above" && threshold && value.gt(threshold)) shouldTrigger = true;
    if (alert.condition === "below" && threshold && value.lt(threshold)) shouldTrigger = true;

    if (!shouldTrigger) continue;

    const todayKey = new Date().toISOString().slice(0, 10);
    const dup = await Notification.findOne({
      userId: alert.userId,
      type: "market.alert_triggered",
      body: { $regex: todayKey },
    }).lean();
    if (dup) continue;

    await Notification.create({
      userId: alert.userId,
      type: "market.alert_triggered",
      title: "Market alert triggered",
      body: `${alert.commodity} ${alert.condition} threshold on ${todayKey} — informational only, not trading advice.`,
      href: "/workspace/market-data",
    });

    await MarketAlert.findByIdAndUpdate(alert._id, { lastTriggeredAt: new Date() });
    triggered += 1;
  }

  if (actorUserId && triggered > 0) {
    await writeAuditEvent({
      action: "market_alert.triggered",
      targetType: "market_alert",
      targetId: "batch",
      actorUserId,
      result: "success",
      metadata: { triggered },
    });
  }

  return { triggered };
}
