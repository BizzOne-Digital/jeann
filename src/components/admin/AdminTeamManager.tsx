"use client";

import { useState } from "react";
import type { AdminTeamFieldDefinition, AdminTeamItem } from "@/lib/admin/team-serializer";
import { UploadedImageField } from "@/components/admin/UploadedImageField";

type FormState = {
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo: string;
  customFields: Record<string, string>;
  displayOrder: number;
  status: "published" | "unpublished";
};

const emptyForm = (displayOrder: number, fieldDefs: AdminTeamFieldDefinition[]): FormState => ({
  name: "",
  roleTitle: "",
  department: "",
  tier: "board",
  bio: "",
  photo: "",
  customFields: Object.fromEntries(fieldDefs.map((f) => [f.key, ""])),
  displayOrder,
  status: "published",
});

function itemToForm(item: AdminTeamItem, fieldDefs: AdminTeamFieldDefinition[]): FormState {
  const customFields = Object.fromEntries(
    fieldDefs.map((f) => [f.key, item.customFields[f.key] ?? ""]),
  );
  return {
    name: item.name,
    roleTitle: item.roleTitle,
    department: item.department,
    tier: item.tier,
    bio: item.bio,
    photo: item.photo,
    customFields,
    displayOrder: item.displayOrder,
    status: item.status,
  };
}

export function AdminTeamManager({
  initialItems,
  initialFields,
}: {
  initialItems: AdminTeamItem[];
  initialFields: AdminTeamFieldDefinition[];
}) {
  const [items, setItems] = useState(initialItems);
  const [fieldDefs, setFieldDefs] = useState(initialFields);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(initialItems.length, initialFields));
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/team");
    if (!res.ok) return;
    const data = (await res.json()) as { items: AdminTeamItem[]; fields: AdminTeamFieldDefinition[] };
    setItems(data.items);
    setFieldDefs(data.fields);
    if (!editingId) {
      setForm(emptyForm(data.items.length, data.fields));
    }
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm(items.length, fieldDefs));
    setMessage(null);
    setError(null);
  }

  function startEdit(item: AdminTeamItem) {
    setEditingId(item._id);
    setForm(itemToForm(item, fieldDefs));
    setMessage(null);
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch(
      editingId ? `/api/admin/team/${encodeURIComponent(editingId)}` : "/api/admin/team",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save team member.");
      return;
    }

    setMessage(editingId ? "Team member updated." : "Team member added.");
    setEditingId(null);
    setForm(emptyForm(items.length + 1, fieldDefs));
    await reload();
  }

  async function remove(item: AdminTeamItem) {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    const res = await fetch(`/api/admin/team/${encodeURIComponent(item._id)}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Unable to delete team member.");
      return;
    }
    if (editingId === item._id) startAdd();
    setMessage("Team member deleted.");
    await reload();
  }

  async function addField(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/team/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newFieldLabel }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Unable to add field.");
      return;
    }
    setNewFieldLabel("");
    setMessage("Custom field added.");
    await reload();
  }

  async function removeField(key: string, label: string) {
    if (!window.confirm(`Remove the "${label}" column from all team profiles?`)) return;
    const res = await fetch(`/api/admin/team/fields?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Unable to delete field.");
      return;
    }
    setMessage("Custom field removed.");
    await reload();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h2 className="font-semibold text-[var(--navy)]">Custom columns</h2>
        <p className="mt-1 text-sm text-[var(--stone)]">
          Photo, name, title, and department are fixed. Add extra columns (for example LinkedIn or office
          location) — they appear on the public team page and in each member form.
        </p>
        <form onSubmit={addField} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="label min-w-[200px] flex-1">
            New field label
            <input
              className="field mt-1"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="e.g. LinkedIn"
              required
            />
          </label>
          <button type="submit" className="btn btn-secondary">Add field</button>
        </form>
        {fieldDefs.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {fieldDefs.map((field) => (
              <li
                key={field.key}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--cream)]/50 px-3 py-1 text-sm"
              >
                <span>{field.label}</span>
                <button
                  type="button"
                  className="text-red-700 underline"
                  onClick={() => removeField(field.key, field.label)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <form
        onSubmit={save}
        className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2"
      >
        <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--navy)]">
            {editingId ? "Edit team member" : "Add team member"}
          </h2>
          {editingId ? (
            <button type="button" className="text-sm text-[var(--ocean)] underline" onClick={startAdd}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <UploadedImageField
          label="Photo"
          folder="gallery"
          value={form.photo}
          onChange={(photo) => setForm({ ...form, photo })}
        />

        <label className="label">
          Name
          <input
            className="field mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="label">
          Title
          <input
            className="field mt-1"
            value={form.roleTitle}
            onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
            required
          />
        </label>

        <label className="label">
          Department
          <input
            className="field mt-1"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
        </label>

        <label className="label">
          Profile type
          <select
            className="field mt-1"
            value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value as FormState["tier"] })}
          >
            <option value="board">Leadership / board</option>
            <option value="staff">Operations / staff</option>
          </select>
        </label>

        {fieldDefs.map((field) => (
          <label key={field.key} className="label">
            {field.label}
            <input
              className="field mt-1"
              value={form.customFields[field.key] ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  customFields: { ...form.customFields, [field.key]: e.target.value },
                })
              }
            />
          </label>
        ))}

        <label className="label lg:col-span-2">
          Biography (optional)
          <textarea
            className="field mt-1 min-h-28"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
            {saving ? "Saving…" : editingId ? "Save changes" : "Add member"}
          </button>
          {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Photo</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border border-[var(--line)]"
                    />
                  ) : (
                    <span className="text-xs text-[var(--stone)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--navy)]">{item.name}</td>
                <td className="px-4 py-3">{item.roleTitle}</td>
                <td className="px-4 py-3">{item.department || "—"}</td>
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
            No team members yet. Add one above or run <code>npm run seed</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
