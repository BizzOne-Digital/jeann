/** Portal/admin/workspace shell — no marketing footer (public site only). */
export function PortalAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip">
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
