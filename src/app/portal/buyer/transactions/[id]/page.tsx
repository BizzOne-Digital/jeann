import { PortalPage } from "@/components/portal/PortalPage";
import { BuyerTransactionWorkspace } from "@/components/portal/BuyerTransactionWorkspace";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PortalPage
      title="Transaction workspace"
      description="Track workflow status, documents, and banking setup for this deal."
    >
      <BuyerTransactionWorkspace transactionId={id} />
    </PortalPage>
  );
}
