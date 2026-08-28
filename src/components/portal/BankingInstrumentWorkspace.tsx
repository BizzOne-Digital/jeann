"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ComparisonIssue = {
  severity: "error" | "warning" | "info";
  field: string;
  expected?: string;
  actual?: string;
  message: string;
  suggestedAction?: string;
};

type ComparisonResult = {
  blocking: ComparisonIssue[];
  warnings: ComparisonIssue[];
  disclaimer?: string;
};

function severityClass(severity: ComparisonIssue["severity"]): string {
  if (severity === "error") return "border-red-200 bg-red-50 text-red-900";
  if (severity === "warning") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-blue-200 bg-blue-50 text-blue-900";
}

function ComparisonIssues({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: ComparisonIssue[];
  emptyMessage: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--navy)]">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--stone)]">{emptyMessage}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.field}-${index}`}
              className={`rounded-md border px-3 py-2 text-sm ${severityClass(item.severity)}`}
            >
              <p className="font-medium capitalize">{item.field.replaceAll("_", " ")}</p>
              <p className="mt-1">{item.message}</p>
              {item.expected || item.actual ? (
                <dl className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                  {item.expected ? (
                    <div>
                      <dt className="opacity-70">Expected</dt>
                      <dd>{item.expected}</dd>
                    </div>
                  ) : null}
                  {item.actual ? (
                    <div>
                      <dt className="opacity-70">Actual</dt>
                      <dd>{item.actual}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              {item.suggestedAction ? (
                <p className="mt-2 text-xs opacity-80">Suggested: {item.suggestedAction}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BankingInstrumentWorkspace({ instrumentId }: { instrumentId: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [compare, setCompare] = useState<ComparisonResult | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/banking/instruments/${instrumentId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [instrumentId]);

  async function runCompare() {
    setComparing(true);
    setCompareError(null);
    try {
      const res = await fetch(`/api/banking/instruments/${instrumentId}/compare`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Comparison failed");
      setCompare(json as ComparisonResult);
    } catch (e) {
      setCompareError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      setComparing(false);
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading…</p>;

  const instrument = data.instrument as Record<string, unknown>;
  const blockingCount = compare?.blocking.length ?? 0;
  const warningCount = compare?.warnings.length ?? 0;

  return (
    <div className="space-y-6">
      <Link href="/portal/banking" className="text-sm text-[var(--stone)]">
        ← Banking
      </Link>
      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h1 className="text-xl font-semibold text-[var(--navy)]">{String(instrument.instrumentId)}</h1>
        <p className="mt-2 text-sm text-[var(--stone)]">Status: {String(instrument.statusLabel)}</p>
        <p className="text-sm text-[var(--stone)]">
          Side: {String(instrument.transactionSide)} · {String(instrument.currency)}{" "}
          {String(instrument.amount)}
        </p>
        <p className="mt-2 text-xs text-amber-800">
          Issued copy verification: {String(instrument.issuedCopyVerificationStatus)}. Advice status:{" "}
          {String(instrument.adviceAuthenticationStatus)}. Recorded determinations are not platform
          authentication.
        </p>
        <button type="button" onClick={runCompare} className="btn btn-outline mt-4" disabled={comparing}>
          {comparing ? "Comparing…" : "Run contract comparison"}
        </button>
      </section>

      {compareError ? <p className="text-sm text-red-600">{compareError}</p> : null}

      {compare ? (
        <section className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5 text-sm">
          <div>
            <h2 className="font-semibold text-[var(--navy)]">Comparison result</h2>
            <p className="mt-1 text-[var(--stone)]">{compare.disclaimer}</p>
            <p className="mt-2 text-sm">
              {blockingCount === 0 ? (
                <span className="font-medium text-[var(--forest)]">No blocking mismatches found.</span>
              ) : (
                <span className="font-medium text-red-700">
                  {blockingCount} blocking issue{blockingCount === 1 ? "" : "s"} found.
                </span>
              )}
              {warningCount > 0 ? (
                <span className="text-[var(--stone)]">
                  {" "}
                  · {warningCount} warning{warningCount === 1 ? "" : "s"}/note
                  {warningCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </p>
          </div>

          <ComparisonIssues
            title="Blocking issues"
            items={compare.blocking}
            emptyMessage="None — instrument matches contract on critical fields."
          />
          <ComparisonIssues
            title="Warnings & notes"
            items={compare.warnings}
            emptyMessage="No additional warnings."
          />
        </section>
      ) : null}
    </div>
  );
}
