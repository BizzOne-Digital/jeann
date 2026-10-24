import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerPurchaseOrderWorkspace } from "@/components/portal/BuyerPurchaseOrderWorkspace";

export default async function NewRequestPage() {
  await requirePortalAccess("buyer");

  return (
    <PortalPage
      title="Purchase order / ICPO"
      description="Submit an ICPO or upload a PO, ICPO, or LOI. After review, Finekarts may issue a PSA — the purchase and sale contract between buyer and seller. After the PSA is signed and stamped, a Proforma Invoice follows for standard transactions."
    >
      <BuyerPurchaseOrderWorkspace />
    </PortalPage>
  );
}
