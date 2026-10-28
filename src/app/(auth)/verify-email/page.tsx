import { VerifyAccountForm } from "@/components/auth/VerifyAccountForm";
import { isSmsConfigured } from "@/lib/auth/verification-policy";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  return (
    <>
      <h1 className="display text-3xl text-[var(--navy)]">Verify your account</h1>
      <p className="mt-3 text-[var(--stone)]">
        {isSmsConfigured()
          ? "Enter the code sent to your phone first. Then confirm the code sent to your company email."
          : "Enter the code sent to your company email."}
      </p>
      <div className="mt-6">
        <VerifyAccountForm initialEmail={email ?? ""} smsEnabled={isSmsConfigured()} />
      </div>
    </>
  );
}
