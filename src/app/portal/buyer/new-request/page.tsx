import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerPurchaseOrderWorkspace } from "@/components/portal/BuyerPurchaseOrderWorkspace";

export default async function NewRequestPage() {
  await requirePortalAccess("buyer");

  return (
    <PortalPage
      title="Purchase order / ICPO"
      description="Submit a structured ICPO or upload a PO, ICPO, or LOI. Key fields will be used to prepare your Sales Purchase Agreement (PSA) after review."
    >
      <BuyerPurchaseOrderWorkspace />
    </PortalPage>
  );
}
