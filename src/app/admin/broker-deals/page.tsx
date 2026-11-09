import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminAgentDealsManager } from "@/components/admin/AdminAgentDealsManager";

export const dynamic = "force-dynamic";

export default async function AdminBrokerDealsPage() {
  await requirePortalAccess("admin");
  return (
    <PortalPage
      title="Broker Submissions"
      description="LOI and ICPO files that brokers submit when they introduce a buyer and a supplier."
    >
      <AdminAgentDealsManager channel="broker" />
    </PortalPage>
  );
}
