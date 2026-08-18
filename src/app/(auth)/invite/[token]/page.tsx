import Link from "next/link";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="display text-3xl text-[var(--navy)]">Accept your invitation</h1>
      <p className="mt-3 text-[var(--stone)]">
        This secure invitation link is for approved supplier or buyer onboarding. Continue to sign in
        or complete registration — the token will be validated when account setup is connected.
      </p>
      <p className="mt-4 font-mono text-xs text-[var(--stone)]">Invitation: {token.slice(0, 8)}…</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/login?invite=${encodeURIComponent(token)}`} className="btn btn-primary">
          Sign in to continue
        </Link>
        <Link href="/register/buyer" className="btn btn-secondary">
          Register as buyer
        </Link>
      </div>
    </div>
  );
}
