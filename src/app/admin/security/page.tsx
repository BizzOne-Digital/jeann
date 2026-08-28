import { PortalPage } from "@/components/portal/PortalPage";
import { SecurityDashboardPanel } from "@/components/admin/SecurityDashboardPanel";

export default function SecurityAdminPage() {
  return (
    <PortalPage
      title="Security"
      description="Failed logins, unauthorized access, incidents, and production readiness checks. Restricted to security administrators."
    >
      <SecurityDashboardPanel />
    </PortalPage>
  );
}
