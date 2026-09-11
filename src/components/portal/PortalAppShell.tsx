import { SiteFooter } from "@/components/marketing/SiteFooter";

/** Wraps portal/admin/workspace content with the same site footer as marketing pages. */
export async function PortalAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip">
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
