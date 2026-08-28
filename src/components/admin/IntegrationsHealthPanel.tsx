"use client";

import { useEffect, useState } from "react";

type Health = {
  environment: string;
  providers: Record<string, { ok?: boolean; status?: string; message?: string; provider?: string }>;
  jobs: { pending: number; failed: number; deadLetter: number };
  webhooks: { failed: number; recent: number };
  featureFlags: Array<{ key: string; label: string; enabled: boolean }>;
  disclaimer: string;
};

export function IntegrationsHealthPanel() {
  const [data, setData] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/integrations/health")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load integrations");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading integration health…</p>;

  const providerEntries = Object.entries(data.providers ?? {});

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providerEntries.map(([name, p]) => (
          <div key={name} className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="text-xs text-[var(--stone)]">{name}</p>
            <p className="mt-1 font-semibold text-[var(--navy)]">
              {p.status ?? p.provider ?? "—"}
            </p>
            {p.message && <p className="mt-1 text-xs text-[var(--stone)]">{p.message}</p>}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm">
        <p>Jobs pending: {data.jobs.pending} · failed: {data.jobs.failed} · dead letter: {data.jobs.deadLetter}</p>
        <p className="mt-1">Webhooks (24h): {data.webhooks.recent} · failed: {data.webhooks.failed}</p>
      </div>
      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        <h3 className="font-semibold text-[var(--navy)]">Feature flags</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {data.featureFlags?.slice(0, 12).map((f) => (
            <li key={f.key}>
              {f.enabled ? "✓" : "○"} {f.label}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-[var(--stone)]">{data.disclaimer}</p>
    </div>
  );
}
