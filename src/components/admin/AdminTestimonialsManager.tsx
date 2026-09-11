"use client";

import { useState } from "react";
import type { AdminTestimonialItem } from "@/lib/admin/testimonial-serializer";
import { UploadedImageField } from "@/components/admin/UploadedImageField";

type FormState = {
  quote: string;
  name: string;
  position: string;
  company: string;
  photo: string;
  rating: number;
  reviewedAt: string;
  status: "published" | "unpublished";
};

const emptyForm = (): FormState => ({
  quote: "",
  name: "",
  position: "",
  company: "",
  photo: "",
  rating: 5,
  reviewedAt: "",
  status: "published",
});

function itemToForm(item: AdminTestimonialItem): FormState {
  return {
    quote: item.quote,
    name: item.name,
    position: item.position,
    company: item.company,
    photo: item.photo,
    rating: item.rating,
    reviewedAt: item.reviewedAt ?? "",
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
      name: form.name.trim(),
      position: form.position.trim(),
      company: form.company.trim(),
      photo: form.photo.trim(),
      rating: form.rating,
      reviewedAt: form.reviewedAt.trim() || undefined,
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
    if (!window.confirm(`Delete testimonial from ${item.name}?`)) return;
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
          Review / quote
          <textarea
            className="field mt-1 min-h-28"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="What did the client say about their experience?"
            required
          />
        </label>

        <label className="label">
          Person&apos;s name
          <input
            className="field mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="James Whitfield"
            required
          />
        </label>

        <label className="label">
          Position / title
          <input
            className="field mt-1"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
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
          Star rating
          <select
            className="field mt-1"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          Review date
          <input
            type="date"
            className="field mt-1"
            value={form.reviewedAt}
            onChange={(e) => setForm({ ...form, reviewedAt: e.target.value })}
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

        <div className="lg:col-span-2">
          <UploadedImageField
            label="Client photo"
            folder="gallery"
            value={form.photo}
            onChange={(photo) => setForm({ ...form, photo })}
            helpText="Optional portrait photo. If empty, initials are shown on the public site."
          />
        </div>

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
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Quote</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--navy)]">{item.name}</p>
                  <p className="text-xs text-[var(--stone)]">
                    {item.position}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-3 text-[var(--navy)]">{item.quote}</p>
                </td>
                <td className="px-4 py-3">{item.rating}/5</td>
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
