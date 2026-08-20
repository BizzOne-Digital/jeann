"use client";

import { useState } from "react";
import type { AdminTestimonialItem } from "@/lib/admin/testimonial-serializer";

type FormState = {
  quote: string;
  attribution: string;
  company: string;
  status: "published" | "unpublished";
};

const emptyForm = (): FormState => ({
  quote: "",
  attribution: "",
  company: "",
  status: "published",
});

function itemToForm(item: AdminTestimonialItem): FormState {
  return {
    quote: item.quote,
    attribution: item.attribution,
    company: item.company,
    status: item.status,
  };
}

export function AdminTestimonialsManager({
  initialItems,
}: {
  initialItems: AdminTestimonialItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/testimonials");
    if (!res.ok) return;
    const data = (await res.json()) as { items: AdminTestimonialItem[] };
    setItems(data.items);
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setMessage(null);
    setError(null);
  }

  function startEdit(item: AdminTestimonialItem) {
    setEditingId(item._id);
    setForm(itemToForm(item));
    setMessage(null);
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const payload = {
      quote: form.quote.trim(),
      attribution: form.attribution.trim(),
      company: form.company.trim(),
      status: form.status,
    };

    const res = await fetch(
      editingId
        ? `/api/admin/testimonials/${encodeURIComponent(editingId)}`
        : "/api/admin/testimonials",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save testimonial.");
      return;
    }

    setMessage(editingId ? "Testimonial updated." : "Testimonial added.");
    setEditingId(null);
    setForm(emptyForm());
    await reload();
  }

  async function remove(item: AdminTestimonialItem) {
    if (!window.confirm(`Delete testimonial from ${item.attribution}?`)) return;
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/testimonials/${encodeURIComponent(item._id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Unable to delete testimonial.");
      return;
    }
    if (editingId === item._id) startAdd();
    setMessage("Testimonial deleted.");
    await reload();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={save}
        className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2"
      >
        <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--navy)]">
            {editingId ? "Edit testimonial" : "Add new testimonial"}
          </h2>
          {editingId ? (
            <button type="button" className="text-sm text-[var(--ocean)] underline" onClick={startAdd}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <label className="label lg:col-span-2">
          Quote
          <textarea
            className="field mt-1 min-h-28"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            required
          />
        </label>

        <label className="label">
          Attribution
          <input
            className="field mt-1"
            value={form.attribution}
            onChange={(e) => setForm({ ...form, attribution: e.target.value })}
            placeholder="Director of Procurement"
            required
          />
        </label>

        <label className="label">
          Company
          <input
            className="field mt-1"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="North Atlantic Foods Ltd"
          />
        </label>

        <label className="label">
          Status
          <select
            className="field mt-1"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as FormState["status"] })
            }
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </label>

        <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Save changes" : "Add testimonial"}
          </button>
          {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Quote</th>
              <th className="px-4 py-3 font-semibold">Attribution</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <p className="line-clamp-3 text-[var(--navy)]">{item.quote}</p>
                </td>
                <td className="px-4 py-3">{item.attribution}</td>
                <td className="px-4 py-3">{item.company || "—"}</td>
                <td className="px-4 py-3 capitalize">{item.status}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    className="mr-4 text-sm font-semibold text-[var(--navy)] underline"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-700 underline"
                    onClick={() => remove(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--stone)]">
            No testimonials yet. Add one above or run <code>npm run seed</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
