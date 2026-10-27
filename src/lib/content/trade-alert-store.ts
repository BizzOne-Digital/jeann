import {
  TRADE_ALERT_DISCLAIMER,
  TRADE_INDEX_LINES,
  type TradeIndexLine,
} from "@/lib/content/trade-alert-indices";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const TRADE_ALERT_SLUG = "trade-alert";

export type TradeAlertData = {
  lines: TradeIndexLine[];
  disclaimer: string;
};

export const DEFAULT_TRADE_ALERT: TradeAlertData = {
  lines: TRADE_INDEX_LINES,
  disclaimer: TRADE_ALERT_DISCLAIMER,
};

export function sanitizeTradeAlert(input: unknown): TradeAlertData | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as { lines?: unknown; disclaimer?: unknown };
  if (!Array.isArray(raw.lines)) return null;

  const lines: TradeIndexLine[] = [];
  raw.lines.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const l = item as Record<string, unknown>;
    const label = String(l.label ?? "").trim().slice(0, 200);
    if (!label) return;
    const direction = l.direction === "up" || l.direction === "down" ? l.direction : "flat";
    lines.push({
      id: String(l.id ?? "").trim().slice(0, 60) || `line-${index + 1}`,
      label,
      value: String(l.value ?? "").trim().slice(0, 120),
      change: String(l.change ?? "").trim().slice(0, 120),
      direction,
    });
  });

  return {
    lines: lines.slice(0, 30),
    disclaimer: String(raw.disclaimer ?? "").trim().slice(0, 500),
  };
}

/** Admin-only. Falls back to the built-in sample lines until something is saved. */
export async function getTradeAlert(): Promise<TradeAlertData> {
  if (!isMongoConfigured() || !(await tryConnectMongo())) return DEFAULT_TRADE_ALERT;
  const { Page } = await import("@/models");
  const doc = await Page.findOne({ slug: TRADE_ALERT_SLUG, locale: "en" }).lean();
  const content = (doc?.sections as Array<{ type: string; content?: string }> | undefined)?.find(
    (s) => s.type === "richText",
  )?.content;
  if (!content) return DEFAULT_TRADE_ALERT;
  try {
    return sanitizeTradeAlert(JSON.parse(content)) ?? DEFAULT_TRADE_ALERT;
  } catch {
    return DEFAULT_TRADE_ALERT;
  }
}

export async function saveTradeAlert(data: TradeAlertData): Promise<boolean> {
  if (!isMongoConfigured() || !(await tryConnectMongo())) return false;
  const { Page } = await import("@/models");
  await Page.findOneAndUpdate(
    { slug: TRADE_ALERT_SLUG, locale: "en" },
    {
      slug: TRADE_ALERT_SLUG,
      locale: "en",
      title: "Trade alert (admin only)",
      status: "draft",
      sections: [{ type: "richText", content: JSON.stringify(data) }],
    },
    { upsert: true },
  );
  return true;
}
