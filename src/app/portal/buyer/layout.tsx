import { Sidebar } from "@/components/portal/Sidebar";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import {
  getBuyerOrganizationForUser,
  isBuyerOrganizationVerified,
} from "@/lib/buyers/verification";

export const dynamic = "force-dynamic";

const fullLinks = [
  { label: "Overview", href: "/portal/buyer" },
  { label: "Onboarding", href: "/portal/buyer/onboarding" },
  { label: "New request", href: "/portal/buyer/new-request" },
  { label: "Requests", href: "/portal/buyer/requests" },
  { label: "Transactions", href: "/portal/buyer/transactions" },
  { label: "Shipments", href: "/portal/buyer/shipments" },
  { label: "Invoices", href: "/portal/buyer/invoices" },
  { label: "Corporate information", href: "/portal/buyer/cis" },
  { label: "Documents", href: "/portal/buyer/documents" },
  { label: "Booking", href: "/portal/buyer/booking" },
  { label: "Contact", href: "/portal/buyer/contact" },
  { label: "Messages", href: "/portal/buyer/messages" },
  { label: "Organization", href: "/portal/buyer/organization" },
  { label: "Help", href: "/portal/buyer/help" },
];

const onboardingLinks = [
  { label: "Onboarding", href: "/portal/buyer/onboarding" },
  { label: "CIS/KYB", href: "/portal/buyer/cis" },
  { label: "Documents", href: "/portal/buyer/documents" },
  { label: "Help", href: "/portal/buyer/help" },
];

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("buyer");
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getBuyerOrganizationForUser(session.userId);
  const verified = isBuyerOrganizationVerified(org);

  if (!verified) {
    return (
      <div className="portal-shell md:flex">
        <Sidebar title="Buyer onboarding" links={onboardingLinks} />
        <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Complete onboarding and await admin approval before trading functions unlock.{" "}
            <Link href="/portal/buyer/onboarding" className="font-medium underline">
              View checklist
            </Link>
          </div>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="portal-shell md:flex">
      <Sidebar title="Buyer portal" links={fullLinks} />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
