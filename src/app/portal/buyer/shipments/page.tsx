import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotsList } from "@/components/portal/ShipmentLotsList";

export default function BuyerShipmentsPage() {
  return (
    <PortalPage
      title="Shipments"
      description="Buyer shipment lots with approved status, documents, and tracking visible to your organization."
    >
      <ShipmentLotsList detailBasePath="/portal/buyer/shipments" />
    </PortalPage>
  );
}
