export const PERMISSIONS = [
  "cms:read",
  "cms:write",
  "cms:publish",
  "leads:read",
  "leads:write",
  "products:read",
  "products:write",
  "orgs:read",
  "orgs:write",
  "orgs:verify",
  "users:read",
  "users:write",
  "users:disable",
  "roles:manage",
  "transactions:read",
  "transactions:write",
  "transactions:assign",
  "transactions:approve",
  "documents:read",
  "documents:write",
  "documents:approve",
  "documents:download",
  "messages:read",
  "messages:write",
  "finance:read",
  "finance:write",
  "finance:export",
  "shipments:read",
  "shipments:write",
  "bookings:read",
  "bookings:write",
  "ai:use",
  "ai:manage",
  "integrations:manage",
  "terms:manage",
  "audit:read",
  "settings:manage",
  "exports:run",
  "banking:review",
  "supplier:access",
  "buyer:access",
  "workspace:access",
  "admin:access",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type RoleKey =
  | "ceo_super_admin"
  | "general_manager"
  | "trade_manager"
  | "employee_operations"
  | "finance"
  | "compliance_reviewer"
  | "buyer_org_admin"
  | "buyer_member"
  | "supplier_org_admin"
  | "supplier_member"
  | "banking_advisor"
  | "readonly_auditor";

export const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  ceo_super_admin: [...PERMISSIONS],
  general_manager: [
    "cms:read",
    "cms:write",
    "cms:publish",
    "leads:read",
    "leads:write",
    "products:read",
    "products:write",
    "orgs:read",
    "orgs:write",
    "orgs:verify",
    "users:read",
    "users:write",
    "users:disable",
    "roles:manage",
    "transactions:read",
    "transactions:write",
    "transactions:assign",
    "transactions:approve",
    "documents:read",
    "documents:write",
    "documents:approve",
    "documents:download",
    "messages:read",
    "messages:write",
    "finance:read",
    "finance:write",
    "finance:export",
    "shipments:read",
    "shipments:write",
    "bookings:read",
    "bookings:write",
    "ai:use",
    "ai:manage",
    "integrations:manage",
    "terms:manage",
    "audit:read",
    "settings:manage",
    "exports:run",
    "workspace:access",
    "admin:access",
  ],
  trade_manager: [
    "leads:read",
    "leads:write",
    "products:read",
    "orgs:read",
    "transactions:read",
    "transactions:write",
    "transactions:assign",
    "transactions:approve",
    "documents:read",
    "documents:write",
    "documents:approve",
    "documents:download",
    "messages:read",
    "messages:write",
    "shipments:read",
    "shipments:write",
    "bookings:read",
    "bookings:write",
    "ai:use",
    "workspace:access",
  ],
  employee_operations: [
    "leads:read",
    "products:read",
    "orgs:read",
    "transactions:read",
    "transactions:write",
    "documents:read",
    "documents:write",
    "documents:download",
    "messages:read",
    "messages:write",
    "shipments:read",
    "shipments:write",
    "bookings:read",
    "ai:use",
    "workspace:access",
  ],
  finance: [
    "transactions:read",
    "documents:read",
    "documents:download",
    "finance:read",
    "finance:write",
    "finance:export",
    "exports:run",
    "workspace:access",
  ],
  compliance_reviewer: [
    "orgs:read",
    "orgs:verify",
    "transactions:read",
    "documents:read",
    "documents:approve",
    "documents:download",
    "audit:read",
    "workspace:access",
  ],
  buyer_org_admin: [
    "buyer:access",
    "transactions:read",
    "transactions:write",
    "documents:read",
    "documents:write",
    "documents:download",
    "messages:read",
    "messages:write",
  ],
  buyer_member: [
    "buyer:access",
    "transactions:read",
    "transactions:write",
    "documents:read",
    "documents:write",
    "documents:download",
    "messages:read",
    "messages:write",
  ],
  supplier_org_admin: [
    "supplier:access",
    "transactions:read",
    "transactions:write",
    "documents:read",
    "documents:write",
    "documents:download",
    "messages:read",
    "messages:write",
  ],
  supplier_member: [
    "supplier:access",
    "transactions:read",
    "transactions:write",
    "documents:read",
    "documents:write",
    "documents:download",
    "messages:read",
    "messages:write",
  ],
  banking_advisor: [
    "banking:review",
    "transactions:read",
    "documents:read",
    "documents:download",
    "messages:read",
    "messages:write",
  ],
  readonly_auditor: [
    "audit:read",
    "transactions:read",
    "documents:read",
    "orgs:read",
    "workspace:access",
  ],
};

export function hasPermission(
  granted: Permission[] | undefined,
  required: Permission | Permission[],
): boolean {
  if (!granted?.length) return false;
  const needed = Array.isArray(required) ? required : [required];
  return needed.every((p) => granted.includes(p));
}

export function permissionsForRoles(roles: RoleKey[]): Permission[] {
  const set = new Set<Permission>();
  for (const role of roles) {
    for (const p of ROLE_PERMISSIONS[role] ?? []) set.add(p);
  }
  return [...set];
}
