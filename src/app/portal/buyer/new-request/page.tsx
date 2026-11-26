import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerPurchaseOrderWorkspace } from "@/components/portal/BuyerPurchaseOrderWorkspace";

export default async function NewRequestPage() {
  await requirePortalAccess("buyer");

  return (
    <PortalPage
      title="New transaction"
      description="Start a transaction by submitting an ICPO, or by uploading your PO, ICPO or LOI. After review, Finekarts opens the transaction and sends the PSA together with the LC wording and the Proforma Invoice. Everything for this transaction is then kept in its own Documents tab."
    >
      <BuyerPurchaseOrderWorkspace />
    </PortalPage>
  );
}
