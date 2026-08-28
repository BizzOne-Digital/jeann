import { PortalPage } from "@/components/portal/PortalPage";
import { FinanceDashboard } from "@/components/portal/FinanceDashboard";

export default function FinanceWorkspacePage() {
  return (
    <PortalPage
      title="Finance dashboard"
      description="Operational revenue, costs, receivables and contribution profit. Not audited corporate net income."
    >
      <FinanceDashboard />
    </PortalPage>
  );
}
