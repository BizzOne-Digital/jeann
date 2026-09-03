import { PortalPage } from "@/components/portal/PortalPage";
import { WorkspaceDashboard } from "@/components/workspace/WorkspaceDashboard";

export default function WorkspacePage() {
  return (
    <PortalPage
      title="Employee workspace"
      description="Operational queues for purchase requests, transactions, shipments, and finance."
    >
      <WorkspaceDashboard />
    </PortalPage>
  );
}
