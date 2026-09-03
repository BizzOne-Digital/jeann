import { requirePortalAccess } from "@/lib/auth/portal-access";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { listThreadsForOrganization } from "@/lib/messages/message-service";
import { PortalPage } from "@/components/portal/PortalPage";
import { PortalMessagesPanel } from "@/components/portal/PortalMessagesPanel";

export default async function BuyerMessagesPage() {
  const session = await requirePortalAccess("buyer");
  let initialThreads: Awaited<ReturnType<typeof listThreadsForOrganization>> = [];
  try {
    const access = await assertBuyerTransactionAccess(session.userId);
    initialThreads = await listThreadsForOrganization(access.organizationId, "external");
  } catch {
    initialThreads = [];
  }

  return (
    <PortalPage
      title="Messages"
      description="Secure messages with your Finekarts trade desk, grouped by conversation."
    >
      <PortalMessagesPanel
        apiBase="/api/portal/buyer/messages"
        initialThreads={initialThreads}
      />
    </PortalPage>
  );
}
