import { createHmac, timingSafeEqual } from "node:crypto";
import { getSessionSecret } from "@/lib/config/env";

/**
 * A signed, expiring link that lets the Finekarts admin approve or decline a buyer straight from the
 * notification email. The token only identifies which buyer it is for. The decision is made on a
 * confirmation page with an explicit button, so a mail scanner opening the link cannot decide anything.
 */
const DAY_MS = 24 * 60 * 60 * 1000;

function b64(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update("buyer-decision:" + payload).digest("base64url");
}

export function signBuyerDecisionToken(orgId: string, ttlDays = 14, now = Date.now()): string {
  const payload = b64(JSON.stringify({ o: orgId, e: now + ttlDays * DAY_MS }));
  return payload + "." + sign(payload);
}

export type BuyerDecisionTokenResult =
  | { ok: true; orgId: string }
  | { ok: false; reason: "invalid" | "expired" };

export function verifyBuyerDecisionToken(token: string | undefined | null, now = Date.now()): BuyerDecisionTokenResult {
  if (!token) return { ok: false, reason: "invalid" };
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { ok: false, reason: "invalid" };
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "invalid" };
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { o?: string; e?: number };
    if (!parsed.o || typeof parsed.e !== "number") return { ok: false, reason: "invalid" };
    if (parsed.e < now) return { ok: false, reason: "expired" };
    return { ok: true, orgId: parsed.o };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
