import { createHash, randomBytes } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  return sha256(ip.trim());
}
