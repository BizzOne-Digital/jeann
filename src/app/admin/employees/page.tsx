import { requirePortalAccess } from "@/lib/auth/portal-access";
import { listInternalEmployees } from "@/lib/admin/list-employees";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminEmployeesList } from "@/components/admin/AdminEmployeesList";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;
  const employees = conn ? await listInternalEmployees() : [];

  return (
    <PortalPage
      title="Employees & Roles"
      description="Finekarts staff accounts linked to the internal organization, with roles and access status."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? `${employees.length} employee${employees.length === 1 ? "" : "s"} in internal org`
            : mongoConfigured
              ? "MongoDB URI set but unreachable — employee list unavailable."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Employee listing requires a working MongoDB connection.
          </p>
        ) : (
          <AdminEmployeesList employees={employees} />
        )}
      </div>
    </PortalPage>
  );
}
