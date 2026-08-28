import { PortalPage } from "@/components/portal/PortalPage";
import { IntegrationsHealthPanel } from "@/components/admin/IntegrationsHealthPanel";

export default function IntegrationsAdminPage() {
  return (
    <PortalPage
      title="Integrations"
      description="Provider health, feature flags, and job status. Credentials are never displayed."
    >
      <IntegrationsHealthPanel />
    </PortalPage>
  );
}
