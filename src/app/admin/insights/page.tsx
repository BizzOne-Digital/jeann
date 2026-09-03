import { PortalPage } from "@/components/portal/PortalPage";
import { AdminInsightsManager } from "@/components/admin/AdminInsightsManager";

export const dynamic = "force-dynamic";

export default function AdminInsightsPage() {
  return (
    <PortalPage
      title="Insights & blog"
      description="Publish educational articles to the public Insights section. Falls back to seed content when none are published."
    >
      <AdminInsightsManager />
    </PortalPage>
  );
}
