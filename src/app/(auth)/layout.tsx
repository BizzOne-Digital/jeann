import Link from "next/link";
import { MarketingEnquiryCta } from "@/components/marketing/MarketingEnquiryCta";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[var(--cream)]">
      <main className="flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mx-auto block w-full max-w-md font-display text-3xl font-semibold text-[var(--navy)]"
        >
          Finekarts
        </Link>
        <div className="mx-auto mt-5 w-full max-w-md rounded-xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
          {children}
        </div>
      </main>
      <MarketingEnquiryCta />
      <SiteFooter />
    </div>
  );
}
