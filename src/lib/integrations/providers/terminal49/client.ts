import { getEnv } from "@/lib/config/env";

export type Terminal49RequestType = "bill_of_lading" | "booking" | "container";

type JsonApiResource<T extends string, A> = {
  id?: string;
  type: T;
  attributes: A;
  relationships?: Record<string, unknown>;
};

type JsonApiDocument<T extends string, A> = {
  data: JsonApiResource<T, A>;
  included?: Array<{ id: string; type: string; attributes?: Record<string, unknown> }>;
};

export class Terminal49ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Terminal49 API ${status}`);
    this.status = status;
    this.body = body;
  }
}

function terminal49Config() {
  const env = getEnv();
  const apiKey = env.TERMINAL49_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("terminal49_not_configured");
  }
  return {
    apiKey,
    baseUrl: env.TERMINAL49_API_BASE_URL.replace(/\/$/, ""),
  };
}

export function isTerminal49Configured(): boolean {
  const env = getEnv();
  return Boolean(env.TERMINAL49_API_KEY?.trim());
}

async function terminal49Fetch(path: string, init?: RequestInit): Promise<Response> {
  const { apiKey, baseUrl } = terminal49Config();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Token ${apiKey}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/vnd.api+json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/vnd.api+json");
  }
  return fetch(url, { ...init, headers });
}

export async function createTrackingRequest(input: {
  requestType: Terminal49RequestType;
  requestNumber: string;
  scac?: string;
  refNumbers?: string[];
  autoDetectScac?: boolean;
}): Promise<{ trackingRequestId: string }> {
  const attributes: Record<string, unknown> = {
    request_type: input.requestType,
    request_number: input.requestNumber,
  };
  if (input.refNumbers?.length) attributes.ref_numbers = input.refNumbers;
  if (input.autoDetectScac) {
    attributes.auto_detect_vocc_scac = true;
  } else if (input.scac) {
    attributes.scac = input.scac;
  }

  const body: JsonApiDocument<"tracking_request", Record<string, unknown>> = {
    data: {
      type: "tracking_request",
      attributes,
    },
  };

  const res = await terminal49Fetch("/tracking_requests", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Terminal49ApiError(res.status, text);

  const parsed = JSON.parse(text) as JsonApiDocument<"tracking_request", Record<string, unknown>>;
  const id = parsed.data.id;
  if (!id) throw new Error("terminal49_missing_tracking_request_id");
  return { trackingRequestId: id };
}

export async function getShipment(shipmentId: string) {
  const res = await terminal49Fetch(`/shipments/${encodeURIComponent(shipmentId)}`);
  const text = await res.text();
  if (!res.ok) throw new Terminal49ApiError(res.status, text);
  return JSON.parse(text) as JsonApiDocument<"shipment", Record<string, unknown>>;
}

export async function getContainer(containerId: string) {
  const res = await terminal49Fetch(`/containers/${encodeURIComponent(containerId)}`);
  const text = await res.text();
  if (!res.ok) throw new Terminal49ApiError(res.status, text);
  return JSON.parse(text) as JsonApiDocument<"container", Record<string, unknown>>;
}

export async function refreshContainer(containerId: string) {
  const res = await terminal49Fetch(`/containers/${encodeURIComponent(containerId)}/refresh`, {
    method: "PATCH",
    body: JSON.stringify({ data: { type: "container", id: containerId } }),
  });
  const text = await res.text();
  if (!res.ok) throw new Terminal49ApiError(res.status, text);
  return text ? JSON.parse(text) : null;
}

export async function terminal49HealthCheck(): Promise<{ ok: boolean; message?: string }> {
  if (!isTerminal49Configured()) {
    return { ok: false, message: "TERMINAL49_API_KEY is not set." };
  }
  try {
    const res = await terminal49Fetch("/tracking_requests?page[size]=1");
    if (res.status === 401) {
      return { ok: false, message: "Terminal49 API key could not be verified." };
    }
    if (res.status === 403 || res.status === 402) {
      return {
        ok: true,
        message:
          "API key valid — read access may require a paid Terminal49 plan (tracking requests can still be created).",
      };
    }
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, message: `Terminal49 health check failed (${res.status}): ${text.slice(0, 200)}` };
    }
    return { ok: true, message: "Connected to Terminal49 API." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Terminal49 unreachable." };
  }
}
