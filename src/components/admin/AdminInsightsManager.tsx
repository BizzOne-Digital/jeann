"use client";

import { FormEvent, useEffect, useState } from "react";

type InsightRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  authorName: string;
};

export function AdminInsightsManager() {
  const [items, setItems] = useState<InsightRow[]>([]);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("Finekarts Trade Desk");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/insights", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setItems(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/insights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ slug, title, excerpt, body, authorName, status, categories: ["Insights"] }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Unable to save");
      return;
    }
    setMessage("Insight saved.");
    setSlug("");
    setTitle("");
    setExcerpt("");
    setBody("");
    load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-6 lg:grid-cols-2">
        <label className="label">
          <span>Slug</span>
          <input className="field mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
        <label className="label">
          <span>Author</span>
          <input className="field mt-1" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
        </label>
        <label className="label lg:col-span-2">
          <span>Title</span>
          <input className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="label lg:col-span-2">
          <span>Excerpt</span>
          <textarea className="field mt-1 min-h-[80px]" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </label>
        <label className="label lg:col-span-2">
          <span>Body (paragraphs separated by blank lines)</span>
          <textarea className="field mt-1 min-h-[180px]" value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
        <label className="label">
          <span>Status</span>
          <select className="field mt-1" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn btn-primary">Save insight</button>
        </div>
      </form>

      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--cream)] text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)]">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.slug}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
