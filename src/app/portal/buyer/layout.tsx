import { PortalAppShell } from "@/components/portal/PortalAppShell";
import { BuyerProfileMaintenanceNotice } from "@/components/portal/BuyerProfileMaintenanceNotice";
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

// Approved buyer: only what the buyer needs day to day. Documents live inside each transaction.
// The other pages (requests, invoices, company details, organization, contact) are still reachable
// from the pages that use them (Transactions, Company profile, Overview).
const fullLinks = [
  { label: "Overview", href: "/portal/buyer" },
  { label: "Transactions", href: "/portal/buyer/transactions" },
  { label: "New transaction", href: "/portal/buyer/new-request" },
  { label: "Tracking shipments", href: "/portal/buyer/shipments" },
  { label: "Booking", href: "/portal/buyer/booking" },
  { label: "Company profile", href: "/portal/buyer/cis" },
  { label: "Messages", href: "/portal/buyer/messages" },
  { label: "Help", href: "/portal/buyer/help" },
];

// Before approval the buyer only completes onboarding.
const onboardingLinks = [
  { label: "Onboarding", href: "/portal/buyer/onboarding" },
  { label: "Company profile", href: "/portal/buyer/cis" },
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
      <PortalAppShell>
        <div className="portal-shell md:flex">
          <Sidebar title="Buyer onboarding" links={onboardingLinks} />
          <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Complete onboarding and await admin approval before trading functions unlock.{" "}
              <Link href="/portal/buyer/onboarding" className="font-medium underline">
                View checklist
              </Link>
            </div>
            <div className="mb-6">
              <BuyerProfileMaintenanceNotice />
            </div>
            {children}
          </main>
        </div>
      </PortalAppShell>
    );
  }

  return (
    <PortalAppShell>
      <div className="portal-shell md:flex">
        <Sidebar title="Buyer portal" links={fullLinks} />
        <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">
          <div className="mb-6">
            <BuyerProfileMaintenanceNotice />
          </div>
          {children}
        </main>
      </div>
    </PortalAppShell>
  );
}
