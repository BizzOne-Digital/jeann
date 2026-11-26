import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerTransactionFolders } from "@/components/portal/BuyerTransactionFolders";

export default function TransactionsPage() {
  return (
    <PortalPage
      title="Transactions"
      description="Your pending, active and closed transactions. Each transaction has its own documents."
    >
      <BuyerTransactionFolders />
    </PortalPage>
  );
}
