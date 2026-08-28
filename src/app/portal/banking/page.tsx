import { PortalPage } from "@/components/portal/PortalPage";
import { BankingAdviserDashboard } from "@/components/portal/BankingAdviserDashboard";

export default function BankingPortalPage() {
  return (
    <PortalPage
      title="Banking coordination"
      description="Assigned instrument review, wording comparison, and coordination records."
    >
      <BankingAdviserDashboard />
    </PortalPage>
  );
}
