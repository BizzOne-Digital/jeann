"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminEmployeeItem } from "@/lib/admin/employee-serializer";
import { EMPLOYEE_MODULE_KEYS } from "@/lib/authorization/modules";
import { INTERNAL_ROLE_KEYS } from "@/lib/admin/employee-access";
import { PERMISSIONS } from "@/lib/authorization/permissions";

async function call(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Request failed");
}

export function AdminEmployeesList({ employees }: { employees: AdminEmployeeItem[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [permPick, setPermPick] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee_operations" });

  async function run(fn: () => Promise<void>, ok: string) {
    setMessage(null);
    try {
      await fn();
      setMessage(ok);
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="space-y-4">
      {message ? <p className="rounded border border-[var(--line)] bg-white px-3 py-2 text-sm">{message}</p> : null}
      <form
        className="flex flex-wrap items-end gap-2 rounded-lg border border-[var(--line)] bg-white p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void run(
            () => call("/api/admin/employees", "POST", { name: form.name, email: form.email, password: form.password, roles: [form.role] }),
            "Employee created.",
          );
        }}
      >
        <input required placeholder="Full name" className="rounded border border-[var(--line)] px-2 py-1 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="rounded border border-[var(--line)] px-2 py-1 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" minLength={12} placeholder="Temporary password (12+)" className="rounded border border-[var(--line)] px-2 py-1 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="rounded border border-[var(--line)] px-2 py-1 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {INTERNAL_ROLE_KEYS.map((r) => (
            <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
          ))}
        </select>
        <button type="submit" className="rounded bg-[var(--navy)] px-3 py-1 text-sm text-white">Create employee</button>
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Employee</th>
              <th className="px-4 py-3 font-semibold">Roles</th>
              <th className="px-4 py-3 font-semibold">Modules</th>
              <th className="px-4 py-3 font-semibold">Account</th>
              <th className="px-4 py-3 font-semibold">Last login</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const url = `/api/admin/employees/${employee.userId}`;
              const suspended = employee.userStatus === "suspended";
              return (
                <tr key={employee._id} className="border-b border-[var(--line)] align-top last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--navy)]">{employee.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--stone)]">{employee.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border border-[var(--line)] px-2 py-1 text-xs"
                      value={employee.roles[0] ?? ""}
                      onChange={(e) => void run(() => call(url, "PATCH", { action: "set_roles", roles: [e.target.value] }), "Role updated.")}
                    >
                      {INTERNAL_ROLE_KEYS.map((r) => (
                        <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {EMPLOYEE_MODULE_KEYS.map((m) => {
                        const on = employee.enabledModules.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            title={on ? "Remove module" : "Add module"}
                            onClick={() => void run(() => call(url, "PATCH", { action: on ? "remove_module" : "add_module", module: m }), `${m} ${on ? "removed" : "added"}.`)}
                            className={`rounded border px-2 py-0.5 text-xs ${on ? "border-[var(--navy)] bg-[var(--navy)] text-white" : "border-[var(--line)] text-[var(--stone)]"}`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer underline">Permissions ({employee.effectivePermissions.length})</summary>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <select
                          className="rounded border border-[var(--line)] px-1 py-0.5"
                          value={permPick[employee.userId] ?? PERMISSIONS[0]}
                          onChange={(e) => setPermPick({ ...permPick, [employee.userId]: e.target.value })}
                        >
                          {PERMISSIONS.map((p) => (
                            <option key={p} value={p}>{p}{employee.deniedPermissions.includes(p) ? " (denied)" : employee.effectivePermissions.includes(p) ? " (on)" : ""}</option>
                          ))}
                        </select>
                        {(["grant", "deny", "clear_override"] as const).map((a) => (
                          <button
                            key={a}
                            type="button"
                            className="rounded border border-[var(--line)] px-2 py-0.5"
                            onClick={() => void run(() => call(url, "PATCH", { action: a, permission: permPick[employee.userId] ?? PERMISSIONS[0] }), `Permission ${a.replace("_", " ")} applied.`)}
                          >
                            {a === "clear_override" ? "Reset" : a === "grant" ? "Grant" : "Deny"}
                          </button>
                        ))}
                      </div>
                      {employee.deniedPermissions.length > 0 ? (
                        <p className="mt-1 text-[var(--stone)]">Denied: {employee.deniedPermissions.join(", ")}</p>
                      ) : null}
                    </details>
                  </td>
                  <td className="px-4 py-3 capitalize">{employee.userStatus.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-[var(--stone)]">{employee.lastLoginAt ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="text-xs underline" onClick={() => void run(() => call(url, "PATCH", { action: suspended ? "reactivate" : "suspend" }), suspended ? "Access granted." : "Access denied (suspended).")}>
                        {suspended ? "Grant access" : "Deny access"}
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-700 underline"
                        onClick={() => {
                          if (window.confirm(`Delete ${employee.name}? This revokes all access.`)) void run(() => call(url, "DELETE"), "Employee deleted.");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {employees.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--stone)]">
            No employees found. Run <code>npm run create-admin</code> or set INITIAL_ADMIN_* and run{" "}
            <code>npm run seed</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
