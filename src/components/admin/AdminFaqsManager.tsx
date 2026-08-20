"use client";

import { useState } from "react";
import type { AdminFaqItem } from "@/lib/admin/faq-serializer";

type FormState = {
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

const emptyForm = (displayOrder: number): FormState => ({
  question: "",
  answer: "",
  category: "General",
  displayOrder,
  status: "published",
});

function itemToForm(item: AdminFaqItem): FormState {
  return {
    question: item.question,
    answer: item.answer,
    category: item.category,
    displayOrder: item.displayOrder,
    status: item.status,
  };
}

export function AdminFaqsManager({ initialItems }: { initialItems: AdminFaqItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(initialItems.length));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/faqs");
    if (!res.ok) return;
    const data = (await res.json()) as { items: AdminFaqItem[] };
    setItems(data.items);
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm(items.length));
    setMessage(null);
    setError(null);
  }

  function startEdit(item: AdminFaqItem) {
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
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      displayOrder: form.displayOrder,
      status: form.status,
    };

    const res = await fetch(
      editingId ? `/api/admin/faqs/${encodeURIComponent(editingId)}` : "/api/admin/faqs",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save FAQ.");
      return;
    }

    setMessage(editingId ? "FAQ updated." : "FAQ added.");
    setEditingId(null);
    setForm(emptyForm(items.length + 1));
    await reload();
  }

  async function remove(item: AdminFaqItem) {
    if (!window.confirm(`Delete FAQ: "${item.question}"?`)) return;
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/faqs/${encodeURIComponent(item._id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Unable to delete FAQ.");
      return;
    }
    if (editingId === item._id) startAdd();
    setMessage("FAQ deleted.");
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
            {editingId ? "Edit FAQ" : "Add new FAQ"}
          </h2>
          {editingId ? (
            <button type="button" className="text-sm text-[var(--ocean)] underline" onClick={startAdd}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <label className="label lg:col-span-2">
          Question
          <input
            className="field mt-1"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </label>

        <label className="label lg:col-span-2">
          Answer
          <textarea
            className="field mt-1 min-h-32"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
        </label>

        <label className="label">
          Category
          <input
            className="field mt-1"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </label>

        <label className="label">
          Display order
          <input
            className="field mt-1"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: Number(e.target.value) || 0 })
            }
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
            {saving ? "Saving…" : editingId ? "Save changes" : "Add FAQ"}
          </button>
          {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Question</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--navy)]">{item.question}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--stone)]">{item.answer}</p>
                </td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.displayOrder}</td>
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
            No FAQs yet. Add one above or run <code>npm run seed</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
