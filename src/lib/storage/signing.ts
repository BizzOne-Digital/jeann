import { createHmac } from "crypto";
import { getSessionSecret } from "@/lib/config/env";

export function signStorageUrl(params: Record<string, string>, expiresAtSec: number): string {
  const payload = { ...params, exp: String(expiresAtSec) };
  const base = Object.entries(payload)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const sig = createHmac("sha256", getSessionSecret()).update(base).digest("hex");
  return `${base}&sig=${sig}`;
}

export function verifyStorageSignature(
  params: Record<string, string>,
  expiresAtSec: number,
  signature: string,
): boolean {
  if (expiresAtSec < Math.floor(Date.now() / 1000)) return false;
  const expected = signStorageUrl(params, expiresAtSec).split("&sig=")[1];
  return expected === signature;
}
