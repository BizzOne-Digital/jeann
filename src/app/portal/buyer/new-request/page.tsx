import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerPurchaseOrderWorkspace } from "@/components/portal/BuyerPurchaseOrderWorkspace";

export default async function NewRequestPage() {
  await requirePortalAccess("buyer");

  return (
    <PortalPage
      title="New transaction"
      description="Start a transaction by submitting an ICPO, or by uploading your PO, ICPO or LOI. After review, Finekarts opens the transaction and sends you the PSA and the LC wording to sign. Once both parties have signed, you receive a copy of the contract together with the Proforma Invoice. Everything for this transaction is kept in its own Documents tab."
    >
      <BuyerPurchaseOrderWorkspace />
    </PortalPage>
  );
}
