export function StatPill({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--stone)]">{label}</p><p className="mt-1 text-2xl font-semibold text-[var(--navy)]">{value}</p></div>;
}
