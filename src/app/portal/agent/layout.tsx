import { PortalAppShell } from "@/components/portal/PortalAppShell";
import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export const dynamic = "force-dynamic";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("agent");
  return (
    <PortalAppShell>
      <div className="portal-shell md:flex">
        <Sidebar title="Agent portal" links={[{ href: "/portal/agent", label: "Submissions" }]} />
        <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </PortalAppShell>
  );
}
