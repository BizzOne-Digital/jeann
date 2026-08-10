export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <section className="rounded-lg border border-dashed border-[var(--line-strong)] bg-white p-8 text-center"><h2 className="font-display text-2xl text-[var(--navy)]">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-[var(--stone)]">{detail}</p></section>;
}
