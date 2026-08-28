import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotsList } from "@/components/portal/ShipmentLotsList";

export default function SupplierShipmentsPage() {
  return (
    <PortalPage
      title="Procurement shipments"
      description="Supplier shipment lots with loading requirements and supplier-responsible documents."
    >
      <ShipmentLotsList detailBasePath="/portal/supplier/shipments" />
    </PortalPage>
  );
}
