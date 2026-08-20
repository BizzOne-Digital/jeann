import { getEnv } from "@/lib/config/env";

/** Returns a user-facing message when sessions cannot be issued (e.g. missing SESSION_SECRET). */
export function getSessionConfigError(): string | null {
  const env = getEnv();
  const secret = env.SESSION_SECRET || env.AUTH_SECRET;
  if (secret && secret.length >= 32) return null;
  if (env.NODE_ENV === "production") {
    return "Sign-in is temporarily unavailable. Please contact support.";
  }
  return null;
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
}

export function isSessionConfigError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("SESSION_SECRET");
}
