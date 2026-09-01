"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { UploadFolder } from "@/models/StoredUpload";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

type Toast = { type: "success" | "error"; message: string } | null;

export function UploadedImageField({
  label,
  value,
  onChange,
  folder = "misc",
  helpText,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  helpText?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  async function removeStoredUrl(url: string) {
    if (!url.startsWith("/api/uploads/")) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // Best-effort cleanup when replacing/removing.
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);
    setToast(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        showToast("error", data.error || "Upload failed.");
        return;
      }

      if (value.startsWith("/api/uploads/") && value !== data.url) {
        await removeStoredUrl(value);
      }

      onChange(data.url);
      showToast("success", "Image uploaded.");
    } catch {
      showToast("error", "Upload failed. Check your connection.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value.startsWith("/api/uploads/")) {
      await removeStoredUrl(value);
    }
    onChange("");
    showToast("success", "Image removed.");
  }

  const previewSrc = value ? resolveImageSrc(value) : "";

  return (
    <div className="label lg:col-span-2">
      <span>{label}</span>
      {helpText ? <p className="mt-1 text-xs text-[var(--stone)]">{helpText}</p> : null}

      {previewSrc ? (
        <div className="mt-2 flex flex-wrap items-start gap-4">
          <div className="relative h-24 w-36 overflow-hidden rounded border border-[var(--line)] bg-[var(--cream)]">
            <Image
              src={previewSrc}
              alt=""
              fill
              className="object-cover"
              sizes="144px"
              unoptimized={previewSrc.startsWith("/api/uploads/")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn btn-secondary text-sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              className="text-sm text-red-700 underline"
              disabled={uploading}
              onClick={handleRemove}
            >
              Remove
            </button>
            <p className="max-w-xs break-all font-mono text-[0.65rem] text-[var(--stone)]">{value}</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="mt-2 inline-flex items-center justify-center rounded border border-dashed border-[var(--line)] px-4 py-8 text-sm text-[var(--stone)] hover:border-[var(--ocean)] hover:text-[var(--navy)]"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose image (PNG, JPEG, WebP, GIF — max 8MB)"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      {toast ? (
        <p
          className={`mt-2 text-sm ${toast.type === "success" ? "text-[var(--forest)]" : "text-red-700"}`}
          role="status"
        >
          {toast.message}
        </p>
      ) : null}
    </div>
  );
}
