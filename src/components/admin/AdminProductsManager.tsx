"use client";

import { useState } from "react";
import type { AdminCategoryOption, AdminProductItem } from "@/lib/admin/product-serializer";
import { UploadedImageField } from "@/components/admin/UploadedImageField";

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
  internalPrice: string;
  image: string;
  galleryImages: string[];
  description: string;
  highlights: string;
  youtubeVideo: string;
  packagingOptionIds: string[];
  /** Sections at the bottom of the product page, as shown now (built-in text until the admin changes it). */
  contentBoxes: { title: string; body: string }[];
  /** The built-in sections, used to tell whether the admin changed anything. */
  builtInContentBoxes: { title: string; body: string }[];
  specification: string;
  requiredDocuments: string;
  code: string;
  hsCode: string;
  displayOrder: number;
};

function sameBoxes(a: { title: string; body: string }[], b: { title: string; body: string }[]) {
  return a.length === b.length && a.every((x, i) => x.title.trim() === b[i].title.trim() && x.body.trim() === b[i].body.trim());
}

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
  internalPrice: "",
  image: "",
  galleryImages: [],
  description: "",
  highlights: "",
  youtubeVideo: "",
  packagingOptionIds: [],
  contentBoxes: [],
  builtInContentBoxes: [],
  specification: "",
  requiredDocuments: "",
  code: "",
  hsCode: "",
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
    internalPrice: item.internalPrice,
    image: item.image,
    galleryImages: item.galleryImages,
    description: item.description,
    highlights: item.highlights.join("\n"),
    youtubeVideo: item.youtubeVideoId,
    packagingOptionIds: item.packagingOptionIds,
    contentBoxes: item.contentBoxes.length ? item.contentBoxes : item.builtInContentBoxes,
    builtInContentBoxes: item.builtInContentBoxes,
    specification: "",
    requiredDocuments: "",
    code: item.code,
    hsCode: item.hsCode,
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
  packagingTypes = [],
}: {
  initialProducts: AdminProductItem[];
  initialCategories: AdminCategoryOption[];
  packagingTypes?: { _id: string; name: string }[];
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
    // The specification is stored separately; load the current one for editing.
    fetch("/api/admin/products/" + encodeURIComponent(item.slug), { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { product?: { specification?: string; requiredDocuments?: string[] } } | null) => {
        if (d?.product) {
          setForm((f) =>
            f.slug === item.slug
              ? { ...f, specification: d.product?.specification ?? "", requiredDocuments: (d.product?.requiredDocuments ?? []).join("\n") }
              : f,
          );
        }
      })
      .catch(() => undefined);
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
      internalPrice: current.internalPrice.trim(),
      image: current.image.trim(),
      galleryImages: current.galleryImages.map((s) => s.trim()).filter(Boolean),
      description: current.description.trim(),
      highlights: splitLines(current.highlights),
      youtubeVideo: current.youtubeVideo.trim(),
      packagingOptionIds: current.packagingOptionIds,
      // Unchanged built-in text is not saved, so the page keeps following the built-in content.
      contentBoxes: (() => {
        const boxes = current.contentBoxes
          .map((b) => ({ title: b.title.trim(), body: b.body.trim() }))
          .filter((b) => b.title || b.body);
        return sameBoxes(boxes, current.builtInContentBoxes) ? [] : boxes;
      })(),
      specification: current.specification,
      requiredDocuments: splitLines(current.requiredDocuments),
      code: current.code.trim().toUpperCase(),
      hsCode: current.hsCode.trim(),
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

    const data = (await res.json()) as { error?: string; issues?: { fieldErrors?: Record<string, string[]> } };
    setSaving(false);

    if (!res.ok) {
      const firstIssue = Object.values(data.issues?.fieldErrors ?? {})[0]?.[0];
      setError(data.error === "Invalid input" && firstIssue ? firstIssue : data.error || "Unable to save product.");
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
          Internal price (admin only — never shown on the website)
          <input
            className="field mt-1"
            value={form.internalPrice}
            onChange={(e) => setForm({ ...form, internalPrice: e.target.value })}
            placeholder="e.g. USD 920 / MT FOB"
          />
        </label>

        <label className="label">
          Product code (printed in the order number)
          <input
            className="field mt-1 uppercase"
            maxLength={8}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="e.g. RSO"
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            2 to 8 letters or numbers. Orders for this product are numbered like RSO-CIF-000123-26.
          </span>
        </label>

        <label className="label">
          HS code (printed in the SCO)
          <input
            className="field mt-1"
            maxLength={30}
            value={form.hsCode}
            onChange={(e) => setForm({ ...form, hsCode: e.target.value })}
            placeholder="e.g. 1514.19"
          />
        </label>

        <label className="label lg:col-span-2">
          Specification shown to buyers (one line per item, written as Label: value)
          <textarea
            className="field mt-1 min-h-32 font-mono text-sm"
            value={form.specification}
            onChange={(e) => setForm({ ...form, specification: e.target.value })}
            placeholder="Free Fatty Acid (FFA): Maximum 0.10%"
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            When a buyer chooses this product in the order form, this text fills in the product specification.
          </span>
        </label>

        <label className="label lg:col-span-2">
          Documents the bank requires for this product (one per line)
          <textarea
            className="field mt-1 min-h-24"
            value={form.requiredDocuments}
            onChange={(e) => setForm({ ...form, requiredDocuments: e.target.value })}
            placeholder="Certificate of Analysis (COA)"
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            These appear in the LC presentation section of every SCO for this product. Leave empty to use the standard list. For a CIF order the insurance document is always added.
          </span>
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

        <UploadedImageField
          label="Product image"
          folder="products"
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          helpText="Upload a product photo. Stored in MongoDB — works after Vercel deploy."
        />

        <div className="lg:col-span-2 space-y-3">
          <p className="label">More photos (shown in the product gallery, in this order)</p>
          {form.galleryImages.map((src, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1">
                <UploadedImageField
                  label={`Photo ${i + 2}`}
                  folder="products"
                  value={src}
                  onChange={(url) =>
                    setForm({ ...form, galleryImages: form.galleryImages.map((s, j) => (j === i ? url : s)) })
                  }
                />
              </div>
              <button
                type="button"
                className="pb-2 text-sm text-red-700 underline"
                onClick={() => setForm({ ...form, galleryImages: form.galleryImages.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
          {form.galleryImages.length < 11 ? (
            <button
              type="button"
              className="text-sm font-semibold text-[var(--navy)] underline"
              onClick={() => setForm({ ...form, galleryImages: [...form.galleryImages, ""] })}
            >
              Add another photo
            </button>
          ) : null}
        </div>

        <label className="label lg:col-span-2">
          Product description (shown on the product page)
          <textarea
            className="field mt-1 min-h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            Leave empty to keep the built-in description.
          </span>
        </label>

        <label className="label lg:col-span-2">
          Highlights (one per line, shown as bullet points)
          <textarea
            className="field mt-1 min-h-24"
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            Up to 12 lines. Leave empty to keep the built-in highlights.
          </span>
        </label>

        <label className="label lg:col-span-2">
          YouTube video (link or video ID)
          <input
            className="field mt-1"
            value={form.youtubeVideo}
            onChange={(e) => setForm({ ...form, youtubeVideo: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
            Leave empty to keep the built-in video.
          </span>
        </label>

        <div className="lg:col-span-2 space-y-3">
          <p className="label">Sections at the bottom of the product page</p>
          <p className="text-xs font-normal text-[var(--stone)]">
            This is the text shown on the product page now. Edit it here to change it. Each section needs a title and text. Use Reset to go back to the built-in text.
          </p>
          {form.contentBoxes.map((box, i) => (
            <div key={i} className="space-y-2 rounded-md border border-[var(--line)] p-3">
              <input
                className="field"
                value={box.title}
                placeholder={`Section ${i + 1} title`}
                maxLength={200}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contentBoxes: form.contentBoxes.map((b, j) => (j === i ? { ...b, title: e.target.value } : b)),
                  })
                }
              />
              <textarea
                className="field min-h-24"
                value={box.body}
                placeholder="Section text"
                maxLength={3000}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contentBoxes: form.contentBoxes.map((b, j) => (j === i ? { ...b, body: e.target.value } : b)),
                  })
                }
              />
              <button
                type="button"
                className="text-sm text-red-700 underline"
                onClick={() => setForm({ ...form, contentBoxes: form.contentBoxes.filter((_, j) => j !== i) })}
              >
                Remove section
              </button>
            </div>
          ))}
          <div className="flex flex-wrap gap-4">
            {form.contentBoxes.length < 12 ? (
              <button
                type="button"
                className="text-sm font-semibold text-[var(--navy)] underline"
                onClick={() => setForm({ ...form, contentBoxes: [...form.contentBoxes, { title: "", body: "" }] })}
              >
                Add section
              </button>
            ) : null}
            {form.builtInContentBoxes.length ? (
              <button
                type="button"
                className="text-sm text-[var(--ocean)] underline"
                onClick={() => setForm({ ...form, contentBoxes: form.builtInContentBoxes })}
              >
                Reset to built-in text
              </button>
            ) : null}
          </div>
        </div>

        {packagingTypes.length ? (
          <fieldset className="label lg:col-span-2">
            <legend>Packaging offered for this product</legend>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {packagingTypes.map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-sm font-normal">
                  <input
                    type="checkbox"
                    checked={form.packagingOptionIds.includes(p._id)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        packagingOptionIds: e.target.checked
                          ? [...form.packagingOptionIds, p._id]
                          : form.packagingOptionIds.filter((id) => id !== p._id),
                      })
                    }
                  />
                  {p.name}
                </label>
              ))}
            </div>
            <span className="mt-1 block text-xs font-normal text-[var(--stone)]">
              Shown on the product page and used in the packaging line of generated documents. Leave all unticked to keep the built-in packaging.
            </span>
          </fieldset>
        ) : null}

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
              <th className="px-4 py-3 font-semibold">Internal price</th>
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
                <td className="px-4 py-3">{item.internalPrice || "—"}</td>
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
