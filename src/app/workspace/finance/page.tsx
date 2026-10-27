import { PortalPage } from "@/components/portal/PortalPage";
import { FinanceDashboard } from "@/components/portal/FinanceDashboard";
import { FinanceTransactionTabs } from "@/components/portal/FinanceTransactionTabs";

export default function FinanceWorkspacePage() {
  return (
    <PortalPage
      title="Finance dashboard"
      description="Operational revenue, costs, receivables and contribution profit. Not audited corporate net income."
    >
      <div className="space-y-10">
        <FinanceDashboard />
        <FinanceTransactionTabs />
      </div>
    </PortalPage>
  );
}
