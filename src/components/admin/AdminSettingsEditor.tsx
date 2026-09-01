"use client";

import { useState } from "react";
import type { AdminSiteSettings } from "@/lib/admin/site-settings-serializer";

export function AdminSettingsEditor({ initialSettings }: { initialSettings: AdminSiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = (await res.json()) as { settings?: AdminSiteSettings; error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save settings.");
      return;
    }

    if (data.settings) setSettings(data.settings);
    setMessage("Settings saved.");
  }

  return (
    <form onSubmit={save} className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2">
      <h2 className="lg:col-span-2 font-semibold text-[var(--navy)]">Company contact</h2>

      <label className="label">
        Company name
        <input
          className="field mt-1"
          value={settings.companyName}
          onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
          required
        />
      </label>

      <label className="label">
        Email
        <input
          className="field mt-1"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          required
        />
      </label>

      <label className="label">
        Phone
        <input
          className="field mt-1"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
        />
      </label>

      <label className="label flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          checked={settings.addressVisible}
          onChange={(e) => setSettings({ ...settings, addressVisible: e.target.checked })}
        />
        Show address on public site
      </label>

      <label className="label lg:col-span-2">
        Address line 1
        <input
          className="field mt-1"
          value={settings.addressLine1}
          onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
        />
      </label>

      <label className="label">
        City
        <input
          className="field mt-1"
          value={settings.addressCity}
          onChange={(e) => setSettings({ ...settings, addressCity: e.target.value })}
        />
      </label>

      <label className="label">
        Country code
        <input
          className="field mt-1"
          value={settings.addressCountry}
          onChange={(e) => setSettings({ ...settings, addressCountry: e.target.value.toUpperCase() })}
          placeholder="CA"
        />
      </label>

      <h2 className="lg:col-span-2 pt-2 font-semibold text-[var(--navy)]">Social media</h2>
      <p className="lg:col-span-2 text-sm text-[var(--stone)]">
        Full URLs to your official profiles. Leave blank to hide a network on the public site.
      </p>

      {(
        [
          ["linkedinUrl", "LinkedIn"],
          ["facebookUrl", "Facebook"],
          ["instagramUrl", "Instagram"],
          ["youtubeUrl", "YouTube"],
          ["xUrl", "X (Twitter)"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="label">
          {label}
          <input
            className="field mt-1"
            type="url"
            value={settings[key]}
            onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            placeholder={`https://${label.toLowerCase().replace(/[^a-z]/g, "")}.com/...`}
          />
        </label>
      ))}

      <h2 className="lg:col-span-2 pt-2 font-semibold text-[var(--navy)]">SEO defaults</h2>

      <label className="label lg:col-span-2">
        SEO title
        <input
          className="field mt-1"
          value={settings.seoTitle}
          onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
        />
      </label>

      <label className="label lg:col-span-2">
        SEO description
        <textarea
          className="field mt-1 min-h-24"
          value={settings.seoDescription}
          onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
        />
      </label>

      <h2 className="lg:col-span-2 pt-2 font-semibold text-[var(--navy)]">Feature flags</h2>

      <label className="label flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.aiAssistantEnabled}
          onChange={(e) => setSettings({ ...settings, aiAssistantEnabled: e.target.checked })}
        />
        AI assistant enabled
      </label>

      <label className="label flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.supplierPortal}
          onChange={(e) => setSettings({ ...settings, supplierPortal: e.target.checked })}
        />
        Supplier portal
      </label>

      <label className="label flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.bankingPortal}
          onChange={(e) => setSettings({ ...settings, bankingPortal: e.target.checked })}
        />
        Banking portal
      </label>

      <label className="label flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.financeModule}
          onChange={(e) => setSettings({ ...settings, financeModule: e.target.checked })}
        />
        Finance module
      </label>

      <label className="label">
        Locales
        <input
          className="field mt-1"
          value={settings.locales}
          onChange={(e) => setSettings({ ...settings, locales: e.target.value })}
          placeholder="en"
        />
      </label>

      <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </form>
  );
}
