import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export const dynamic = "force-dynamic";

export default async function SupplierLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("supplier");
  return (
    <div className="portal-shell md:flex">
      <Sidebar
        title="Supplier portal"
        links={[
          { href: "/portal/supplier", label: "Dashboard" },
          { href: "/portal/supplier/offers", label: "Trade offers" },
          { href: "/portal/supplier/transactions", label: "Procurement" },
          { href: "/portal/supplier/shipments", label: "Shipments" },
          { href: "/portal/supplier/bills", label: "Bills" },
          { href: "/portal/supplier/messages", label: "Messages" },
        ]}
      />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
