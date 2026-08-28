import { InviteAcceptForm } from "@/components/auth/InviteAcceptForm";
import { findInvitationByToken } from "@/lib/invitations/service";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { invitation, valid, reason } = await findInvitationByToken(token);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="display text-3xl text-[var(--navy)]">Accept your invitation</h1>
      <p className="mt-3 text-[var(--stone)]">
        Complete account setup for your Finekarts invitation. Supplier and employee accounts require
        an administrator-issued invite.
      </p>
      <InviteAcceptForm
        token={token}
        invite={{
          valid,
          reason,
          email: invitation?.email,
          contactName: invitation?.contactName,
          organizationType: invitation?.organizationType,
          intendedLegalName: invitation?.intendedLegalName,
        }}
      />
    </div>
  );
}
