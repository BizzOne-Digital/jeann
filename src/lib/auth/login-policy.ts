import type { RoleKey } from "@/lib/authorization/permissions";

export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;

/** MFA disabled — login proceeds without email OTP for all roles. */
export const MFA_REQUIRED_ROLES: RoleKey[] = [];

export function rolesRequireMfa(_roles: RoleKey[]): boolean {
  return false;
}

export function lockoutUntilFromAttempts(failedCount: number): Date | null {
  if (failedCount < MAX_FAILED_LOGINS) return null;
  return new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
}

export function isAccountLocked(lockedUntil?: Date | null): boolean {
  if (!lockedUntil) return false;
  return lockedUntil.getTime() > Date.now();
}
