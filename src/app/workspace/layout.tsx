import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("workspace");
  return (
    <div className="portal-shell md:flex">
      <Sidebar
        title="Employee workspace"
        links={[
          { href: "/workspace", label: "Queues" },
          { href: "/workspace/transactions", label: "Assigned transactions" },
        ]}
      />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
