import { customAlphabet } from "nanoid";

const nano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function generateTransactionNumber(date = new Date()): string {
  const year = date.getUTCFullYear();
  return `FK-S-${year}-${nano().padStart(6, "0").slice(-6)}`;
}

export function normalizeCompanyName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(incorporated|inc|ltd|limited|llc|corp|corporation|co)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashIp(ip: string | null | undefined): string {
  if (!ip) return "unknown";
  // Lightweight non-cryptographic fingerprint for audit metadata (not for security decisions).
  let h = 0;
  for (let i = 0; i < ip.length; i += 1) h = (h * 31 + ip.charCodeAt(i)) >>> 0;
  return `ip_${h.toString(16)}`;
}
