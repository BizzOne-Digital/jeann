import { requirePortalAccess } from "@/lib/auth/portal-access";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";

export const dynamic = "force-dynamic";

export default async function WorkspaceSuppliersPage() {
  await requirePortalAccess("workspace");
  await tryConnectMongo();
  const { Organization } = await import("@/models");
  const suppliers = await Organization.find({ type: "supplier", deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <PortalPage
      title="Supplier organizations"
      description="Invite-only supplier records — not visible on the public website. Onboarding is handled through secure invitations."
    >
      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--cream)] text-xs uppercase text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Legal name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[var(--stone)]">
                  No supplier organizations yet. Create invitations from Admin when ready.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={String(s._id)} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3 font-medium">{s.legalName}</td>
                  <td className="px-4 py-3">{s.country}</td>
                  <td className="px-4 py-3 capitalize">{s.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PortalPage>
  );
}
