import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { hashIp } from "@/lib/db/ids";

export function getClientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}

export function getRequestUserAgent(request: NextRequest): string | undefined {
  const ua = request.headers.get("user-agent");
  return ua ? ua.slice(0, 512) : undefined;
}

export function getRequestId(request: NextRequest): string | undefined {
  return request.headers.get("x-request-id") ?? undefined;
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function auditRequestMeta(request: NextRequest) {
  const ip = getClientIp(request);
  return {
    ipHash: hashIp(ip),
    userAgent: getRequestUserAgent(request),
    requestId: getRequestId(request),
  };
}
