import { VerifyPhoneForm } from "@/components/auth/VerifyPhoneForm";

export default function VerifyPhonePage() {
  return (
    <>
      <h1 className="display text-3xl text-[var(--navy)]">Verify your phone</h1>
      <p className="mt-3 text-[var(--stone)]">
        Phone verification helps secure your buyer account and trade desk communications.
      </p>
      <div className="mt-6">
        <VerifyPhoneForm />
      </div>
    </>
  );
}
