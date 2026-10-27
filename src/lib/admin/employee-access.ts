import { PERMISSIONS, type Permission, type RoleKey } from "@/lib/authorization/permissions";

export const INTERNAL_ROLE_KEYS = [
  "ceo_super_admin",
  "general_manager",
  "trade_manager",
  "employee_operations",
  "finance",
  "compliance_reviewer",
  "banking_advisor",
  "readonly_auditor",
] as const satisfies readonly RoleKey[];

export function isPermission(value: string): value is Permission {
  return (PERMISSIONS as readonly string[]).includes(value);
}
