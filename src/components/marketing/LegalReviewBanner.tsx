export function LegalReviewBanner({ version = "2026" }: { version?: string }) {
  return (
    <aside
      className="mb-10 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink"
      role="note"
    >
      <p className="font-semibold text-navy">Important notice</p>
      <p className="mt-1 text-stone">
        Version {version}. This summary is for general information on the Finekarts website. It is
        not legal advice — binding terms appear in counsel-reviewed contracts and instruments signed
        by the parties.
      </p>
    </aside>
  );
}
