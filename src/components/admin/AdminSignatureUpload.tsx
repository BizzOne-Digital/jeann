"use client";

import { useEffect, useState } from "react";

/** Preload the Finekarts signature once. It prints on final (approved) documents, never on drafts. */
export function AdminSignatureUpload({ kind = "signature" }: { kind?: "signature" | "seal" }) {
  const isSeal = kind === "seal";
  const url = "/api/admin/signature?kind=" + kind;
  const [version, setVersion] = useState(0);
  const [hasSignature, setHasSignature] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { credentials: "same-origin" })
      .then((r) => {
        if (!cancelled) setHasSignature(r.ok);
      })
      .catch(() => {
        if (!cancelled) setHasSignature(false);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(url, { method: "POST", credentials: "same-origin", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setMsg((isSeal ? "Seal" : "Signature") + " saved. It prints on every final document from now on.");
      setVersion((v) => v + 1);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(isSeal ? "Remove the seal? Final documents will print without it." : "Remove the signature? Final documents will print a blank signature line.")) return;
    setBusy(true);
    await fetch(url, { method: "DELETE", credentials: "same-origin" });
    setMsg(isSeal ? "Seal removed." : "Signature removed.");
    setVersion((v) => v + 1);
    setBusy(false);
  }

  return (
    <section className="space-y-3 rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">{isSeal ? "Company seal" : "Authorized signature"}</h2>
      <p className="text-sm text-[var(--stone)]">
        {isSeal
          ? "Upload the Finekarts company seal once (a PNG or JPG). The white background is removed automatically and the colours are kept. It prints next to the signature on every final document. Drafts print without it. Only admin can see or change it."
          : "Upload the Finekarts authorized signature once (a PNG or JPG on a white background). The background is removed automatically. It is placed on the signature line of every final document: the SCO, the PSA, the LC wording, the Proforma Invoice, and the ICPO when Finekarts is the buyer. Drafts always print a blank line. Only admin can see or change it."}
      </p>
      {hasSignature ? (
        <div className="inline-block rounded border border-[var(--line)] bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url + "&v=" + version} alt={isSeal ? "Saved seal" : "Saved signature"} className="h-24" />
        </div>
      ) : hasSignature === false ? (
        <p className="text-sm text-amber-900">{isSeal ? "No seal saved yet." : "No signature saved yet."}</p>
      ) : null}
      <form onSubmit={upload} className="flex flex-wrap items-center gap-3">
        <input name="file" type="file" accept="image/png,image/jpeg,image/webp" required className="text-sm" />
        <button type="submit" className="btn btn-primary text-sm" disabled={busy}>
          {busy ? "Saving..." : hasSignature ? (isSeal ? "Replace seal" : "Replace signature") : isSeal ? "Save seal" : "Save signature"}
        </button>
        {hasSignature ? (
          <button type="button" className="btn btn-secondary text-sm" disabled={busy} onClick={remove}>
            Remove
          </button>
        ) : null}
      </form>
      {msg ? <p className="text-sm text-[var(--stone)]">{msg}</p> : null}
    </section>
  );
}
