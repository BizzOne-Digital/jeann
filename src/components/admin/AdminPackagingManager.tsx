"use client";

import { useState } from "react";

type Item = {
  _id: string;
  slug: string;
  name: string;
  mode: "dry" | "liquid" | "unpackaged";
  description?: string;
  advantages?: string[];
  displayOrder: number;
  status: string;
};

export function AdminPackagingManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"dry" | "liquid" | "unpackaged">("dry");
  const [description, setDescription] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function reload() {
    const res = await fetch("/api/admin/packaging");
    if (res.ok) {
      const data = (await res.json()) as { items: Item[] };
      setItems(data.items);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/packaging", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name,
        mode,
        description,
        advantages: advantages.split("\n").map((s) => s.trim()).filter(Boolean),
        displayOrder: items.length,
        status: "active",
      }),
    });
    if (!res.ok) {
      setMessage("Unable to save packaging type.");
      return;
    }
    setMessage("Saved.");
    setSlug("");
    setName("");
    setDescription("");
    setAdvantages("");
    await reload();
  }

  async function deactivate(itemSlug: string) {
    await fetch(`/api/admin/packaging?slug=${encodeURIComponent(itemSlug)}`, { method: "DELETE" });
    await reload();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="grid max-w-xl gap-4 rounded-lg border border-[var(--line)] bg-white p-5">
        <h2 className="font-semibold text-[var(--navy)]">Add or update packaging type</h2>
        <label className="label">
          Slug
          <input className="field mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
        <label className="label">
          Name
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="label">
          Mode
          <select className="field mt-1" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="dry">Dry bulk</option>
            <option value="liquid">Liquid bulk</option>
            <option value="unpackaged">Unpackaged / vessel</option>
          </select>
        </label>
        <label className="label">
          Description
          <textarea className="field mt-1 min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="label">
          Advantages (one per line)
          <textarea className="field mt-1 min-h-24" value={advantages} onChange={(e) => setAdvantages(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary w-fit">
          Save packaging type
        </button>
        {message ? <p className="text-sm text-[var(--stone)]">{message}</p> : null}
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--cream)] text-xs uppercase text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 capitalize">{item.mode}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  {item.status === "active" ? (
                    <button
                      type="button"
                      className="text-xs text-red-700 underline"
                      onClick={() => deactivate(item.slug)}
                    >
                      Deactivate
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
