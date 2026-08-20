"use client";

import { useState } from "react";
import type { AdminCategoryOption, AdminProductItem } from "@/lib/admin/product-serializer";

type FormState = {
  slug: string;
  name: string;
  categoryId: string;
  overview: string;
  status: AdminProductItem["status"];
  availabilityText: string;
  originOptions: string;
  gradeSummary: string;
  inspectionOptions: string;
  incotermOptions: string;
  minOrderText: string;
  image: string;
  displayOrder: number;
};

const emptyForm = (categoryId: string): FormState => ({
  slug: "",
  name: "",
  categoryId,
  overview: "",
  status: "draft",
  availabilityText: "",
  originOptions: "",
  gradeSummary: "",
  inspectionOptions: "",
  incotermOptions: "",
  minOrderText: "",
  image: "",
  displayOrder: 0,
});

function itemToForm(item: AdminProductItem): FormState {
  return {
    slug: item.slug,
    name: item.name,
    categoryId: item.categoryId,
    overview: item.overview,
    status: item.status,
    availabilityText: item.availabilityText,
    originOptions: item.originOptions.join("\n"),
    gradeSummary: item.gradeSummary,
    inspectionOptions: item.inspectionOptions.join("\n"),
    incotermOptions: item.incotermOptions.join("\n"),
    minOrderText: item.minOrderText,
    image: item.image,
    displayOrder: item.displayOrder,
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminProductsManager({
  initialProducts,
  initialCategories,
}: {
  initialProducts: AdminProductItem[];
  initialCategories: AdminCategoryOption[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(
    emptyForm(initialCategories[0]?._id ?? ""),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() {
    const res = await fetch("/api/admin/products");
    if (!res.ok) return;
    const data = (await res.json()) as { products: AdminProductItem[] };
    setProducts(data.products);
  }

  function startAdd() {
    setEditingSlug(null);
    setForm(emptyForm(categories[0]?._id ?? ""));
    setMessage(null);
    setError(null);
  }

  function startEdit(item: AdminProductItem) {
    setEditingSlug(item.slug);
    setForm(itemToForm(item));
    setMessage(null);
    setError(null);
  }

  function buildPayload(current: FormState) {
    return {
      slug: current.slug.trim().toLowerCase(),
      name: current.name.trim(),
      categoryId: current.categoryId,
      overview: current.overview.trim(),
      status: current.status,
      availabilityText: current.availabilityText.trim(),
      originOptions: splitLines(current.originOptions),
      gradeSummary: current.gradeSummary.trim(),
      inspectionOptions: splitLines(current.inspectionOptions),
      incotermOptions: splitLines(current.incotermOptions),
      minOrderText: current.minOrderText.trim(),
      image: current.image.trim(),
      displayOrder: current.displayOrder,
    };
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const payload = buildPayload(form);
    const isEdit = Boolean(editingSlug);
    const res = await fetch(
      isEdit ? `/api/admin/products/${encodeURIComponent(editingSlug!)}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Unable to save product.");
      return;
    }

    setMessage(isEdit ? "Product updated." : "Product added.");
    setEditingSlug(null);
    setForm(emptyForm(categories[0]?._id ?? ""));
    await reload();
  }

  async function remove(item: AdminProductItem) {
    if (!window.confirm(`Delete "${item.name}"? This archives the product.`)) return;
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/products/${encodeURIComponent(item.slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Unable to delete product.");
      return;
    }
    if (editingSlug === item.slug) startAdd();
    setMessage(`"${item.name}" deleted.`);
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
            {editingSlug ? `Edit product: ${editingSlug}` : "Add new product"}
          </h2>
          {editingSlug ? (
            <button type="button" className="text-sm text-[var(--ocean)] underline" onClick={startAdd}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <label className="label">
          Category
          <select
            className="field mt-1"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
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
            <option value="draft">Draft</option>
            <option value="pending_verification">Pending verification</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="label">
          Slug
          <input
            className="field mt-1"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            disabled={Boolean(editingSlug)}
            placeholder="sunflower-oil"
          />
        </label>

        <label className="label">
          Name
          <input
            className="field mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="label lg:col-span-2">
          Overview
          <textarea
            className="field mt-1 min-h-24"
            value={form.overview}
            onChange={(e) => setForm({ ...form, overview: e.target.value })}
          />
        </label>

        <label className="label">
          Availability text
          <input
            className="field mt-1"
            value={form.availabilityText}
            onChange={(e) => setForm({ ...form, availabilityText: e.target.value })}
          />
        </label>

        <label className="label">
          Minimum order text
          <input
            className="field mt-1"
            value={form.minOrderText}
            onChange={(e) => setForm({ ...form, minOrderText: e.target.value })}
          />
        </label>

        <label className="label lg:col-span-2">
          Grade summary
          <textarea
            className="field mt-1 min-h-20"
            value={form.gradeSummary}
            onChange={(e) => setForm({ ...form, gradeSummary: e.target.value })}
          />
        </label>

        <label className="label">
          Origin options (one per line)
          <textarea
            className="field mt-1 min-h-20"
            value={form.originOptions}
            onChange={(e) => setForm({ ...form, originOptions: e.target.value })}
          />
        </label>

        <label className="label">
          Inspection options (one per line)
          <textarea
            className="field mt-1 min-h-20"
            value={form.inspectionOptions}
            onChange={(e) => setForm({ ...form, inspectionOptions: e.target.value })}
          />
        </label>

        <label className="label">
          Incoterms (one per line)
          <textarea
            className="field mt-1 min-h-20"
            value={form.incotermOptions}
            onChange={(e) => setForm({ ...form, incotermOptions: e.target.value })}
          />
        </label>

        <label className="label">
          Image path
          <input
            className="field mt-1"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="/images/products/example.jpg"
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

        <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editingSlug ? "Save changes" : "Add product"}
          </button>
          {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </form>

      <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--navy)]">{item.name}</p>
                  {item.overview ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--stone)]">{item.overview}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">{item.categoryName}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--ocean)]">{item.slug}</td>
                <td className="px-4 py-3 capitalize">{item.status.replace(/_/g, " ")}</td>
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
        {products.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--stone)]">
            No products yet. Add one above or run <code>npm run seed</code>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
