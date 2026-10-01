import Link from "next/link";
import { CareerApplicantAuth } from "@/components/marketing/CareerApplicantAuth";

export default function RegisterCareerPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <h1 className="display text-3xl text-[var(--navy)]">Career portal registration</h1>
      <p className="mb-6 mt-2 text-sm text-[var(--stone)]">
        Use your email as your username. After registration you&apos;ll return to the{" "}
        <Link href="/privacy#career-application" className="font-semibold text-[#c88e4a] underline">
          careers application
        </Link>
        .
      </p>
      <CareerApplicantAuth />
    </div>
  );
}
