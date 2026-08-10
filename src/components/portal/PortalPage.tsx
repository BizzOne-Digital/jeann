import { EmptyState } from "@/components/portal/EmptyState";

export function PortalPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ocean)]">
          Finekarts portal
        </p>
        <h1 className="display mt-1 text-4xl text-[var(--navy)]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[var(--stone)]">{description}</p>
        ) : null}
      </header>
      {children ?? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          detail="This area is connected to your account when live records are available. Demo data is not shown unless explicitly enabled."
        />
      )}
    </>
  );
}
