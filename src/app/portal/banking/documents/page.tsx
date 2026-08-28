import { PortalPage } from "@/components/portal/PortalPage";
import { BankingDocumentsPanel } from "@/components/portal/BankingDocumentsPanel";

export default function BankingDocumentsPage() {
  return (
    <PortalPage
      title="Banking documents"
      description="Presentation packages and courier records for your assigned instruments."
    >
      <BankingDocumentsPanel />
    </PortalPage>
  );
}
