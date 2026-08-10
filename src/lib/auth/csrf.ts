import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/config/env";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/auth/constants";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function setCsrfCookie(token?: string): Promise<string> {
  const value = token ?? generateCsrfToken();
  const env = getEnv();
  const jar = await cookies();
  jar.set(CSRF_COOKIE_NAME, value, {
    httpOnly: false,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return value;
}

export async function getCsrfTokenFromCookie(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Double-submit CSRF check: header must match non-httpOnly cookie.
 */
export async function verifyCsrfDoubleSubmit(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  const cookieToken = await getCsrfTokenFromCookie();
  if (!cookieToken) return false;
  return timingSafeEqual(headerToken, cookieToken);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Origin / Referer check for mutation requests when CSRF token is unavailable.
 * Allows same-origin and configured APP_URL.
 */
export function verifyMutationOrigin(request: Request): boolean {
  const env = getEnv();
  const allowed = new URL(env.APP_URL).origin;

  const origin = request.headers.get("origin");
  if (origin) return origin === allowed;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === allowed;
    } catch {
      return false;
    }
  }

  return false;
}

export async function assertCsrfOrOrigin(request: Request): Promise<void> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken && (await verifyCsrfDoubleSubmit(headerToken))) return;
  if (verifyMutationOrigin(request)) return;
  throw new Error("CSRF validation failed");
}

export { CSRF_HEADER_NAME };
