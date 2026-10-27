import type { Permission } from "@/lib/authorization/permissions";

/**
 * Employee portal modules. Adding a module grants its permissions on top of the role;
 * removing a module denies them (deniedPermissions always wins over role grants).
 */
export const EMPLOYEE_MODULES = {
  transactions: ["transactions:read", "transactions:write", "transactions:assign", "transactions:approve"],
  documents: ["documents:read", "documents:write", "documents:approve", "documents:download"],
  messages: ["messages:read", "messages:write"],
  procurement: ["procurement:read", "procurement:write", "deal_groups:read", "deal_groups:write"],
  shipments: ["shipments:read", "shipments:write", "shipments:approve", "bookings:read", "bookings:write"],
  banking: ["banking:review", "banking:select"],
  finance: ["finance:read", "finance:write", "finance:export"],
  leads: ["leads:read", "leads:write"],
  products: ["products:read", "products:write"],
  organizations: ["orgs:read", "orgs:write", "orgs:verify"],
  audit: ["audit:read"],
} as const satisfies Record<string, readonly Permission[]>;

export type EmployeeModule = keyof typeof EMPLOYEE_MODULES;
export const EMPLOYEE_MODULE_KEYS = Object.keys(EMPLOYEE_MODULES) as EmployeeModule[];

/** Permissions that only ceo_super_admin may grant (privilege escalation guard). */
export const CEO_ONLY_PERMISSIONS: Permission[] = ["roles:manage", "security:manage", "release:approve", "deployment:approve"];

export function applyModuleChange(
  state: { custom: string[]; denied: string[] },
  module: EmployeeModule,
  action: "add" | "remove",
): { custom: string[]; denied: string[] } {
  const perms = new Set<string>(EMPLOYEE_MODULES[module]);
  if (action === "add") {
    return {
      custom: [...new Set([...state.custom, ...perms])],
      denied: state.denied.filter((p) => !perms.has(p)),
    };
  }
  return {
    custom: state.custom.filter((p) => !perms.has(p)),
    denied: [...new Set([...state.denied, ...perms])],
  };
}
