import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminAgentDealsManager } from "@/components/admin/AdminAgentDealsManager";

export const dynamic = "force-dynamic";

export default async function AdminAgentDealsPage() {
  await requirePortalAccess("admin");
  return (
    <PortalPage
      title="Agent Submissions"
      description="LOI and ICPO files that agents submit on behalf of their principal, the end buyer."
    >
      <AdminAgentDealsManager />
    </PortalPage>
  );
}
