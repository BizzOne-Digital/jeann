import { getEnv } from "@/lib/config/env";

/** SMS is configured when a real or console provider is selected. */
export function isSmsConfigured(): boolean {
  return getEnv().SMS_PROVIDER !== "none";
}

/**
 * Primary confirmation is the phone code; the company email code is secondary.
 * When SMS is not configured on the server, the email code is accepted as primary
 * so sign-ups are not blocked.
 */
export function isPrimaryContactVerified(user: {
  emailVerified: boolean;
  phoneVerified: boolean;
}): boolean {
  return isSmsConfigured() ? user.phoneVerified : user.emailVerified;
}
