import { PortalPage } from "@/components/portal/PortalPage";
import { SupplierOfferForm } from "@/components/portal/SupplierOfferForm";

export default function NewSupplierOfferPage() {
  return (
    <PortalPage
      title="New trade offer"
      description="Create a draft supplier offer. Submit when ready for Finekarts review."
    >
      <SupplierOfferForm />
    </PortalPage>
  );
}
