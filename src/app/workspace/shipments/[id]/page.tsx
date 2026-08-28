import { PortalPage } from "@/components/portal/PortalPage";
import { ShipmentLotWorkspace } from "@/components/portal/ShipmentLotWorkspace";

type Params = { params: Promise<{ id: string }> };

export default async function WorkspaceShipmentDetailPage({ params }: Params) {
  const { id } = await params;
  return (
    <PortalPage title="Shipment workspace" description="Full internal shipment lot workspace.">
      <ShipmentLotWorkspace lotId={id} />
    </PortalPage>
  );
}
