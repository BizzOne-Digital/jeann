import { PortalPage } from "@/components/portal/PortalPage";
import { SupplierTransactionsList } from "@/components/portal/SupplierTransactionsList";

export default function SupplierTransactionsPage() {
  return (
    <PortalPage
      title="Procurement transactions"
      description="Formal supplier-purchase transactions assigned to your organization."
    >
      <SupplierTransactionsList />
    </PortalPage>
  );
}
