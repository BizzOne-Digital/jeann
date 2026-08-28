import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotDetail } from "@/components/portal/ShipmentLotDetail";

type Params = { params: Promise<{ id: string }> };

export default async function SupplierShipmentDetailPage({ params }: Params) {
  const { id } = await params;
  return (
    <PortalPage title="Shipment details" description="Supplier-visible shipment and loading information.">
      <ShipmentLotDetail lotId={id} />
    </PortalPage>
  );
}
