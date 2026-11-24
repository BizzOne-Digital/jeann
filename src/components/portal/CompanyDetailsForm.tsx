"use client";

import { useEffect, useState } from "react";

type Field = { key: string; label: string; multiline?: boolean };

/** Company details entered once in the portal. They fill the red parts of every generated document. */
export function CompanyDetailsForm() {
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [companyName, setCompanyName] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/company-details", { credentials: "same-origin" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load company details.");
        setFields(data.fields ?? []);
        setValues(data.values ?? {});
        setCompanyName(data.companyName ?? "");
        setCanEdit(Boolean(data.canEdit));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load company details."))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const body: Record<string, string> = {};
    for (const f of fields) body[f.key] = (values[f.key] ?? "").trim();
    const res = await fetch("/api/portal/company-details", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to save.");
      return;
    }
    setMessage("Saved. These details now fill your documents automatically.");
  }

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading…</p>;
  if (error && !fields.length) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 rounded-lg border border-[var(--line)] bg-white p-5">
      <p className="text-sm text-[var(--stone)]">
        {companyName ? <strong className="text-[var(--navy)]">{companyName}</strong> : null}
        {companyName ? " — " : ""}
        Enter these once. Finekarts uses them to fill your documents automatically, so fewer parts are left blank (shown in red) for you to complete by hand.
      </p>
      {!canEdit ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Only your organization administrator can change these details.
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={"label" + (f.multiline ? " sm:col-span-2" : "")}>
            {f.label}
            {f.multiline ? (
              <textarea
                className="field mt-1 min-h-20"
                maxLength={400}
                disabled={!canEdit}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            ) : (
              <input
                className="field mt-1"
                maxLength={200}
                disabled={!canEdit}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      {canEdit ? (
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save company details"}
          </button>
          {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      ) : null}
    </form>
  );
}
