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

const links = [
  { label: "Overview", href: "/portal/buyer" },
  { label: "New request", href: "/portal/buyer/new-request" },
  { label: "Requests", href: "/portal/buyer/requests" },
  { label: "Transactions", href: "/portal/buyer/transactions" },
  { label: "Corporate information", href: "/portal/buyer/cis" },
  { label: "Documents", href: "/portal/buyer/documents" },
  { label: "Booking", href: "/portal/buyer/booking" },
  { label: "Contact", href: "/portal/buyer/contact" },
  { label: "Messages", href: "/portal/buyer/messages" },
  { label: "Organization", href: "/portal/buyer/organization" },
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
      <div className="portal-shell flex min-h-[70vh] items-center justify-center p-6">
        <div className="max-w-lg rounded-lg border border-[var(--line)] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--navy)]">Approval pending</h1>
          <p className="mt-3 text-sm text-[var(--stone)]">
            {org?.legalName
              ? `${org.legalName} is registered and awaiting Finekarts review.`
              : "Your buyer organization is awaiting review."}{" "}
            You will receive an email when your portal access is approved.
          </p>
          <p className="mt-2 text-sm capitalize text-[var(--stone)]">
            Current status: {org?.status ?? "pending"}
          </p>
          <Link href="/login" className="btn btn-primary mt-6 inline-flex">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-shell md:flex">
      <Sidebar title="Buyer portal" links={links} />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
