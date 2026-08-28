import { BuyerOnboardingDashboard } from "@/components/portal/BuyerOnboardingDashboard";
import { getSession } from "@/lib/auth/session";
import { getBuyerOrganizationForUser } from "@/lib/buyers/verification";
import { loadOnboardingStatusForUser } from "@/lib/onboarding/status";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuyerOnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getBuyerOrganizationForUser(session.userId);
  if (!org) {
    return <p className="text-sm text-[var(--stone)]">No buyer organization found.</p>;
  }

  const status = await loadOnboardingStatusForUser(session.userId, String(org._id));
  if (!status) {
    return <p className="text-sm text-[var(--stone)]">Unable to load onboarding status.</p>;
  }

  return (
    <BuyerOnboardingDashboard
      organizationId={status.organization.id}
      organizationName={status.organization.legalName}
      orgStatus={status.organization.status}
      onboardingStatus={status.organization.onboardingStatus ?? "pending"}
      verificationNotes={status.organization.verificationNotes}
      steps={status.steps}
      canTrade={status.canTrade}
      cisStatus={status.cis?.status}
      reviewComments={status.cis?.reviewComments}
    />
  );
}
