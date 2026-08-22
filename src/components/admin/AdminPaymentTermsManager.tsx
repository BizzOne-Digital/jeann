"use client";

import { useState } from "react";
import type { PaymentTermOption } from "@/lib/payment-terms/config";

type Config = {
  enabledIds: string[];
  preferredId: string | null;
};

export function AdminPaymentTermsManager({
  initialConfig,
  initialTerms,
}: {
  initialConfig: Config;
  initialTerms: PaymentTermOption[];
}) {
  const [config, setConfig] = useState(initialConfig);
  const [terms, setTerms] = useState(initialTerms);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleEnabled(id: string) {
    setTerms((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    setConfig((current) => {
      const enabled = new Set(current.enabledIds);
      if (enabled.has(id)) enabled.delete(id);
      else enabled.add(id);
      const enabledIds = Array.from(enabled);
      return {
        enabledIds,
        preferredId:
          current.preferredId && enabled.has(current.preferredId)
            ? current.preferredId
            : enabledIds[0] ?? null,
      };
    });
  }

  function setPreferred(id: string) {
    setConfig((current) => ({ ...current, preferredId: id }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    const enabledIds = terms.filter((item) => item.enabled).map((item) => item.id);
    const res = await fetch("/api/admin/payment-terms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabledIds,
        preferredId: config.preferredId,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      config?: Config;
      terms?: PaymentTermOption[];
    };
    setSaving(false);
    if (!res.ok || !data.config || !data.terms) {
      setError(data.error || "Unable to save payment terms.");
      return;
    }
    setConfig(data.config);
    setTerms(data.terms);
    setMessage("Payment terms updated. Buyers will only see enabled structures.");
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--stone)]">
        All payment structures are catalogued below. Enable only those suitable for current
        programmes — buyers can select from enabled terms when submitting edible oil orders.
      </p>

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/80 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Enabled</th>
              <th className="px-4 py-3">Structure</th>
              <th className="px-4 py-3">ICC code</th>
              <th className="px-4 py-3">Function</th>
              <th className="px-4 py-3">Preferred</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleEnabled(item.id)}
                    aria-label={`Enable ${item.structure}`}
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--navy)]">
                  {item.structure}
                  {item.recommended ? (
                    <span className="ml-2 text-xs font-normal text-[#c88e4a]">Top ranked</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[var(--stone)]">{item.iccCode}</td>
                <td className="px-4 py-3 text-[var(--stone)]">{item.primaryFunction}</td>
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    name="preferred-payment-term"
                    checked={config.preferredId === item.id}
                    disabled={!item.enabled}
                    onChange={() => setPreferred(item.id)}
                    aria-label={`Set ${item.structure} as preferred`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
        {saving ? "Saving…" : "Save payment terms"}
      </button>
    </div>
  );
}
