import { PortalPage } from "@/components/portal/PortalPage";
import { SupplierTransactionWorkspace } from "@/components/portal/SupplierTransactionWorkspace";

export default async function SupplierTransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PortalPage title="Procurement transaction" description="Supplier-visible workflow and documents.">
      <SupplierTransactionWorkspace transactionId={id} />
    </PortalPage>
  );
}
