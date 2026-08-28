import { PortalPage } from "@/components/portal/PortalPage";
import { BankingInstrumentWorkspace } from "@/components/portal/BankingInstrumentWorkspace";

export default async function BankingInstrumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PortalPage title="Banking instrument" description="Instrument coordination workspace.">
      <BankingInstrumentWorkspace instrumentId={id} />
    </PortalPage>
  );
}
