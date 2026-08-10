export function LegalReviewBanner({ version = "0.1-draft" }: { version?: string }) {
  return (
    <aside
      className="mb-10 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink"
      role="note"
    >
      <p className="font-semibold text-navy">Draft — legal review required</p>
      <p className="mt-1 text-stone">
        Version {version}. This text is provided for website structure and internal review. It does
        not constitute legal advice and must be approved by qualified counsel before reliance.
      </p>
    </aside>
  );
}
