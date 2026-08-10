import { Sidebar } from "@/components/portal/Sidebar";
import { requirePortalAccess } from "@/lib/auth/portal-access";

export const dynamic = "force-dynamic";

const links = [
  "Overview",
  "Requests",
  "Transactions",
  "Corporate information",
  "Documents",
  "Messages",
  "Organization",
  "Help",
].map((label) => ({
  label,
  href:
    label === "Overview"
      ? "/portal/buyer"
      : `/portal/buyer/${label === "Corporate information" ? "cis" : label.toLowerCase()}`,
}));

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  await requirePortalAccess("buyer");
  return (
    <div className="portal-shell md:flex">
      <Sidebar title="Buyer portal" links={links} />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
