import type { OrganizationMembershipLean, UserLean } from "@/models";
import { permissionsForRoles, type RoleKey } from "@/lib/authorization/permissions";
import { EMPLOYEE_MODULES, type EmployeeModule } from "@/lib/authorization/modules";

export type AdminEmployeeItem = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  userStatus: string;
  membershipStatus: string;
  roles: RoleKey[];
  roleLabels: string;
  lastLoginAt: string | null;
  joinedAt: string | null;
  /** Modules whose permissions are all effectively enabled. */
  enabledModules: EmployeeModule[];
  deniedPermissions: string[];
  effectivePermissions: string[];
};

const ROLE_LABELS: Record<RoleKey, string> = {
  ceo_super_admin: "CEO / Super Admin",
  general_manager: "General Manager",
  trade_manager: "Trade Manager",
  employee_operations: "Operations",
  finance: "Finance",
  compliance_reviewer: "Compliance Reviewer",
  buyer_org_admin: "Buyer Org Admin",
  buyer_member: "Buyer Member",
  supplier_org_admin: "Supplier Org Admin",
  supplier_member: "Supplier Member",
  banking_advisor: "Banking Advisor",
  readonly_auditor: "Read-only Auditor",
  career_applicant: "Career applicant",
};

export function formatRoleLabels(roles: RoleKey[]) {
  return roles.map((role) => ROLE_LABELS[role] ?? role.replace(/_/g, " ")).join(", ");
}

export function serializeEmployee(
  membership: OrganizationMembershipLean,
  user: UserLean,
): AdminEmployeeItem {
  const denied = new Set<string>(membership.deniedPermissions ?? []);
  const effective = new Set<string>(
    [...permissionsForRoles(membership.roles), ...(membership.customPermissions ?? [])].filter((p) => !denied.has(p)),
  );
  const enabledModules = (Object.keys(EMPLOYEE_MODULES) as EmployeeModule[]).filter((m) =>
    EMPLOYEE_MODULES[m].every((p) => effective.has(p)),
  );
  return {
    _id: String(membership._id),
    userId: String(user._id),
    name: user.name,
    email: user.email,
    userStatus: user.status,
    membershipStatus: membership.status,
    roles: membership.roles,
    roleLabels: formatRoleLabels(membership.roles),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : null,
    joinedAt: membership.createdAt ? new Date(membership.createdAt).toLocaleDateString() : null,
    enabledModules,
    deniedPermissions: [...denied],
    effectivePermissions: [...effective].sort(),
  };
}
