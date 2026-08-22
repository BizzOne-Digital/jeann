import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export const dynamic = "force-dynamic";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Dashboard", href: "/admin" },
  { label: "Website Pages", href: "/admin/pages" },
  { label: "Products", href: "/admin/products" },
  { label: "Packaging", href: "/admin/packaging" },
  { label: "Purchase Requests", href: "/admin/purchase-requests" },
  { label: "Trade Offers", href: "/admin/trade-offers" },
  { label: "Transactions", href: "/admin/transactions" },
  { label: "Buyer Organizations", href: "/admin/buyers" },
  { label: "Supplier Organizations", href: "/admin/suppliers" },
  { label: "Employees & Roles", href: "/admin/employees" },
  { label: "Documents & Templates", href: "/admin/documents" },
  { label: "Validation Rules", href: "/admin/validation-rules" },
  { label: "Payment Terms", href: "/admin/payment-terms" },
  { label: "Approvals", href: "/admin/approvals" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Team", href: "/admin/team" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Shipments", href: "/admin/shipments" },
  { label: "Finance & Reports", href: "/admin/finance" },
  { label: "AI Knowledge", href: "/admin/ai" },
  { label: "Integrations", href: "/admin/integrations" },
  { label: "Terms & Policies", href: "/admin/terms" },
  { label: "Audit Log", href: "/admin/audit" },
  { label: "Global Settings", href: "/admin/settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("admin");
  return (
    <div className="portal-shell md:flex">
      <Sidebar title="Administration" links={NAV} />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
