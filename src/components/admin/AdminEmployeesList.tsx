"use client";

import type { AdminEmployeeItem } from "@/lib/admin/employee-serializer";

export function AdminEmployeesList({ employees }: { employees: AdminEmployeeItem[] }) {
  return (
    <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Employee</th>
            <th className="px-4 py-3 font-semibold">Roles</th>
            <th className="px-4 py-3 font-semibold">Membership</th>
            <th className="px-4 py-3 font-semibold">Account</th>
            <th className="px-4 py-3 font-semibold">Last login</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">
                <p className="font-semibold text-[var(--navy)]">{employee.name}</p>
                <p className="mt-0.5 text-xs text-[var(--stone)]">{employee.email}</p>
              </td>
              <td className="px-4 py-3">{employee.roleLabels}</td>
              <td className="px-4 py-3 capitalize">{employee.membershipStatus}</td>
              <td className="px-4 py-3 capitalize">{employee.userStatus.replace(/_/g, " ")}</td>
              <td className="px-4 py-3 text-[var(--stone)]">{employee.lastLoginAt ?? "—"}</td>
              <td className="px-4 py-3 text-[var(--stone)]">{employee.joinedAt ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-[var(--stone)]">
          No employees found. Run <code>npm run create-admin</code> or set INITIAL_ADMIN_* and run{" "}
          <code>npm run seed</code>.
        </p>
      ) : null}
    </div>
  );
}
