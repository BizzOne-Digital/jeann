import type { RoleKey } from "@/lib/authorization/permissions";

export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;

export const MFA_REQUIRED_ROLES: RoleKey[] = [
  "ceo_super_admin",
  "general_manager",
  "trade_manager",
  "compliance_reviewer",
  "finance",
  "employee_operations",
  "banking_advisor",
];

export function rolesRequireMfa(roles: RoleKey[]): boolean {
  return roles.some((role) => MFA_REQUIRED_ROLES.includes(role));
}

export function lockoutUntilFromAttempts(failedCount: number): Date | null {
  if (failedCount < MAX_FAILED_LOGINS) return null;
  return new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
}

export function isAccountLocked(lockedUntil?: Date | null): boolean {
  if (!lockedUntil) return false;
  return lockedUntil.getTime() > Date.now();
}
