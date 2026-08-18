import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

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
  return (
    <div className="portal-shell md:flex">
      <Sidebar title="Buyer portal" links={links} />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
