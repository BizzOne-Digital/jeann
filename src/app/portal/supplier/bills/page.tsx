import { PortalPage } from "@/components/portal/PortalPage";
import { SupplierBillsList } from "@/components/portal/SupplierBillsList";

export default function SupplierBillsPage() {
  return (
    <PortalPage title="Supplier bills" description="Approved payable amounts and payment status.">
      <SupplierBillsList />
    </PortalPage>
  );
}
