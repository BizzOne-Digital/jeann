"use client";

import { useEffect, useState } from "react";

type Dashboard = {
  summary: {
    failedLogins24h: number;
    lockedAccounts: number;
    unauthorizedAttempts24h: number;
    crossTenantAttempts24h: number;
    highSeverityOpenEvents: number;
    openIncidents: number;
    recentEvents: Array<{
      id: string;
      eventType: string;
      severity: string;
      result: string;
      createdAt: string;
    }>;
  };
  productionValidation: { ok: boolean; blockers: string[] };
  environment: string;
};

export function SecurityDashboardPanel() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/security/dashboard")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load security dashboard");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading security dashboard…</p>;

  const s = data.summary;
  const metrics = [
    { label: "Failed logins (24h)", value: s.failedLogins24h },
    { label: "Locked accounts", value: s.lockedAccounts },
    { label: "Unauthorized attempts (24h)", value: s.unauthorizedAttempts24h },
    { label: "Cross-tenant attempts (24h)", value: s.crossTenantAttempts24h },
    { label: "High-severity open events", value: s.highSeverityOpenEvents },
    { label: "Open incidents", value: s.openIncidents },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        <p className="text-xs text-[var(--stone)]">Environment</p>
        <p className="font-semibold text-[var(--navy)]">{data.environment}</p>
        {!data.productionValidation.ok && data.environment === "production" && (
          <ul className="mt-2 text-sm text-red-600 list-disc pl-4">
            {data.productionValidation.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="text-xs text-[var(--stone)]">{m.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--navy)]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        <h3 className="font-semibold text-[var(--navy)]">Recent security events</h3>
        <ul className="mt-3 divide-y divide-[var(--line)]">
          {s.recentEvents.length === 0 ? (
            <li className="py-2 text-sm text-[var(--stone)]">No events recorded yet.</li>
          ) : (
            s.recentEvents.map((e) => (
              <li key={e.id} className="py-2 text-sm flex justify-between gap-4">
                <span>
                  <span className="font-medium">{e.eventType}</span>
                  <span className="text-[var(--stone)]"> — {e.severity}</span>
                </span>
                <span className="text-[var(--stone)] shrink-0">{e.createdAt}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
