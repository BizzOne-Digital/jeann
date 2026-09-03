import { requirePortalAccess } from "@/lib/auth/portal-access";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import { listThreadsForOrganization } from "@/lib/messages/message-service";
import { PortalPage } from "@/components/portal/PortalPage";
import { PortalMessagesPanel } from "@/components/portal/PortalMessagesPanel";

export default async function SupplierMessagesPage() {
  const session = await requirePortalAccess("supplier");
  let initialThreads: Awaited<ReturnType<typeof listThreadsForOrganization>> = [];
  try {
    const access = await assertSupplierTransactionAccess(session.userId);
    initialThreads = await listThreadsForOrganization(access.organizationId, "external");
  } catch {
    initialThreads = [];
  }

  return (
    <PortalPage
      title="Messages"
      description="Secure messages with the Finekarts trade desk about your offers and transactions."
    >
      <PortalMessagesPanel
        apiBase="/api/portal/supplier/messages"
        initialThreads={initialThreads}
      />
    </PortalPage>
  );
}
