import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/config/env";

const MFA_TTL_SEC = 10 * 60;

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

export async function createMfaToken(userId: string): Promise<string> {
  return new SignJWT({ uid: userId, purpose: "mfa_login" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + MFA_TTL_SEC)
    .sign(secretKey());
}

export async function verifyMfaToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "mfa_login" || typeof payload.uid !== "string") return null;
    return payload.uid;
  } catch {
    return null;
  }
}
