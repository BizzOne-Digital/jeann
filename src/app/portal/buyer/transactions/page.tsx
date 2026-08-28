import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerTransactionsList } from "@/components/portal/BuyerTransactionsList";

export default function TransactionsPage() {
  return (
    <PortalPage
      title="Transactions"
      description="Formal buyer sale transactions with controlled workflow and document history."
    >
      <BuyerTransactionsList />
    </PortalPage>
  );
}
