import { PortalPage } from "@/components/portal/PortalPage";
import { SupplierOffersList } from "@/components/portal/SupplierOffersList";

export default function SupplierOffersPage() {
  return (
    <PortalPage
      title="Trade offers"
      description="Draft and submit supplier trade offers for Finekarts review."
    >
      <SupplierOffersList />
    </PortalPage>
  );
}
