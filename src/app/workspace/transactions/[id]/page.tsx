import { PortalPage } from "@/components/portal/PortalPage";
import { TransactionWorkspaceTabs } from "@/components/portal/TransactionWorkspaceTabs";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export default async function WorkspaceTransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePortalAccess("workspace");
  const { id } = await params;

  return (
    <PortalPage
      title="Transaction workspace"
      description="Steps 1–6, documents, finance, banking, and staff actions."
    >
      <TransactionWorkspaceTabs
        transactionId={id}
        apiBase="/api/workspace/transactions"
        mode="buyer"
        showFinance
        showStaffActions
      />
    </PortalPage>
  );
}
