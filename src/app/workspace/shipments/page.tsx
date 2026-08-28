import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotsList } from "@/components/portal/ShipmentLotsList";

export default function WorkspaceShipmentsPage() {
  return (
    <PortalPage
      title="Shipment lots"
      description="Internal shipment operations — buyer and supplier lots remain separate records linked only through authorized allocations."
    >
      <ShipmentLotsList detailBasePath="/workspace/shipments" />
    </PortalPage>
  );
}
