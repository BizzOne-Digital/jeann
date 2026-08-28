import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerInvoicesList } from "@/components/portal/BuyerInvoicesList";

export default function BuyerInvoicesPage() {
  return (
    <PortalPage title="Invoices" description="Your issued buyer invoices and payment status.">
      <BuyerInvoicesList />
    </PortalPage>
  );
}
