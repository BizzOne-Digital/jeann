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
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/email-test", { credentials: "same-origin" })
      .then(async (res) => {
        const json = (await res.json()) as {
          provider?: string;
          deliveryConfigured?: boolean;
          missing?: string[];
          smtpHost?: string | null;
          smtpUser?: string | null;
          login?: string;
          error?: string;
        };
        if (!res.ok) {
          setEmailStatus(json.error ?? "Could not read the email settings.");
          return;
        }
        const parts = [`Provider: ${json.provider}`];
        if (json.smtpHost) parts.push(`Host: ${json.smtpHost}`);
        if (json.smtpUser) parts.push(`User: ${json.smtpUser}`);
        if (json.missing?.length) parts.push(`Missing settings: ${json.missing.join(", ")}`);
        if (json.provider !== "smtp") parts.push("EMAIL_PROVIDER must be smtp for real emails.");
        if (json.login) parts.push(`SMTP login: ${json.login}`);
        parts.push(json.deliveryConfigured ? "Delivery is configured." : "Delivery is NOT configured on this server.");
        setEmailStatus(parts.join(" · "));
      })
      .catch(() => setEmailStatus("Could not read the email settings."));
  }, []);

  async function sendTestEmail() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/email-test", { method: "POST", credentials: "same-origin" });
      const json = (await res.json()) as { ok?: boolean; to?: string; note?: string; error?: string };
      setTestResult(
        res.ok ? (json.note ?? `Test email sent to ${json.to}. Check the inbox and spam folder.`) : (json.error ?? "Email test failed."),
      );
    } catch {
      setTestResult("Email test failed.");
    } finally {
      setTesting(false);
    }
  }

  useEffect(() => {
    fetch("/api/integrations/health")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load integrations");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  const emailCard = (
    <div className="rounded-lg border border-[var(--line)] bg-white p-4">
      <h3 className="font-semibold text-[var(--navy)]">Email delivery</h3>
      <p className="mt-1 text-sm text-[var(--stone)]">
        Sends a test message to your own admin email to confirm verification codes and notifications will arrive.
      </p>
      <button type="button" className="btn btn-secondary mt-3 text-sm" disabled={testing} onClick={sendTestEmail}>
        {testing ? "Sending…" : "Send test email"}
      </button>
      {emailStatus ? <p className="mt-3 break-words text-xs text-[var(--stone)]">{emailStatus}</p> : null}
      {testResult ? <p className="mt-2 text-sm text-[var(--ink)]">{testResult}</p> : null}
    </div>
  );

  if (error)
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-600">{error}</p>
        {emailCard}
      </div>
    );
  if (!data)
    return (
      <div className="space-y-6">
        <p className="text-sm text-[var(--stone)]">Loading integration health…</p>
        {emailCard}
      </div>
    );

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
      {emailCard}
      <p className="text-xs text-[var(--stone)]">{data.disclaimer}</p>
    </div>
  );
}
