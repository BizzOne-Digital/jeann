"use client";

import Link from "next/link";
import { useState } from "react";
import type { EditablePage } from "@/lib/content/page-registry";
import { UploadedImageField } from "@/components/admin/UploadedImageField";

export function AdminPageEditor({ initialPage }: { initialPage: EditablePage }) {
  const [page, setPage] = useState(initialPage);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField(sectionId: string, key: string, value: string) {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              defaults: { ...section.defaults, [key]: value },
            }
          : section,
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          status: page.status,
          sections: page.sections.map((section) => ({
            id: section.id,
            fields: section.defaults,
          })),
        }),
      });
      const data = (await res.json()) as { page?: EditablePage; error?: string };
      if (!res.ok) {
        setError(data.error || "Unable to save page.");
        return;
      }
      if (data.page) setPage(data.page);
      setMessage("Page saved.");
    } catch {
      setError("Unable to save page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {page.status !== "published" ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Set status to <strong>Published</strong> and save — draft pages are not shown on the live site.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/pages" className="text-sm font-semibold text-[var(--ocean)] underline">
          ← All pages
        </Link>
        <a
          href={page.path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--stone)] underline"
        >
          View live page
        </a>
      </div>

      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2">
        <label className="label">
          Page title
          <input
            className="field mt-1"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
          />
        </label>
        <label className="label">
          Status
          <select
            className="field mt-1"
            value={page.status}
            onChange={(e) =>
              setPage({
                ...page,
                status: e.target.value as EditablePage["status"],
              })
            }
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="label lg:col-span-2">
          SEO title
          <input
            className="field mt-1"
            value={page.seoTitle}
            onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
          />
        </label>
        <label className="label lg:col-span-2">
          SEO description
          <textarea
            className="field mt-1 min-h-20"
            value={page.seoDescription}
            onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
          />
        </label>
      </div>

      <div className="space-y-4">
        {page.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-[var(--line)] bg-white p-5"
          >
            <h2 className="text-lg font-semibold text-[var(--navy)]">{section.label}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--stone)]">
              Section ID: {section.id}
            </p>
            <div className="mt-4 grid gap-4">
              {section.fields.map((field) =>
                field.type === "image" ? (
                  <UploadedImageField
                    key={field.key}
                    label={field.label}
                    folder="pages"
                    value={section.defaults[field.key] ?? ""}
                    onChange={(url) => updateField(section.id, field.key, url)}
                  />
                ) : (
                  <label key={field.key} className="label">
                    {field.label}
                    {field.type === "textarea" ? (
                      <textarea
                        className="field mt-1 min-h-24"
                        value={section.defaults[field.key] ?? ""}
                        onChange={(e) => updateField(section.id, field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        className="field mt-1"
                        type={field.type === "url" ? "url" : "text"}
                        value={section.defaults[field.key] ?? ""}
                        onChange={(e) => updateField(section.id, field.key, e.target.value)}
                      />
                    )}
                  </label>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save page"}
        </button>
        {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
