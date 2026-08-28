import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotDetail } from "@/components/portal/ShipmentLotDetail";

type Params = { params: Promise<{ id: string }> };

export default async function BuyerShipmentDetailPage({ params }: Params) {
  const { id } = await params;
  return (
    <PortalPage title="Shipment details" description="Buyer-visible shipment information only.">
      <ShipmentLotDetail lotId={id} />
    </PortalPage>
  );
}
