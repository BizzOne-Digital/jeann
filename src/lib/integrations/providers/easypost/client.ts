import { getEnv } from "@/lib/config/env";

export type EasyPostTracker = {
  id: string;
  tracking_code: string;
  status: string;
  carrier?: string;
  est_delivery_date?: string | null;
  tracking_details?: Array<{
    message?: string;
    status?: string;
    datetime?: string;
    tracking_location?: { city?: string; state?: string; country?: string; zip?: string };
  }>;
};

export class EasyPostApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`EasyPost API ${status}`);
    this.status = status;
    this.body = body;
  }
}

function easypostConfig() {
  const env = getEnv();
  const apiKey = env.EASYPOST_API_KEY?.trim();
  if (!apiKey) throw new Error("easypost_not_configured");
  return {
    apiKey,
    baseUrl: env.EASYPOST_API_BASE_URL.replace(/\/$/, ""),
  };
}

export function isEasyPostConfigured(): boolean {
  return Boolean(getEnv().EASYPOST_API_KEY?.trim());
}

function basicAuthHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

async function easyPostFetch(path: string, init?: RequestInit): Promise<Response> {
  const { apiKey, baseUrl } = easypostConfig();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("Authorization", basicAuthHeader(apiKey));
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers });
}

export async function createTracker(input: { trackingCode: string; carrier: string }) {
  const res = await easyPostFetch("/trackers", {
    method: "POST",
    body: JSON.stringify({
      tracker: {
        tracking_code: input.trackingCode,
        carrier: input.carrier,
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new EasyPostApiError(res.status, text);
  const parsed = JSON.parse(text) as EasyPostTracker;
  return parsed;
}

export async function getTracker(trackerId: string): Promise<EasyPostTracker> {
  const res = await easyPostFetch(`/trackers/${encodeURIComponent(trackerId)}`);
  const text = await res.text();
  if (!res.ok) throw new EasyPostApiError(res.status, text);
  return JSON.parse(text) as EasyPostTracker;
}

export async function easyPostHealthCheck(): Promise<{ ok: boolean; message?: string }> {
  if (!isEasyPostConfigured()) {
    return { ok: false, message: "EASYPOST_API_KEY is not set." };
  }
  try {
    const res = await easyPostFetch("/trackers?page_size=1");
    if (res.status === 401 || res.status === 403) {
      return { ok: false, message: "EasyPost API key could not be verified." };
    }
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, message: `EasyPost health check failed (${res.status}): ${text.slice(0, 160)}` };
    }
    return { ok: true, message: "Connected to EasyPost API." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "EasyPost unreachable." };
  }
}
