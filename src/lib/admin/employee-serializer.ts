import type { OrganizationMembershipLean, UserLean } from "@/models";
import type { RoleKey } from "@/lib/authorization/permissions";

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
};

export function formatRoleLabels(roles: RoleKey[]) {
  return roles.map((role) => ROLE_LABELS[role] ?? role.replace(/_/g, " ")).join(", ");
}

export function serializeEmployee(
  membership: OrganizationMembershipLean,
  user: UserLean,
): AdminEmployeeItem {
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
  };
}
